import { L1ToL2MessageGasEstimator } from '@arbitrum/sdk';
import { getConfig } from '../utils';
import { providers } from 'ethers';

// const estimator: L1ToL2MessageGasEstimator = new L1ToL2MessageGasEstimator(provider);

export async function getBridgeConfigParams() {
  const config = await getConfig();

  console.log(config);
}
