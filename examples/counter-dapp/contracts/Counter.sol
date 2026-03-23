// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Simple counter contract — starter template for ADI Chain.
contract Counter {
    uint256 public number;

    event NumberSet(uint256 newNumber);
    event Incremented(uint256 newNumber);

    function setNumber(uint256 newNumber) public {
        number = newNumber;
        emit NumberSet(newNumber);
    }

    function increment() public {
        number++;
        emit Incremented(number);
    }
}
