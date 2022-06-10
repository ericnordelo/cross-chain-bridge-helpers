import { L1ToL2MessageGasEstimator } from '@arbitrum/sdk';
import { getConfig } from '../config';
import { providers, BigNumber } from 'ethers';

export async function getBridgeConfigParams(
  sender: string,
  destAddr: string,
  l2CallDataHex: string,
  l2CallValue: BigNumber,
): Promise<{
  gasLimit: BigNumber;
  maxSubmissionFee: BigNumber;
  maxFeePerGas: BigNumber;
  totalL2GasCosts: BigNumber;
}> {
  const { config } = await getConfig();

  const l2Provider = new providers.JsonRpcProvider(config.arbitrumL2Rpc);
  const l1Provider = new providers.JsonRpcProvider(config.arbitrumL1Rpc);

  const estimator = new L1ToL2MessageGasEstimator(l2Provider);

  const l1GasPrice = await l1Provider.getGasPrice();

  return await estimator.estimateAll(
    sender,
    destAddr,
    l2CallDataHex,
    l2CallValue,
    l1GasPrice,
    sender,
    sender,
    l1Provider,
  );
}
