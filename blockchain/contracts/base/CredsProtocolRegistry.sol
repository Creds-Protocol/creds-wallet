// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract CredsProtocolRegistry {

    mapping(address => address[]) public issuerContractAddress;
    mapping(address => bool) public isRegisteredIssuer;

    function registerIssuer(address _issuer, address _issuerContractAddress) external {
        issuerContractAddress[_issuer].push(_issuerContractAddress);
        isRegisteredIssuer[_issuer] = true;
    }

}