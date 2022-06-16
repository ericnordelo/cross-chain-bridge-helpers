/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { Bridge } from '../../../types/bridge';
import { BigNumber, utils } from 'ethers';
import { L2Bridge } from '../../L2Bridge';

export class ArbitrumL2L1Bridge extends L2Bridge {
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
    l2CallValue: BigNumber,
  ): Promise<object> {
    return {
      amountToDeposit: l2CallValue,
    };
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

    const arbParams = params as {
      amountToDeposit: BigNumber;
    };

    const amountToDeposit = arbParams.amountToDeposit;

    return utils.defaultAbiCoder.encode(['bytes4', 'uint256'], [this.bridgeId, amountToDeposit]);
  }
}
