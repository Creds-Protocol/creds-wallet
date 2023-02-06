// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interfaces/ICredential.sol";
import "./interfaces/IVerifier.sol";
import "./base/CredentialCore.sol";
import "./base/CredentialCreds.sol";
import "./base/CredsProtocolRegistry.sol";

/// @title CredsIssuer
contract CredsIssuer is ICredential, CredentialCore, CredentialCreds {
    
    address public credsIssuer;
    string public issuerName;
    string public issuerSymbol;
    uint256 public credsIssuedCount;

    address public credsProtocolRegistry = 0x414b893562f46f5180971c3389784A447581b2d3;

    /// @dev Gets a tree depth and returns its verifier address.
    mapping(uint256 => IVerifier) public verifiers;

    /// @dev Gets a cred id and returns the cred parameters.
    mapping(uint256 => Cred) public creds;
    
    /// @dev Checks if the cred issuer is the transaction sender.
    modifier onlyCredsIssuer() {
        if (credsIssuer == _msgSender()) {
            revert Credential__CallerIsNotTheCredIssuer();
        }
        _;
    }

    /// @dev Checks if there is a verifier for the given tree depth.
    /// @param merkleTreeDepth: Depth of the tree.
    modifier onlySupportedMerkleTreeDepth(uint256 merkleTreeDepth) {
        if (address(verifiers[merkleTreeDepth]) == address(0)) {
            revert Credential__MerkleTreeDepthIsNotSupported();
        }
        _;
    }

    /// @dev Initializes the Credential verifiers used to verify the user's ZK proofs.
    /// @param _verifiers: List of Credential verifiers (address and related Merkle tree depth).
    constructor(
        Verifier[] memory _verifiers,
        address _issuer,
        string memory _issuerName,
        string memory _issuerSymbol) 
    {
        for (uint8 i = 0; i < _verifiers.length; ) {
            verifiers[_verifiers[i].merkleTreeDepth] = IVerifier(_verifiers[i].contractAddress);

            unchecked {
                ++i;
            }
        }
        credsIssuer = _issuer;
        issuerName =_issuerName;
        issuerSymbol =_issuerSymbol; 
        CredsProtocolRegistry(credsProtocolRegistry).registerIssuer(_issuer, address(this));
        emit issuerRegistered(_issuer, _issuerName, _issuerSymbol);
    }

    function createCred(
        uint256 credId,
        uint256 merkleTreeDepth,
        uint256 zeroValue,
        address admin,
        string memory credURI
    ) internal onlySupportedMerkleTreeDepth(merkleTreeDepth) {
        _createCred(msg.sender, credId, merkleTreeDepth, zeroValue);

        creds[credId].admin = admin;
        creds[credId].credURI = credURI;
        creds[credId].merkleRootDuration = 1 hours;
        credsIssuedCount = credsIssuedCount + 1;
    }

    function createCred(
        uint256 credId,
        uint256 merkleTreeDepth,
        uint256 zeroValue,
        address admin,
        uint256 merkleTreeRootDuration,
        string memory credURI
    ) internal onlySupportedMerkleTreeDepth(merkleTreeDepth) {
        _createCred(msg.sender, credId, merkleTreeDepth, zeroValue);

        creds[credId].admin = admin;
        creds[credId].credURI = credURI;
        creds[credId].merkleRootDuration = merkleTreeRootDuration;
        credsIssuedCount = credsIssuedCount + 1;
    }

    function addIdentity(uint256 credId, uint256 identityCommitment) internal {
        _addIdentity(credId, identityCommitment);

        uint256 merkleTreeRoot = getMerkleTreeRoot(credId);

        creds[credId].merkleRootCreationDates[merkleTreeRoot] = block.timestamp;
    }

    function addIdentities(uint256 credId, uint256[] calldata identityCommitments)
        internal
    {
        for (uint8 i = 0; i < identityCommitments.length; ) {
            _addIdentity(credId, identityCommitments[i]);

            unchecked {
                ++i;
            }
        }

        uint256 merkleTreeRoot = getMerkleTreeRoot(credId);

        creds[credId].merkleRootCreationDates[merkleTreeRoot] = block.timestamp;
    }

    function updateIdentity(
        uint256 credId,
        uint256 identityCommitment,
        uint256 newIdentityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) internal {
        _updateIdentity(credId, identityCommitment, newIdentityCommitment, proofSiblings, proofPathIndices);
    }

    function removeIdentity(
        uint256 credId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) internal {
        _removeIdentity(credId, identityCommitment, proofSiblings, proofPathIndices);
    }

    function verifyProof(
        uint256 credId,
        uint256 merkleTreeRoot,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) internal {
        uint256 currentMerkleTreeRoot = getMerkleTreeRoot(credId);

        if (currentMerkleTreeRoot == 0) {
            revert Credential__CredDoesNotExist();
        }

        if (merkleTreeRoot != currentMerkleTreeRoot) {
            uint256 merkleRootCreationDate = creds[credId].merkleRootCreationDates[merkleTreeRoot];
            uint256 merkleRootDuration = creds[credId].merkleRootDuration;

            if (merkleRootCreationDate == 0) {
                revert Credential__MerkleTreeRootIsNotPartOfTheCred();
            }

            if (block.timestamp > merkleRootCreationDate + merkleRootDuration) {
                revert Credential__MerkleTreeRootIsExpired();
            }
        }

        if (creds[credId].nullifierHashes[nullifierHash]) {
            revert Credential__YouAreUsingTheSameNillifierTwice();
        }

        uint256 merkleTreeDepth = getMerkleTreeDepth(credId);

        IVerifier verifier = verifiers[merkleTreeDepth];

        _verifyProof(signal, merkleTreeRoot, nullifierHash, externalNullifier, proof, verifier);

        creds[credId].nullifierHashes[nullifierHash] = true;

        emit ProofVerified(credId, merkleTreeRoot, nullifierHash, externalNullifier, signal);
    }
}
