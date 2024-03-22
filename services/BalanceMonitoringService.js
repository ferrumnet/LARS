// BalanceMonitoringService.js
const { ethers } = require('ethers');

class BalanceMonitoringService {
    constructor(fundManager, tokenContract, lowThreshold, highThreshold, tokenDecimals, tokenSymbol, balanceManagementService) {
      this.fundManager = fundManager;
      this.tokenContract = tokenContract;
      this.lowThreshold = lowThreshold;
      this.highThreshold = highThreshold;
      this.tokenDecimals = tokenDecimals;
      this.tokenSymbol = tokenSymbol;
      this.balanceManagementService = balanceManagementService;  
    }
  
    async checkBalance() {

        const LowThreshold = ethers.utils.formatUnits(this.lowThreshold, this.tokenDecimals);
        const HighThreshold = ethers.utils.formatUnits(this.highThreshold, this.tokenDecimals);

        const liquidity = await this.tokenContract.balanceOf(this.fundManager.address);
        
        if (liquidity >= 0) {
                
            const formattedBalance = ethers.utils.formatUnits(liquidity, this.tokenDecimals);
            const roundedBalance = parseFloat(formattedBalance).toFixed(3);
            console.log(`Current ${this.tokenSymbol} Token Balance in Fund Manager: ${roundedBalance} tokens`);
      
          const liquidityBN = ethers.BigNumber.from(liquidity);
      
          if (liquidityBN.gt(this.highThreshold)) {

                const excessLiquidity = liquidityBN.sub(this.highThreshold);
                console.log(`${this.tokenSymbol} Token balance exceeds high threshold (${HighThreshold}) by ${parseFloat(ethers.utils.formatUnits(excessLiquidity, this.tokenDecimals)).toFixed(3)}. Excess liquidity detected.\n`);
                await this.balanceManagementService.removeExcessLiquidity(excessLiquidity);

          } else if (liquidityBN.lt(this.lowThreshold)) {

                const liquidityShortfall = this.highThreshold.sub(liquidityBN);
                console.log(`${this.tokenSymbol} Token balance falls below low threshold (${LowThreshold}) by ${parseFloat(ethers.utils.formatUnits(liquidityShortfall, this.tokenDecimals)).toFixed(3)}. Liquidity replenishment needed.\n`);
                await this.balanceManagementService.addLiquidity(liquidityShortfall);
                
          } else {
                console.log(`${this.tokenSymbol} Token balance within acceptable threshold range {${LowThreshold} - ${HighThreshold}}\n`);
          }
        } else {
            console.log("Error fetching current token balance.");
        }
      }
      
    startMonitoring(intervalInSeconds) {
      // Set up periodic execution using setInterval
      this.monitoringInterval = setInterval(async () => {
        console.log("Checking balance...");
        await this.checkBalance();
      }, intervalInSeconds * 1000);
    }
  
    stopMonitoring() {
      // Stop the periodic execution
      clearInterval(this.monitoringInterval);
      console.log("Balance monitoring stopped.");
    }
  }

module.exports = BalanceMonitoringService;
