// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Event.sol";

contract EventFactory {
    mapping(uint => EventContract) public clones;
    uint public cloneCount;

    function createEvent(
        address _nftCollection,
        uint _eventCapacity,
        string memory _eventName,
        uint _eventDate
    ) public returns (EventContract) {
        EventContract newEvent = new EventContract(
            _nftCollection,
            _eventCapacity,
            _eventName,
            _eventDate
        );

        cloneCount++;

        clones[cloneCount] = newEvent;
        return newEvent;
    }

    function getEventContract(uint _id) public view returns (EventContract) {
        require(_id <= cloneCount, "Event does not exist");
        return clones[_id];
    }
}
