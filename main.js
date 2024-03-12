const { ethers } = require('ethers');
const { initialize } = require('./services/initServices');
const BalanceMonitoringService = require('./services/BalanceMonitoringService');
const BalanceManagementService = require('./services/BalanceManagementService');

async function main() {
  // Assuming the command line arguments are: npm start <network> <lowThreshold> <highThreshold> <interval>
  // Reading the low threshold, high threshold, and interval time from command line arguments
  const lowThresholdArg = process.argv[3] || '500'; // Default to 500 if not provided
  const highThresholdArg = process.argv[4] || '1000'; // Default to 1000 if not provided
  const intervalArg = process.argv[5] || '180'; // Default to 180 seconds if not provided

  const {
    tokenContract,
    tokenDecimals,
    tokenSymbol,
    wallet,
    fundManager,
  } = await initialize();

  // Configure LARS parameters using command line arguments
  const lowThreshold = ethers.utils.parseUnits(lowThresholdArg, tokenDecimals);
  const formattedLowThreshold = ethers.utils.formatUnits(lowThreshold, tokenDecimals);
  console.log(`Low Threshold: ${formattedLowThreshold}`);

  const highThreshold = ethers.utils.parseUnits(highThresholdArg, tokenDecimals);
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

  // Start balance monitoring service with an interval passed through command line arguments
  balanceMonitoringService.startMonitoring(parseInt(intervalArg, 10));

  // To stop monitoring after a specific time or condition:
  // setTimeout(() => balanceMonitoringService.stopMonitoring(), 3600000); // Stop after 1 hour
}

main();
