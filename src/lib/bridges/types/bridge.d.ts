/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';

export type Protocol = 'Arbitrum' | 'Optimism';

export interface IBridge {
  protocol: Protocol;
  l1Provider: Provider;
  l2Provider: Provider;
  getProtocolConfigParameters: (
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ) => Promise<object>;
  getProtocolConfigBytes: (
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ) => Promise<string>;
}
