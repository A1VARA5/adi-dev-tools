// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Voting
 * @notice On-chain voting example dApp for ADI Chain.
 *         Features: multiple proposals, one-vote-per-wallet, owner close,
 *         winner query, and a vote results getter for frontends.
 *
 * @dev This is ADI Chain — ZK proofs happen automatically at the rollup level.
 *      You don't write any ZK code; just deploy your Solidity and Airbender
 *      handles the STARK→SNARK proof pipeline behind the scenes.
 *
 * Deploy:
 *   forge script script/Voting.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast --private-key $TESTNET_PRIVATE_KEY
 */
contract Voting {
    struct Proposal {
        string description;
        uint256 voteCount;
    }

    address public immutable owner;
    string public title;
    bool public active;
    uint256 public totalVotes;

    Proposal[] public proposals;
    mapping(address => bool) public hasVoted;
    mapping(address => uint256) public voterChoice;

    event VoteCast(address indexed voter, uint256 indexed proposalIndex);
    event VotingClosed();

    error AlreadyVoted();
    error InvalidProposal();
    error VotingNotActive();
    error Unauthorized();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier whenActive() {
        if (!active) revert VotingNotActive();
        _;
    }

    constructor(string memory _title, string[] memory _proposalDescriptions) {
        owner = msg.sender;
        title = _title;
        active = true;

        for (uint256 i = 0; i < _proposalDescriptions.length; i++) {
            proposals.push(Proposal({description: _proposalDescriptions[i], voteCount: 0}));
        }
    }

    /// @notice Cast a vote. Each address may vote once.
    function vote(uint256 proposalIndex) external whenActive {
        if (hasVoted[msg.sender]) revert AlreadyVoted();
        if (proposalIndex >= proposals.length) revert InvalidProposal();

        hasVoted[msg.sender] = true;
        voterChoice[msg.sender] = proposalIndex;
        proposals[proposalIndex].voteCount++;
        totalVotes++;

        emit VoteCast(msg.sender, proposalIndex);
    }

    /// @notice Returns all proposals with their vote counts in one call (for frontends).
    function getAllProposals()
        external
        view
        returns (string[] memory descriptions, uint256[] memory voteCounts)
    {
        descriptions = new string[](proposals.length);
        voteCounts = new uint256[](proposals.length);
        for (uint256 i = 0; i < proposals.length; i++) {
            descriptions[i] = proposals[i].description;
            voteCounts[i] = proposals[i].voteCount;
        }
    }

    /// @notice Returns the number of proposals.
    function proposalCount() external view returns (uint256) {
        return proposals.length;
    }

    /// @notice Returns the winning proposal index, description, and vote count.
    function winningProposal()
        external
        view
        returns (uint256 winnerIndex, string memory description, uint256 voteCount)
    {
        uint256 maxVotes = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVotes) {
                maxVotes = proposals[i].voteCount;
                winnerIndex = i;
            }
        }
        description = proposals[winnerIndex].description;
        voteCount = proposals[winnerIndex].voteCount;
    }

    /// @notice Owner closes voting permanently.
    function closeVoting() external onlyOwner whenActive {
        active = false;
        emit VotingClosed();
    }
}
