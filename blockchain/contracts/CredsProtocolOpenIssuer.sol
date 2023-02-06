// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./CredsIssuer.sol";

contract CredsProtocolOpenIssuer is CredsIssuer {

    address public issuer;
    uint256 public credIdCounter;

    constructor(
        Verifier[] memory _verifiers,
        address _issuer,
        string memory _issuerName,
        string memory _issuerSymbol) CredsIssuer(_verifiers, _issuer, _issuerName, _issuerSymbol) {
        }

    function issueCred(
        uint256 merkleTreeDepth,
        uint256 zeroValue,
        address admin,
        string memory credURI
    ) public {
        credIdCounter = credIdCounter + 1;
        createCred(credIdCounter, merkleTreeDepth, zeroValue, admin, credURI);
    }

    function claimCred(
        uint256 credId,
        uint256 identityCommitment
    ) public {
        addIdentity(credId, identityCommitment);
    }

    function verifyCred(
        uint256 credId,
        uint256 merkleTreeRoot,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) public {
        verifyProof(credId, merkleTreeRoot, signal, nullifierHash, externalNullifier, proof);
    }
    
}