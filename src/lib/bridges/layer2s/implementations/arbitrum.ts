import { Provider } from '@ethersproject/abstract-provider';
import { L1ToL2MessageGasEstimator } from '@arbitrum/sdk';
import { BigNumber } from 'ethers';

export async function getCrossChainTxConfigParams(
  sender: string,
  destAddr: string,
  l2CallDataHex: string,
  l2CallValue: BigNumber,
  l1Provider: Provider,
  l2Provider: Provider,
): Promise<{
  gasLimit: BigNumber;
  maxSubmissionFee: BigNumber;
  maxFeePerGas: BigNumber;
  totalL2GasCosts: BigNumber;
}> {
  const estimator = new L1ToL2MessageGasEstimator(l2Provider);
  const l1GasPrice = await l1Provider.getGasPrice();

  return estimator.estimateAll(
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
