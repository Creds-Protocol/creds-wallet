//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title CredentialNullifiers interface.
/// @dev Interface of CredentialNullifiers contract.
interface ICredentialNullifiers {
    /// @dev Emitted when a external nullifier is added.
    /// @param externalNullifier: External Credential nullifier.
    event ExternalNullifierAdded(uint256 externalNullifier);

    /// @dev Emitted when a external nullifier is removed.
    /// @param externalNullifier: External Credential nullifier.
    event ExternalNullifierRemoved(uint256 externalNullifier);
}
