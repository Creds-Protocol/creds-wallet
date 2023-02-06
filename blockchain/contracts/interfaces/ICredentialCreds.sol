//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title CredentialCreds interface.
/// @dev Interface of a CredentialCreds contract.
interface ICredentialCreds {
    
    error Credential__CredDoesNotExist();
    error Credential__CredAlreadyExists();
    error Credential__CredIdIsNotLessThanSnarkScalarField();

    /// @dev Emitted when a new cred is created.
    /// @param issuer: Cred Issuer
    /// @param credId: Id of the cred.
    /// @param merkleTreeDepth: Depth of the tree.
    /// @param zeroValue: Zero value of the tree.
    event CredCreated(address indexed issuer, uint256 indexed credId, uint256 merkleTreeDepth, uint256 zeroValue);

    /// @dev Emitted when a new identity commitment is added.
    /// @param credId: Cred id of the cred.
    /// @param index: Identity commitment index.
    /// @param identityCommitment: New identity commitment.
    /// @param merkleTreeRoot: New root hash of the tree.
    event IdentityAdded(uint256 indexed credId, uint256 index, uint256 identityCommitment, uint256 merkleTreeRoot);

    /// @dev Emitted when an identity commitment is updated.
    /// @param credId: Cred id of the cred.
    /// @param index: Identity commitment index.
    /// @param identityCommitment: Existing identity commitment to be updated.
    /// @param newIdentityCommitment: New identity commitment.
    /// @param merkleTreeRoot: New root hash of the tree.
    event IdentityUpdated(
        uint256 indexed credId,
        uint256 index,
        uint256 identityCommitment,
        uint256 newIdentityCommitment,
        uint256 merkleTreeRoot
    );

    /// @dev Emitted when a new identity commitment is removed.
    /// @param credId: Cred id of the cred.
    /// @param index: Identity commitment index.
    /// @param identityCommitment: Existing identity commitment to be removed.
    /// @param merkleTreeRoot: New root hash of the tree.
    event IdentityRemoved(uint256 indexed credId, uint256 index, uint256 identityCommitment, uint256 merkleTreeRoot);

    /// @dev Returns the last root hash of a cred.
    /// @param credId: Id of the cred.
    /// @return Root hash of the cred.
    function getMerkleTreeRoot(uint256 credId) external view returns (uint256);

    /// @dev Returns the depth of the tree of a cred.
    /// @param credId: Id of the cred.
    /// @return Depth of the cred tree.
    function getMerkleTreeDepth(uint256 credId) external view returns (uint256);

    /// @dev Returns the number of tree leaves of a cred.
    /// @param credId: Id of the cred.
    /// @return Number of tree leaves.
    function getNumberOfMerkleTreeLeaves(uint256 credId) external view returns (uint256);
}
