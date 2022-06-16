/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { Bridge } from '../../../types/bridge';
import { BigNumber, utils } from 'ethers';
import { L2Bridge } from '../../L2Bridge';

export class OptimismL2L1Bridge extends L2Bridge {
  public l1Provider: Provider;
  public l2Provider: Provider;

  public readonly bridgeId: string;

  constructor(public readonly bridge: Bridge) {
    super(bridge);
  }

  public async loadProviders(providers: { l1Provider: Provider; l2Provider: Provider }) {
    super.loadProviders(providers);
  }

  public async getCrossChainTxConfigParameters(
    _sender: string,
    _destAddr: string,
    _l2CallDataHex: string,
    _l2CallValue: BigNumber,
  ): Promise<object> {
    return {
      gasLimit: 0,
    };
  }

  public async getCrossChainTxConfigBytes(
    _sender: string,
    _destAddr: string,
    _l2CallDataHex: string,
    _l2CallValue: BigNumber,
  ): Promise<string> {
    return utils.defaultAbiCoder.encode(['bytes4', 'uint32'], [this.bridgeId, 0]);
  }
}
