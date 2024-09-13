// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract EventContract {
    IERC721 public nftCollection;
    uint public eventCapacity;
    mapping(address => bool) public attendees;
    string public eventName;
    uint public eventDate;
    uint public attendeesCount;

    constructor(
        address _nftCollection,
        uint _eventCapacity,
        string memory _eventName,
        uint _eventDate
    ) {
        nftCollection = IERC721(_nftCollection);
        eventCapacity = _eventCapacity;
        eventName = _eventName;
        eventDate = _eventDate;
    }

    function registerForEvent() external {
        require(msg.sender != address(0), "Address zero detected");
        require(
            nftCollection.balanceOf(msg.sender) > 0,
            "You do not own the required ticket"
        );
        require(block.timestamp < eventDate, "Event is over");
        require(attendees[msg.sender] == false, "Already registered");

        require(attendeesCount < eventCapacity, "Event is full");

        attendees[msg.sender] = true;
        attendeesCount++;
    }

    function hasRegistered(address _address) public view returns (bool) {
        return attendees[_address];
    }
}
