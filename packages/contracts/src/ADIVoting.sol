// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ADIVoting
 * @notice Simple on-chain voting contract for ADI Chain.
 *         One wallet = one vote per proposal. Votes are public on-chain.
 *         For private/anonymous voting see Noir/Circom (not integrated with ADI yet).
 *
 * @dev Deploy on ADI Chain — ZK proofs happen automatically at the rollup layer.
 *      All transactions are batched and proved by Airbender, verified on Ethereum L1.
 *
 * @example
 *   forge script script/ADIVoting.s.sol --rpc-url https://rpc.ab.testnet.adifoundation.ai --broadcast
 */
contract ADIVoting {
    struct Proposal {
        string description;
        uint256 voteCount;
    }

    address public immutable owner;
    string public title;
    bool public active;

    Proposal[] public proposals;
    mapping(address => bool) public hasVoted;

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

    /// @notice Cast a vote for a proposal. Each address may vote once.
    function vote(uint256 proposalIndex) external whenActive {
        if (hasVoted[msg.sender]) revert AlreadyVoted();
        if (proposalIndex >= proposals.length) revert InvalidProposal();

        hasVoted[msg.sender] = true;
        proposals[proposalIndex].voteCount++;

        emit VoteCast(msg.sender, proposalIndex);
    }

    /// @notice Returns the number of proposals.
    function proposalCount() external view returns (uint256) {
        return proposals.length;
    }

    /// @notice Returns the index of the winning proposal (most votes). Ties go to the lower index.
    function winningProposal() external view returns (uint256 winnerIndex, string memory description, uint256 voteCount) {
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

    /// @notice Owner can close voting.
    function closeVoting() external onlyOwner whenActive {
        active = false;
        emit VotingClosed();
    }
}
