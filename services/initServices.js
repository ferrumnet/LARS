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
        rpcURL: 'https://nd-294-644-098.p2pify.com/a10c91aef3a8c2e65c40afd72050a82b',
      },
      bsc: {
        tokenAddress: process.env.TOKEN_ADDRESS_BSC,
        rpcURL: 'https://nd-217-204-155.p2pify.com/379ccd6673575fd7a096cc3f2a87be63',
      },
      arbitrum: {
        tokenAddress: process.env.TOKEN_ADDRESS_ARBITRUM,
        rpcURL: 'https://nd-829-997-700.p2pify.com/790712c620e64556719c7c9f19ef56e3',
      }
    };

    if (!networks[network]) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const tokenAddress = networks[network].tokenAddress;
    const rpcURL = networks[network].rpcURL;

    // Logging the selected network, token address, and RPC URL
    console.log(`Running on the ${network} network`);
    console.log(`Token Address: ${tokenAddress}`);
    console.log(`RPC URL: ${rpcURL}`);

    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    const privKey = process.env.PRIVATE_KEY0;
    const wallet = new ethers.Wallet(privKey, provider);
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, wallet);
    const tokenDecimals = await tokenContract.decimals();
    const tokenSymbol = await tokenContract.symbol();
    const fundManagerAddress = process.env.FUND_MANAGER;
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
