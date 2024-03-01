// init.js
const { ethers } = require('ethers');
require('dotenv').config();
const ERC20ABI = require('../contracts/ERC20.json').abi;
const fundManagerABI = require('../contracts/FundManager.json').abi;

async function initialize() {
  try {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const fundManagerAddress = process.env.FUND_MANAGER;
    const privKey = process.env.PRIVATE_KEY0;
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.tornadoeth.cash/bsc');

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
