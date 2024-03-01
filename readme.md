# Liquidity Automated Replenishment Service (LARS)

## Introduction

Liquidity Automated Replenishment Service (LARS) is a vital component of the Ferrum Network designed to facilitate cross-chain swaps on MultiSwap while maintaining controlled liquidity levels. It operates within the Fund Manager Network Liquidity (FMNL), employing limited liquidity to avoid honeypots. LARS provides a systematic approach to liquidity replenishment, governed by high and low thresholds.

## Functionality

LARS automatically manages liquidity based on predefined thresholds. If the liquidity in the Fund Manager surpasses the LARS high threshold, excess liquidity is promptly removed. Conversely, if liquidity falls to or below the LARS low threshold, the service adds the necessary liquidity to restore optimal levels in the Fund Manager.

## Current LARS Thresholds

- **High Threshold**: USDC 10,000
- **Low Threshold**: USDC 5,000

## Services

### 1. main.js

`main.js` is the entry point for the Liquidity Automated Replenishment Service (LARS). It allows you to configure the low and high threshold, initializes the necessary services and automate the monitoring of the liquidity.

### 2. initServices.js

The `initServices.js` script plays a crucial role in initializing the Liquidity Automated Replenishment Service (LARS) application. This script is responsible for setting up the necessary environment, connecting to the Ethereum blockchain, initializing the token contract, and obtaining the required addresses.

### 3. Balance Monitoring Service

The `BalanceMonitoringService` periodically checks the token balance held by the fund manager and takes actions based on specified low and high thresholds.

### 4. Balance Management Service

The `BalanceManagementService` is responsible for adding liquidity when the balance falls below the low threshold and removing excess liquidity when it exceeds the high threshold.


## Prerequisites

Before you begin, ensure you have the following:

- Node.js installed on your machine.
- An Ethereum wallet with a private key.
- The necessary environment variables set in a .env file.

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/ferrumnet/LARS.git
    ```

2. Navigate to the project directory:

    ```bash
    cd LARS
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Configuration

Create a .env file in the root directory of the project with the following variables:

```env
TOKEN_ADDRESS=0xYourTokenAddress
FUND_MANAGER=0xYourFundManagerAddress
PRIVATE_KEY0=0xYourPrivateKey
```

## Usage

Run the application using:

```bash
node main.js
```