//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {SNARK_SCALAR_FIELD} from "./CredentialConstants.sol";
import "../interfaces/ICredentialCreds.sol";
import "../zk-kit/incremental-merkle-tree.sol/IncrementalBinaryTree.sol";
import "../openzeppelin/contracts/utils/Context.sol";

/// @title Credential creds contract.
/// @dev The following code allows you to create, issue and withdraw creds.
/// You can use getters to obtain informations about creds (root, depth, number of leaves).
abstract contract CredentialCreds is Context, ICredentialCreds {
    using IncrementalBinaryTree for IncrementalTreeData;

    /// @dev Gets a cred id and returns the tree data.
    mapping(uint256 => IncrementalTreeData) internal merkleTree;

    /// @dev Creates a new cred by initializing the associated tree.
    /// @param credID: Id of the cred.
    /// @param merkleTreeDepth: Depth of the tree.
    /// @param zeroValue: Zero value of the tree.
    function _createCred(
        address issuer,
        uint256 credID,
        uint256 merkleTreeDepth,
        uint256 zeroValue
    ) internal virtual {
        if (credID >= SNARK_SCALAR_FIELD) {
            revert Credential__CredIdIsNotLessThanSnarkScalarField();
        }

        if (getMerkleTreeDepth(credID) != 0) {
            revert Credential__CredAlreadyExists();
        }

        merkleTree[credID].init(merkleTreeDepth, zeroValue);

        emit CredCreated(issuer, credID, merkleTreeDepth, zeroValue);
    }

    /// @dev Adds an identity commitment to an existing cred.
    /// @param credID: Id of the cred.
    /// @param identityCommitment: New identity commitment.
    function _addIdentity(uint256 credID, uint256 identityCommitment) internal virtual {
        if (getMerkleTreeDepth(credID) == 0) {
            revert Credential__CredDoesNotExist();
        }

        merkleTree[credID].insert(identityCommitment);

        uint256 merkleTreeRoot = getMerkleTreeRoot(credID);
        uint256 index = getNumberOfMerkleTreeLeaves(credID) - 1;

        emit IdentityAdded(credID, index, identityCommitment, merkleTreeRoot);
    }

    /// @dev Updates an identity commitment of an existing cred. A proof of membership is
    /// needed to check if the node to be updated is part of the tree.
    /// @param credID: Id of the cred.
    /// @param identityCommitment: Existing identity commitment to be updated.
    /// @param newIdentityCommitment: New identity commitment.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    function _updateIdentity(
        uint256 credID,
        uint256 identityCommitment,
        uint256 newIdentityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) internal virtual {
        if (getMerkleTreeRoot(credID) == 0) {
            revert Credential__CredDoesNotExist();
        }

        merkleTree[credID].update(identityCommitment, newIdentityCommitment, proofSiblings, proofPathIndices);

        uint256 merkleTreeRoot = getMerkleTreeRoot(credID);
        uint256 index = proofPathIndicesToIdentityIndex(proofPathIndices);

        emit IdentityUpdated(credID, index, identityCommitment, newIdentityCommitment, merkleTreeRoot);
    }

    /// @dev Removes an identity commitment from an existing cred. A proof of membership is
    /// needed to check if the node to be deleted is part of the tree.
    /// @param credID: Id of the cred.
    /// @param identityCommitment: Existing identity commitment to be removed.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    function _removeIdentity(
        uint256 credID,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) internal virtual {
        if (getMerkleTreeRoot(credID) == 0) {
            revert Credential__CredDoesNotExist();
        }

        merkleTree[credID].remove(identityCommitment, proofSiblings, proofPathIndices);

        uint256 merkleTreeRoot = getMerkleTreeRoot(credID);
        uint256 index = proofPathIndicesToIdentityIndex(proofPathIndices);

        emit IdentityRemoved(credID, index, identityCommitment, merkleTreeRoot);
    }

    /// @dev See {ICredentialCreds-getMerkleTreeRoot}.
    function getMerkleTreeRoot(uint256 credID) public view virtual override returns (uint256) {
        return merkleTree[credID].root;
    }

    /// @dev See {ICredentialCreds-getMerkleTreeDepth}.
    function getMerkleTreeDepth(uint256 credID) public view virtual override returns (uint256) {
        return merkleTree[credID].depth;
    }

    /// @dev See {ICredentialCreds-getNumberOfMerkleTreeLeaves}.
    function getNumberOfMerkleTreeLeaves(uint256 credID) public view virtual override returns (uint256) {
        return merkleTree[credID].numberOfLeaves;
    }

    /// @dev Converts the path indices of a Merkle proof to the identity commitment index in the tree.
    /// @param proofPathIndices: Path of the proof of membership.
    /// @return Index of a cred identity.
    function proofPathIndicesToIdentityIndex(uint8[] calldata proofPathIndices) private pure returns (uint256) {
        uint256 identityIndex = 0;

        for (uint8 i = uint8(proofPathIndices.length); i > 0; ) {
            if (identityIndex > 0 || proofPathIndices[i - 1] != 0) {
                identityIndex *= 2;

                if (proofPathIndices[i - 1] == 1) {
                    identityIndex += 1;
                }
            }

            unchecked {
                --i;
            }
        }

        return identityIndex;
    }
}
