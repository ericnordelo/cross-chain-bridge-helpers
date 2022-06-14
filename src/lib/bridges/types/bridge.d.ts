/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';

export type Bridge =
  | 'Arbitrum-L1L2'
  | 'Arbitrum-L2L1'
  | 'Optimism-L1L2'
  | 'Optimism-L2L1'
  | 'Arbitrum-L1L2-Rinkeby'
  | 'Arbitrum-L2L1-Rinkeby'
  | 'Optimism-L1L2-Kovan'
  | 'Optimism-L2L1-Kovan';

export interface IBridge {
  bridge: Bridge;
  bridgeId: string;
  l1Provider: Provider;
  l2Provider: Provider;
  getCrossChainTxConfigParameters: (
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ) => Promise<object>;
  getCrossChainTxConfigBytes: (
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ) => Promise<string>;
}
