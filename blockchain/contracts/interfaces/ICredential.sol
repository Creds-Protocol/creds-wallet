//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title Credential interface.
/// @dev Interface of a Credential contract.
interface ICredential {
    error Credential__CallerIsNotTheCredIssuer();
    error Credential__MerkleTreeDepthIsNotSupported();
    error Credential__MerkleTreeRootIsExpired();
    error Credential__MerkleTreeRootIsNotPartOfTheCred();
    error Credential__YouAreUsingTheSameNillifierTwice();

    /// It defines all the cred parameters, in addition to those in the Merkle tree.
    struct Cred {
        address admin;
        string credURI;
        uint256 merkleRootDuration;
        mapping(uint256 => uint256) merkleRootCreationDates;
        mapping(uint256 => bool) nullifierHashes;
    }

    struct Verifier {
        address contractAddress;
        uint256 merkleTreeDepth;
    }

    /// @dev Emitted when an admin is assigned to a cred.
    /// @param issuerAddress: Address of the issuer
    /// @param issuerName: Name of the issuer
    /// @param issuerSymbol: Symbol of the issuer
    event issuerRegistered(
        address indexed issuerAddress, 
        string indexed issuerName, 
        string indexed issuerSymbol
    );

    /// @dev Emitted when a Credential proof is verified.
    /// @param credId: Id of the cred.
    /// @param merkleTreeRoot: Root of the Merkle tree.
    /// @param externalNullifier: External nullifier.
    /// @param nullifierHash: Nullifier hash.
    /// @param signal: Credential signal.
    event ProofVerified(
        uint256 indexed credId,
        uint256 merkleTreeRoot,
        uint256 externalNullifier,
        uint256 nullifierHash,
        bytes32 signal
    );
    
}