const { ethers } = require('ethers');
require('dotenv').config();
const ERC20ABI = require('../contract-abi/ERC20.json').abi;
const fundManagerABI = require('../contract-abi/FundManager.json').abi;

async function initialize() {
  try {
    // Adding support for command line argument for network identifier
    const network = process.argv[2]; // Assumes 'npm start <network>' usage

    // Mapping network identifiers to environment variables and RPC URLs
    const networks = {
      ethereum: {
        tokenAddress: process.env.TOKEN_ADDRESS_ETHEREUM,
        fundManagerAddress: process.env.FUND_MANAGER_ETHEREUM,
        rpcURL: 'https://nd-294-644-098.p2pify.com/a10c91aef3a8c2e65c40afd72050a82b',
      },
      bsc: {
        tokenAddress: process.env.TOKEN_ADDRESS_BSC,
        fundManagerAddress: process.env.FUND_MANAGER_BSC,
        rpcURL: 'https://nd-217-204-155.p2pify.com/379ccd6673575fd7a096cc3f2a87be63',
      },
      arbitrum: {
        tokenAddress: process.env.TOKEN_ADDRESS_ARBITRUM,
        fundManagerAddress: process.env.FUND_MANAGER_ARBITRUM,
        rpcURL: 'https://nd-829-997-700.p2pify.com/790712c620e64556719c7c9f19ef56e3',
      },
      avalanche: {
        tokenAddress: process.env.TOKEN_ADDRESS_AVALANCHE,
        fundManagerAddress: process.env.FUND_MANAGER_AVALANCHE,
        rpcURL: 'https://avalanche-mainnet.core.chainstack.com/ext/bc/C/rpc/ca2eb5847285f2ae58cb659db1f9ea73',
      },
      optimism: {
        tokenAddress: process.env.TOKEN_ADDRESS_OPTIMISM,
        fundManagerAddress: process.env.FUND_MANAGER_OPTIMISM,
        rpcURL: 'https://optimism-mainnet.core.chainstack.com/7cb5109bd1c125224315d9b753cc0e45',
      },
      scroll: {
        tokenAddress: process.env.TOKEN_ADDRESS_SCROLL,
        fundManagerAddress: process.env.FUND_MANAGER_SCROLL,
        rpcURL: 'https://scroll-mainnet.core.chainstack.com/26406aa9a6209c7577a5ab1ff15243cd',
      },
      zksync: {
        tokenAddress: process.env.TOKEN_ADDRESS_ZKSYNC,
        fundManagerAddress: process.env.FUND_MANAGER_ZKSYNC,
        rpcURL: 'https://nd-559-202-193.p2pify.com/43eb159adcbe7f31f7f192309025670e',
      },
      base: {
        tokenAddress: process.env.TOKEN_ADDRESS_BASE,
        fundManagerAddress: process.env.FUND_MANAGER_BASE,
        rpcURL: 'https://base-mainnet.core.chainstack.com/e7aa01c976c532ebf8e2480a27f18278',
      }
    };

    if (!networks[network]) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const tokenAddress = networks[network].tokenAddress;
    const fundManagerAddress = networks[network].fundManagerAddress;
    const rpcURL = networks[network].rpcURL;

    // Logging the selected network, token address, and RPC URL
    console.log(`Running on the ${network} network`);
    console.log(`Token Address: ${tokenAddress}`);
    console.log(`FundManager Address: ${fundManagerAddress}`);
    console.log(`RPC URL: ${rpcURL}`);

    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    const privKey = process.env.PRIVATE_KEY0;
    const wallet = new ethers.Wallet(privKey, provider);
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, wallet);
    const tokenDecimals = await tokenContract.decimals();
    const tokenSymbol = await tokenContract.symbol();
    const fundManager = new ethers.Contract(fundManagerAddress, fundManagerABI, wallet);

    return {
      tokenContract,
      tokenDecimals,
      tokenSymbol,
      wallet,
      fundManager,
    };
  } catch (error) {
    console.error("Error during initialization:", error.message);
    process.exit(1); // Exit the process if initialization fails
  }
}

module.exports = { initialize };
