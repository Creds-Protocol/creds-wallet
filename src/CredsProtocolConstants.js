export const CREDS_PROTOCOL_REGISTRY_ADDRESS = "0x414b893562f46f5180971c3389784A447581b2d3"

export const CREDS_PROTOCOL_REGISTRY_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isRegisteredIssuer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "issuerContractAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_issuer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_issuerContractAddress",
				"type": "address"
			}
		],
		"name": "registerIssuer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

export const EXAMPLE_ISSUER_ADDRESS = "0x849b8842C98f0492df069f61fE94158E6e966b91"

export const EXAMPLE_ISSUER_ABI = [
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "contractAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "merkleTreeDepth",
						"type": "uint256"
					}
				],
				"internalType": "struct ICredential.Verifier[]",
				"name": "_verifiers",
				"type": "tuple[]"
			},
			{
				"internalType": "address",
				"name": "_issuer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_issuerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_issuerSymbol",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "Credential__CallerIsNotTheCredIssuer",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "Credential__CredAlreadyExists",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "Credential__CredDoesNotExist",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "Credential__CredIdIsNotLessThanSnarkScalarField",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "Credential__MerkleTreeDepthIsNotSupported",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "Credential__MerkleTreeRootIsExpired",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "Credential__MerkleTreeRootIsNotPartOfTheCred",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "Credential__YouAreUsingTheSameNillifierTwice",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "credId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "merkleTreeDepth",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "zeroValue",
				"type": "uint256"
			}
		],
		"name": "CredCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "credId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "identityCommitment",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "merkleTreeRoot",
				"type": "uint256"
			}
		],
		"name": "IdentityAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "credId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "identityCommitment",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "merkleTreeRoot",
				"type": "uint256"
			}
		],
		"name": "IdentityRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "credId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "identityCommitment",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newIdentityCommitment",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "merkleTreeRoot",
				"type": "uint256"
			}
		],
		"name": "IdentityUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nullifierHash",
				"type": "uint256"
			}
		],
		"name": "NullifierHashAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "credId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "merkleTreeRoot",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "externalNullifier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nullifierHash",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "signal",
				"type": "bytes32"
			}
		],
		"name": "ProofVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "issuerAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "issuerName",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "issuerSymbol",
				"type": "string"
			}
		],
		"name": "issuerRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "credId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "identityCommitment",
				"type": "uint256"
			}
		],
		"name": "claimCred",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "credIdCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "creds",
		"outputs": [
			{
				"internalType": "address",
				"name": "admin",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "credURI",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "merkleRootDuration",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "credsIssuedCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "credsIssuer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "credsProtocolRegistry",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "credID",
				"type": "uint256"
			}
		],
		"name": "getMerkleTreeDepth",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "credID",
				"type": "uint256"
			}
		],
		"name": "getMerkleTreeRoot",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "credID",
				"type": "uint256"
			}
		],
		"name": "getNumberOfMerkleTreeLeaves",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "merkleTreeDepth",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "zeroValue",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "admin",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "credURI",
				"type": "string"
			}
		],
		"name": "issueCred",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "issuer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "issuerName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "issuerSymbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "verifiers",
		"outputs": [
			{
				"internalType": "contract IVerifier",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "credId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "merkleTreeRoot",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "signal",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "nullifierHash",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "externalNullifier",
				"type": "uint256"
			},
			{
				"internalType": "uint256[8]",
				"name": "proof",
				"type": "uint256[8]"
			}
		],
		"name": "verifyCred",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]