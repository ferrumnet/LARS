// main.js
const { ethers } = require('ethers');
const { initialize } = require('./services/initServices');
const BalanceMonitoringService = require('./services/BalanceMonitoringService');
const BalanceManagementService = require('./services/BalanceManagementService');

async function main() {
  const {
    tokenContract,
    tokenDecimals,
    tokenSymbol,
    wallet,
    fundManager,
  } = await initialize();

  // Configure LARS parameters 
  const lowThreshold = ethers.utils.parseUnits('5', tokenDecimals);
  const formattedLowThreshold = ethers.utils.formatUnits(lowThreshold, tokenDecimals);
  console.log(`Low Threshold: ${formattedLowThreshold}`);


  const highThreshold = ethers.utils.parseUnits('15', tokenDecimals);
  const formattedHighThreshold = ethers.utils.formatUnits(highThreshold, tokenDecimals);
  console.log(`High Threshold: ${formattedHighThreshold}`);

  // Create instances of services
  const balanceManagementService = new BalanceManagementService(fundManager, tokenContract, tokenDecimals, tokenSymbol, wallet);
  const balanceMonitoringService = new BalanceMonitoringService(
    fundManager,
    tokenContract,
    lowThreshold,
    highThreshold,
    tokenDecimals,
    tokenSymbol,
    balanceManagementService,
  );

  // Start balance monitoring service with a 60-second interval
  balanceMonitoringService.startMonitoring(60);

  // To stop monitoring after a specific time or condition:
  // setTimeout(() => balanceMonitoringService.stopMonitoring(), 3600000); // Stop after 1 hour
}

main();
