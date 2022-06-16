/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { Bridge } from '../../../types/bridge';
import { BigNumber, utils } from 'ethers';
import { L2Bridge } from '../../L2Bridge';

export class OptimismL1L2Bridge extends L2Bridge {
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
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ): Promise<object> {
    return this._getCrossChainTxConfigParams(
      sender,
      destAddr,
      l2CallDataHex,
      l2CallValue,
      this.l2Provider,
    );
  }

  public async getCrossChainTxConfigBytes(
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ): Promise<string> {
    const params = await this.getCrossChainTxConfigParameters(
      sender,
      destAddr,
      l2CallDataHex,
      l2CallValue,
    );

    const optParams = params as {
      gasLimit: BigNumber;
    };

    const gasLimit = optParams.gasLimit;

    return utils.defaultAbiCoder.encode(['bytes4', 'uint32'], [this.bridgeId, gasLimit]);
  }

  private async _getCrossChainTxConfigParams(
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
}
