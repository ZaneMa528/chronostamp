# ChronoStampFactory Contract

## Overview

The `ChronoStampFactory` contract is a factory contract that creates and manages individual `ChronoStamp` NFT contracts. It provides a centralized way to deploy new badge contracts and track all deployed instances.

## Contract Details

- **License**: MIT
- **Solidity Version**: ^0.8.28
- **Inheritance**: IChronoStampFactory, Ownable

## Complete Source Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ChronoStamp.sol";
import "./interfaces/IChronoStampFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChronoStampFactory is IChronoStampFactory, Ownable {
    address[] public deployedBadges;

    constructor() Ownable(msg.sender) {
        // The factory is owned by the deployer
    }

    /// @notice Creates a new ChronoStamp contract instance
    /// @param name The name of the NFT collection
    /// @param symbol The symbol of the NFT collection
    /// @param baseTokenURI IPFS/URL prefix
    /// @param trustedSigner Public key address of the Oracle
    /// @return The address of the newly deployed ChronoStamp contract
    function createNewBadge(
        string memory name,
        string memory symbol,
        string memory baseTokenURI,
        address trustedSigner
    ) external returns (address) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(
            bytes(baseTokenURI).length > 0,
            "Base token URI cannot be empty"
        );
        require(
            trustedSigner != address(0),
            "Trusted signer address cannot be zero"
        );

        // Deploy a new ChronoStamp contract
        ChronoStamp badge = new ChronoStamp(
            name,
            symbol,
            msg.sender, // Initial owner is the factory creator
            trustedSigner,
            baseTokenURI
        );

        // Add the new badge to the deployed badges array
        deployedBadges.push(address(badge));

        // emit event to notify frontend
        emit BadgeCreated(msg.sender, address(badge));

        // Return the address of the newly created badge contract
        return address(badge);
    }

    /**
     * @dev Returns the total number of deployed badge contracts
     */
    function getTotalBadges() external view returns (uint256) {
        return deployedBadges.length;
    }

    /**
     * @dev Returns a paginated list of deployed badge contract addresses
     * @param offset Starting index in the deployedBadges array
     * @param limit Maximum number of addresses to return
     */
    function getBadgesPaginated(
        uint256 offset,
        uint256 limit
    ) external view returns (address[] memory) {
        uint256 total = deployedBadges.length;
        if (offset >= total) {
            return new address[](0);
        }
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        uint256 size = end - offset;
        address[] memory list = new address[](size);
        for (uint256 i = 0; i < size; i++) {
            list[i] = deployedBadges[offset + i];
        }
        return list;
    }
}
```

## Key Features

### State Variables

- **`deployedBadges`**: Array that stores the addresses of all deployed ChronoStamp contracts

### Events

- **`BadgeCreated`**: Emitted when a new ChronoStamp contract is deployed

### Functions

#### Constructor

Initializes the factory contract with the deployer as the owner.

#### `createNewBadge(string memory name, string memory symbol, string memory baseTokenURI, address trustedSigner)`

Main function for creating new ChronoStamp contracts.

**Parameters:**

- `name`: The name of the NFT collection
- `symbol`: The symbol of the NFT collection
- `baseTokenURI`: IPFS/URL prefix for metadata
- `trustedSigner`: Public key address of the Oracle

**Returns:**

- The address of the newly deployed ChronoStamp contract

**Validation:**

- Name cannot be empty
- Symbol cannot be empty
- Base token URI cannot be empty
- Trusted signer address cannot be zero

#### `getTotalBadges()`

Returns the total number of deployed badge contracts.

**Returns:**

- Total count of deployed contracts

#### `getBadgesPaginated(uint256 offset, uint256 limit)`

Returns a paginated list of deployed badge contract addresses.

**Parameters:**

- `offset`: Starting index in the deployedBadges array
- `limit`: Maximum number of addresses to return

**Returns:**

- Array of badge contract addresses

## Usage Flow

1. **Factory Deployment**: Deploy the ChronoStampFactory contract
2. **Badge Creation**: Call `createNewBadge()` with collection details
3. **Contract Deployment**: Factory deploys a new ChronoStamp contract
4. **Address Storage**: New contract address is stored in `deployedBadges` array
5. **Event Emission**: `BadgeCreated` event is emitted
6. **Address Return**: Factory returns the new contract address

## Benefits

1. **Centralized Management**: All ChronoStamp contracts are tracked in one place
2. **Easy Discovery**: Frontend can query all deployed contracts
3. **Standardized Deployment**: Ensures consistent contract creation
4. **Event Tracking**: Provides events for frontend integration
5. **Pagination Support**: Efficient querying of large numbers of contracts

## Integration with Frontend

The factory contract enables the frontend to:

- Discover all available badge collections
- Deploy new badge collections
- Track deployment events
- Query contract addresses efficiently
