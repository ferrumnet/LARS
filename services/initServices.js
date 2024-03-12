// init.js
const { ethers } = require('ethers');
require('dotenv').config();
const ERC20ABI = require('../contract-abi/ERC20.json').abi;
const fundManagerABI = require('../contract-abi/FundManager.json').abi;

async function initialize() {
  try {
    const tokenAddress = process.env.TOKEN_ADDRESS_ETHEREUM;  // ARBI_TOKEN_ADDRESS
    const fundManagerAddress = process.env.FUND_MANAGER; // ARBI_FUND_MANAGER
    
    const privKey = process.env.PRIVATE_KEY0;
    const ethRPC = 'https://nd-294-644-098.p2pify.com/a10c91aef3a8c2e65c40afd72050a82b';
    const bscRPC = 'https://nd-217-204-155.p2pify.com/379ccd6673575fd7a096cc3f2a87be63';
    const arbiRPC = 'https://nd-829-997-700.p2pify.com/790712c620e64556719c7c9f19ef56e3';
    const provider = new ethers.providers.JsonRpcProvider(ethRPC);

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
