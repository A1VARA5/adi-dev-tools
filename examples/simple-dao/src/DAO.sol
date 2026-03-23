// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DAO
 * @notice Simple on-chain DAO with proposals, voting, and a treasury.
 *
 * Any address can submit a proposal (a description + an optional ETH spend request).
 * Token holders vote FOR or AGAINST. Once the voting window closes, anyone can
 * execute a passing proposal — which releases funds from the treasury to the
 * specified recipient.
 *
 * Rules:
 *  - 1 address = 1 vote per proposal
 *  - Proposals pass if FOR > AGAINST at the end of the voting window
 *  - A minimum quorum (% of total voters) must be reached for execution
 *  - Only passed proposals with value > 0 trigger a treasury transfer
 *
 * @dev Designed for the simple-dao example. No token-weighted voting —
 *      voting power is 1 per address. For production, integrate an ERC-20
 *      governance token and use snapshotting.
 *
 * Deploy:
 *   forge script script/DAO.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast \
 *     --private-key $TESTNET_PRIVATE_KEY
 */
contract DAO {
    // ─── Types ────────────────────────────────────────────────────────────────

    enum ProposalState { Active, Passed, Rejected, Executed }

    struct Proposal {
        uint256 id;
        address proposer;
        string  description;
        address payable recipient; // where funds go if executed
        uint256 value;             // ADI (wei) to release from treasury
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;          // block.timestamp
        ProposalState state;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    string  public name;
    address public immutable owner;

    uint256 public votingDuration;  // seconds
    uint256 public quorumPercent;   // 1–100, % of total registered members needed

    uint256 private _proposalCounter;
    uint256 public memberCount;

    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool)     public members;           // registered voters
    mapping(uint256 => mapping(address => bool)) public voted; // proposalId → addr → hasVoted

    // ─── Events ───────────────────────────────────────────────────────────────

    event MemberAdded(address indexed member);
    event ProposalCreated(uint256 indexed id, address indexed proposer, string description, uint256 value);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalFinalized(uint256 indexed id, ProposalState state);
    event ProposalExecuted(uint256 indexed id, address indexed recipient, uint256 value);
    event FundsReceived(address indexed from, uint256 amount);

    // ─── Errors ───────────────────────────────────────────────────────────────

    error Unauthorized();
    error AlreadyMember();
    error NotMember();
    error ProposalNotFound();
    error VotingClosed();
    error AlreadyVoted();
    error ProposalNotPassed();
    error ProposalAlreadyExecuted();
    error VotingStillOpen();
    error InsufficientTreasury();
    error QuorumNotReached();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyMember() {
        if (!members[msg.sender]) revert NotMember();
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    /**
     * @param _name            DAO name shown in the frontend
     * @param _votingDuration  How long each proposal is open for votes (seconds)
     * @param _quorumPercent   Minimum % of members that must vote for a result to count
     */
    constructor(string memory _name, uint256 _votingDuration, uint256 _quorumPercent) {
        name             = _name;
        votingDuration   = _votingDuration;
        quorumPercent    = _quorumPercent;
        owner            = msg.sender;

        // Owner is automatically a member
        members[msg.sender] = true;
        memberCount = 1;
        emit MemberAdded(msg.sender);
    }

    // ─── Receive treasury funds ───────────────────────────────────────────────

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    // ─── Membership ───────────────────────────────────────────────────────────

    /// @notice Owner can add members (voters).
    function addMember(address addr) external onlyOwner {
        if (members[addr]) revert AlreadyMember();
        members[addr] = true;
        memberCount++;
        emit MemberAdded(addr);
    }

    /// @notice Anyone can join as a member (open DAO model). Remove for invite-only.
    function join() external {
        if (members[msg.sender]) revert AlreadyMember();
        members[msg.sender] = true;
        memberCount++;
        emit MemberAdded(msg.sender);
    }

    // ─── Proposals ────────────────────────────────────────────────────────────

    /**
     * @notice Create a proposal. Any member can propose.
     * @param description  Human-readable description of the proposal
     * @param recipient    Address to receive treasury funds if executed (use address(0) for governance-only)
     * @param value        Amount of ADI (wei) to release. 0 = no treasury action.
     */
    function propose(
        string calldata description,
        address payable recipient,
        uint256 value
    ) external onlyMember returns (uint256 id) {
        if (value > 0 && value > address(this).balance) revert InsufficientTreasury();

        id = ++_proposalCounter;
        proposals[id] = Proposal({
            id:          id,
            proposer:    msg.sender,
            description: description,
            recipient:   recipient,
            value:       value,
            votesFor:    0,
            votesAgainst: 0,
            deadline:    block.timestamp + votingDuration,
            state:       ProposalState.Active
        });

        emit ProposalCreated(id, msg.sender, description, value);
    }

    // ─── Voting ───────────────────────────────────────────────────────────────

    /**
     * @notice Cast your vote on a proposal.
     * @param proposalId  ID of the proposal
     * @param support     true = FOR, false = AGAINST
     */
    function vote(uint256 proposalId, bool support) external onlyMember {
        Proposal storage p = _getActive(proposalId);
        if (voted[proposalId][msg.sender]) revert AlreadyVoted();

        voted[proposalId][msg.sender] = true;
        if (support) { p.votesFor++; } else { p.votesAgainst++; }

        emit VoteCast(proposalId, msg.sender, support);
    }

    // ─── Finalize ─────────────────────────────────────────────────────────────

    /**
     * @notice Finalize a proposal once its voting window has closed.
     *         Sets state to Passed or Rejected. Anyone can call this.
     */
    function finalize(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        if (p.id == 0) revert ProposalNotFound();
        if (p.state != ProposalState.Active) revert ProposalAlreadyExecuted();
        if (block.timestamp < p.deadline) revert VotingStillOpen();

        uint256 totalVotes = p.votesFor + p.votesAgainst;
        uint256 quorumNeeded = (memberCount * quorumPercent) / 100;

        if (totalVotes < quorumNeeded) {
            p.state = ProposalState.Rejected;
            emit ProposalFinalized(proposalId, ProposalState.Rejected);
            return;
        }

        if (p.votesFor > p.votesAgainst) {
            p.state = ProposalState.Passed;
        } else {
            p.state = ProposalState.Rejected;
        }

        emit ProposalFinalized(proposalId, p.state);
    }

    // ─── Execute ──────────────────────────────────────────────────────────────

    /**
     * @notice Execute a passed proposal — releases treasury funds if value > 0.
     *         Anyone can call this once the proposal has passed.
     */
    function execute(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        if (p.id == 0) revert ProposalNotFound();
        if (p.state != ProposalState.Passed) revert ProposalNotPassed();
        if (p.value > address(this).balance) revert InsufficientTreasury();

        p.state = ProposalState.Executed;

        if (p.value > 0 && p.recipient != address(0)) {
            (bool ok, ) = p.recipient.call{value: p.value}("");
            require(ok, "Transfer failed");
        }

        emit ProposalExecuted(proposalId, p.recipient, p.value);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    function proposalCount() external view returns (uint256) { return _proposalCounter; }
    function treasury()      external view returns (uint256) { return address(this).balance; }

    function getProposal(uint256 id) external view returns (
        uint256,   // id
        address,   // proposer
        string memory, // description
        address,   // recipient
        uint256,   // value
        uint256,   // votesFor
        uint256,   // votesAgainst
        uint256,   // deadline
        uint8      // state (0=Active,1=Passed,2=Rejected,3=Executed)
    ) {
        Proposal storage p = proposals[id];
        if (p.id == 0) revert ProposalNotFound();
        return (p.id, p.proposer, p.description, p.recipient, p.value,
                p.votesFor, p.votesAgainst, p.deadline, uint8(p.state));
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _getActive(uint256 id) internal view returns (Proposal storage p) {
        p = proposals[id];
        if (p.id == 0) revert ProposalNotFound();
        if (p.state != ProposalState.Active) revert VotingClosed();
        if (block.timestamp >= p.deadline) revert VotingClosed();
    }
}
