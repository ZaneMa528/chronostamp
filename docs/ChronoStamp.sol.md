# ChronoStamp Contract

## Overview

The `ChronoStamp` contract is an ERC721 NFT contract that implements a badge claiming system with cryptographic signature verification. It allows users to claim badges (NFTs) by providing a valid signature from a trusted signer.

## Contract Details

- **License**: UNLICENSED
- **Solidity Version**: ^0.8.28
- **Inheritance**: ERC721, Ownable, IChronoStamp

## Complete Source Code

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

// IChronoStamp.sol
import "./interfaces/IChronoStamp.sol";

contract ChronoStamp is ERC721, Ownable, IChronoStamp {
    // State variables
    address public immutable trustedSigner;

    // Base URI for token metadata
    string public baseTokenURI;

    // NFT counter
    uint256 private nextTokenId;

    // Used to prevent replay attacks
    mapping(bytes32 => bool) private usedNonces;

    // Events
    event BadgeClaimed(address indexed recipient, uint256 indexed tokenId);

    // Constructor
    /**
     * @dev Initializes the contract with a base URI and a trusted signer.
     * @param _name The name of NFT collection.
     * @param _symbol The symbol of NFT collection.
     * @param _initialOwner The initial owner of the contract.
     * @param _trustedSigner The address of the trusted signer.
     * @param _baseTokenURI The base URI for the token metadata.
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _initialOwner,
        address _trustedSigner,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) Ownable(_initialOwner) {
        trustedSigner = _trustedSigner;
        baseTokenURI = _baseTokenURI;
        nextTokenId = 1; // Start token IDs from 1
    }

    // -------NFT Functions-------

    /**
     * @dev return the token URI for a given token ID.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, IChronoStamp) returns (string memory) {
        // Ensure the token exists
        _requireOwned(tokenId);
        // Return the full token URI
        return string(abi.encodePacked(baseTokenURI, "/", _toString(tokenId)));
    }

    // -------Claim Function-------
    /**
     * @dev Allows a user to claim a badge by providing a valid signature and nonce.
     * @param signature The signature from the trusted signer.
     * @param nonce A unique nonce to prevent replay attacks.
     */
    function claim(bytes memory signature, bytes32 nonce) external override {
        // Ensure the nonce has not been used
        require(!usedNonces[nonce], "ChronoStamp: Nonce already used");

        // Flag the nonce as used
        usedNonces[nonce] = true;

        // build the message hash
        // Format: keccak256(abi.encodePacked(msg.sender, nonce))
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, nonce));

        // Add the Ethereum signed message prefix to the message hash
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(
            messageHash
        );
        // Recover the signer address using the prefixed message hash
        address signer = ECDSA.recover(ethSignedMessageHash, signature);

        // Ensure the signer is the trusted signer
        require(signer == trustedSigner, "ChronoStamp: Invalid signature");

        // Mint the new badge (NFT)
        uint256 tokenIdToMint = nextTokenId;
        _safeMint(msg.sender, tokenIdToMint);

        // Increment the token ID for the next mint and emit event
        nextTokenId++;
        emit BadgeClaimed(msg.sender, tokenIdToMint);
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        // Convert uint256 to string using OpenZeppelin's Strings library
        return Strings.toString(value);
    }
}
```

## Key Features

### State Variables

- **`trustedSigner`**: Immutable address of the trusted signer who can authorize badge claims
- **`baseTokenURI`**: Base URI for token metadata storage
- **`nextTokenId`**: Counter for the next token ID to be minted
- **`usedNonces`**: Mapping to prevent replay attacks by tracking used nonces

### Events

- **`BadgeClaimed`**: Emitted when a badge is successfully claimed

### Functions

#### Constructor

Initializes the contract with collection details and trusted signer.

#### `tokenURI(uint256 tokenId)`

Returns the complete token URI for metadata retrieval.

#### `claim(bytes memory signature, bytes32 nonce)`

Main function for claiming badges with signature verification.

#### `_toString(uint256 value)` (Internal)

Utility function to convert uint256 to string.

## Security Features

1. **Replay Attack Prevention**: Uses nonces to ensure each signature can only be used once
2. **Signature Verification**: Verifies the signature against the trusted signer using ECDSA recovery
3. **Message Format**: Uses `keccak256(abi.encodePacked(msg.sender, nonce))` as the message hash
4. **Ownership Control**: Inherits from Ownable for administrative functions

## Usage Flow

1. **Deployment**: Contract is deployed with trusted signer and base URI
2. **Signature Generation**: Off-chain oracle generates signature for eligible users
3. **Claim Process**: User calls `claim()` with signature and unique nonce
4. **Verification**: Contract verifies signature and nonce
5. **Minting**: NFT is minted to the user's address
6. **Event Emission**: `BadgeClaimed` event is emitted
