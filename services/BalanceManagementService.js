// BalanceManagementService.js
const { ethers } = require('ethers');

class BalanceManagementService {
    constructor(fundManager, tokenContract, tokenDecimals, tokenSymbol, wallet) {
      this.fundManager = fundManager;
      this.tokenContract = tokenContract;
      this.tokenDecimals = tokenDecimals;
      this.tokenSymbol = tokenSymbol;
      this.wallet = wallet;
    }
  
    async addLiquidity(amount) {

      const walletBalance = await this.tokenContract.balanceOf(this.wallet.address);
      const formattedWalletBalance = parseFloat(ethers.utils.formatUnits(walletBalance, this.tokenDecimals)).toFixed(3);
      console.log(`Liquidity Manager Wallet Balance: ${this.tokenSymbol} ${formattedWalletBalance}`);

      const walletBalanceBN = ethers.BigNumber.from(walletBalance);

      if (walletBalanceBN.gte(amount)){ 
            console.log(`Adding liquidity: ${parseFloat(ethers.utils.formatUnits(amount, this.tokenDecimals)).toFixed(3)} ${this.tokenSymbol} tokens`);
            const approvalTx = await this.tokenContract.connect(this.wallet).approve(this.fundManager.address, amount);
            await approvalTx.wait();
            
            await this.tokenContract.connect(this.wallet).transfer(this.fundManager.address, amount);
            console.log(`Liquidity Added: ${parseFloat(ethers.utils.formatUnits(amount, this.tokenDecimals)).toFixed(3)} ${this.tokenSymbol} tokens`);
    } else {
        console.log("Insufficient balance in the Liquidity Manager wallet to add liquidity.");
      }
    }
  
    async removeExcessLiquidity(amount) {
      console.log(`Removing excess liquidity: ${parseFloat(ethers.utils.formatUnits(amount, this.tokenDecimals)).toFixed(3)} ${this.tokenSymbol} tokens`);
      await this.fundManager.connect(this.wallet).removeLiquidityByManager(this.tokenContract.address, amount);
    }
  }

module.exports = BalanceManagementService;
