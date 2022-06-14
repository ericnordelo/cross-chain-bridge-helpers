import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';

export async function getCrossChainTxConfigParams(
  sender: string,
  destAddr: string,
  l2CallDataHex: string,
  l2CallValue: BigNumber,
  l2Provider: Provider,
): Promise<object> {
  const gasLimit = await l2Provider.estimateGas({
    from: sender,
    to: destAddr,
    data: l2CallDataHex,
    value: l2CallValue,
  });

  return {
    gasLimit,
  };
}
