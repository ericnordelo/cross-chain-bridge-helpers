/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { L1ToL2MessageGasEstimator } from '@arbitrum/sdk';
import { Bridge } from '../../../types/bridge';
import { BigNumber, utils } from 'ethers';
import { L2Bridge } from '../../L2Bridge';

export class ArbitrumL1L2Bridge extends L2Bridge {
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
      this.l1Provider,
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

    const arbParams = params as {
      gasLimit: BigNumber;
      maxSubmissionFee: BigNumber;
      maxFeePerGas: BigNumber;
      totalL2GasCosts: BigNumber;
    };

    return utils.defaultAbiCoder.encode(
      ['bytes4', 'uint256', 'uint256', 'uint256', 'address', 'address', 'uint256', 'uint256'],
      [
        this.bridgeId,
        arbParams.totalL2GasCosts,
        l2CallValue,
        arbParams.maxSubmissionFee,
        sender,
        sender,
        arbParams.gasLimit,
        arbParams.maxFeePerGas,
      ],
    );
  }

  private async _getCrossChainTxConfigParams(
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
}
