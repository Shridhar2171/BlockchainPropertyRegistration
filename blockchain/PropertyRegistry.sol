// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyRegistry {

    struct Property {
        uint256 propertyId;
        string location;
        string propertyType;
        uint256 area;
        string documentHash;
        address owner;
        uint256 registrationTime;
        bool verified;
    }

    mapping(uint256 => Property) public properties;

    mapping(uint256 => bool) public propertyExists;

    event PropertyRegistered(
        uint256 propertyId,
        address owner,
        string location,
        string documentHash
    );

    function registerProperty(
        uint256 _propertyId,
        string memory _location,
        string memory _propertyType,
        uint256 _area,
        string memory _documentHash
    ) public {

        require(
            !propertyExists[_propertyId],
            "Property already registered"
        );

        properties[_propertyId] = Property(
            _propertyId,
            _location,
            _propertyType,
            _area,
            _documentHash,
            msg.sender,
            block.timestamp,
            false
        );

        propertyExists[_propertyId] = true;

        emit PropertyRegistered(
            _propertyId,
            msg.sender,
            _location,
            _documentHash
        );
    }

    function verifyProperty(uint256 _propertyId) public {

        require(
            propertyExists[_propertyId],
            "Property does not exist"
        );

        properties[_propertyId].verified = true;
    }

    function getProperty(uint256 _propertyId)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            string memory,
            address,
            uint256,
            bool
        )
    {
        require(
            propertyExists[_propertyId],
            "Property does not exist"
        );

        Property memory p = properties[_propertyId];

        return (
            p.propertyId,
            p.location,
            p.propertyType,
            p.area,
            p.documentHash,
            p.owner,
            p.registrationTime,
            p.verified
        );
    }
}