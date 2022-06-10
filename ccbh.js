// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  arbitrumL2Rpc: process.env.ARBITRUM_L2_RPC || '',
  arbitrumL1Rpc: process.env.ARBITRUM_L1_RPC || '',
  optimismRPC: '',
};
