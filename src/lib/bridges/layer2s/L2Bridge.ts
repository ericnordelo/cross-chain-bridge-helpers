/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { Bridge, IBridge } from '../types/bridge';
import { getCrossChainTxConfigParams as getArbitrumParams } from './implementations/arbitrum';
import { getCrossChainTxConfigParams as getOptimismParams } from './implementations/optimism';
import { BigNumber, utils, providers } from 'ethers';
import { getConfig } from '../../config';

export class L2Bridge implements IBridge {
  public l1Provider: Provider;
  public l2Provider: Provider;

  private _bridgeId: string;

  constructor(public readonly bridge: Bridge) {
    // bridge Id is the kaccak256 of the
    this._bridgeId = utils.id(bridge);
  }

  public async loadProviders() {
    const { config } = await getConfig();

    switch (this.bridge) {
      case 'Arbitrum-L1L2': {
        this.l2Provider = new providers.JsonRpcProvider(config.arbitrumL2Rpc);
        this.l1Provider = new providers.JsonRpcProvider(config.arbitrumL1Rpc);
        break;
      }
      case 'Arbitrum-L2L1': {
        // no blockchain query required
        break;
      }
      case 'Optimism-L1L2': {
        this.l2Provider = new providers.JsonRpcProvider(config.optimismL2Rpc);
        break;
      }
      case 'Optimism-L2L1': {
        // no blockchain query required
        break;
      }
    }
  }

  public async getCrossChainTxConfigParameters(
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ): Promise<object> {
    switch (this.bridge) {
      case 'Arbitrum-L1L2': {
        return getArbitrumParams(
          sender,
          destAddr,
          l2CallDataHex,
          l2CallValue,
          this.l1Provider,
          this.l2Provider,
        );
      }
      case 'Arbitrum-L2L1': {
        return {
          amountToDeposit: l2CallValue,
        };
      }
      case 'Optimism-L1L2': {
        return getOptimismParams(sender, destAddr, l2CallDataHex, l2CallValue, this.l2Provider);
      }
      case 'Arbitrum-L2L1': {
        return {
          gasLimit: 0,
        };
      }
    }
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

    switch (this.bridge) {
      case 'Arbitrum-L1L2': {
        const arbParams = params as {
          gasLimit: BigNumber;
          maxSubmissionFee: BigNumber;
          maxFeePerGas: BigNumber;
          totalL2GasCosts: BigNumber;
        };

        return utils.defaultAbiCoder.encode(
          ['bytes32', 'uint256', 'uint256', 'uint256', 'address', 'address', 'uint256', 'uint256'],
          [
            this._bridgeId,
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
      case 'Arbitrum-L2L1': {
        const arbParams = params as {
          amountToDeposit: BigNumber;
        };
        const amountToDeposit = arbParams.amountToDeposit;

        return utils.defaultAbiCoder.encode(
          ['bytes32', 'uint256'],
          [this._bridgeId, amountToDeposit],
        );
      }
      case 'Optimism-L1L2': {
        const optParams = params as {
          gasLimit: BigNumber;
        };
        const gasLimit = optParams.gasLimit;

        return utils.defaultAbiCoder.encode(['bytes32', 'uint32'], [this._bridgeId, gasLimit]);
      }
      case 'Optimism-L2L1': {
        return utils.defaultAbiCoder.encode(['bytes32', 'uint32'], [this._bridgeId, 0]);
      }
    }
  }
}
