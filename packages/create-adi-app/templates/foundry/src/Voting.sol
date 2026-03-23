// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {
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

    modifier onlyOwner() { if (msg.sender != owner) revert Unauthorized(); _; }
    modifier whenActive() { if (!active) revert VotingNotActive(); _; }

    constructor(string memory _title, string[] memory _proposals) {
        owner = msg.sender;
        title = _title;
        active = true;
        for (uint256 i = 0; i < _proposals.length; i++) {
            proposals.push(Proposal({description: _proposals[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposalIndex) external whenActive {
        if (hasVoted[msg.sender]) revert AlreadyVoted();
        if (proposalIndex >= proposals.length) revert InvalidProposal();
        hasVoted[msg.sender] = true;
        proposals[proposalIndex].voteCount++;
        emit VoteCast(msg.sender, proposalIndex);
    }

    function proposalCount() external view returns (uint256) { return proposals.length; }

    function closeVoting() external onlyOwner whenActive {
        active = false;
        emit VotingClosed();
    }
}
