/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { Bridge, IBridge } from '../types/bridge';
import { getCrossChainTxConfigParams as getArbitrumParams } from './implementations/arbitrum';
import { getCrossChainTxConfigParams as getOptimismParams } from './implementations/optimism';
import { BigNumber, utils, providers } from 'ethers';
import { bridges } from '../../constants';

type Network = providers.Network;

export class L2Bridge implements IBridge {
  public l1Provider: Provider;
  public l2Provider: Provider;

  public readonly bridgeId: string;

  constructor(public readonly bridge: Bridge) {
    // bridge Id is the kaccak256 of the bridge (without the testnet)
    this.bridgeId = utils.id(this._formatBridgeForId(bridge));
  }

  public async loadProviders(providers: { l1Provider: Provider; l2Provider: Provider }) {
    this.l1Provider = providers.l1Provider;
    this.l2Provider = providers.l2Provider;

    // check the chain Id to avoid using the wrong providers
    const l1Network = await this.l1Provider.getNetwork();
    const l2Network = await this.l2Provider.getNetwork();

    this._checkNetworks(l1Network, l2Network);
  }

  public async getCrossChainTxConfigParameters(
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ): Promise<object> {
    switch (this.bridge) {
      case 'Arbitrum-L1L2':
      case 'Arbitrum-L1L2-Rinkeby': {
        return getArbitrumParams(
          sender,
          destAddr,
          l2CallDataHex,
          l2CallValue,
          this.l1Provider,
          this.l2Provider,
        );
      }
      case 'Arbitrum-L2L1':
      case 'Arbitrum-L2L1-Rinkeby': {
        return {
          amountToDeposit: l2CallValue,
        };
      }
      case 'Optimism-L1L2':
      case 'Optimism-L1L2-Kovan': {
        return getOptimismParams(sender, destAddr, l2CallDataHex, l2CallValue, this.l2Provider);
      }
      case 'Optimism-L2L1':
      case 'Optimism-L2L1-Kovan': {
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
      case 'Arbitrum-L1L2':
      case 'Arbitrum-L1L2-Rinkeby': {
        const arbParams = params as {
          gasLimit: BigNumber;
          maxSubmissionFee: BigNumber;
          maxFeePerGas: BigNumber;
          totalL2GasCosts: BigNumber;
        };

        return utils.defaultAbiCoder.encode(
          ['bytes32', 'uint256', 'uint256', 'uint256', 'address', 'address', 'uint256', 'uint256'],
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
      case 'Arbitrum-L2L1':
      case 'Arbitrum-L2L1-Rinkeby': {
        const arbParams = params as {
          amountToDeposit: BigNumber;
        };
        const amountToDeposit = arbParams.amountToDeposit;

        return utils.defaultAbiCoder.encode(
          ['bytes32', 'uint256'],
          [this.bridgeId, amountToDeposit],
        );
      }
      case 'Optimism-L1L2':
      case 'Optimism-L1L2-Kovan': {
        const optParams = params as {
          gasLimit: BigNumber;
        };
        const gasLimit = optParams.gasLimit;

        return utils.defaultAbiCoder.encode(['bytes32', 'uint32'], [this.bridgeId, gasLimit]);
      }
      case 'Optimism-L2L1':
      case 'Optimism-L2L1-Kovan': {
        return utils.defaultAbiCoder.encode(['bytes32', 'uint32'], [this.bridgeId, 0]);
      }
    }
  }

  private _checkNetworks(l1Network: Network, l2Network: Network): void {
    if (l1Network.chainId != bridges[this.bridge].l1ChainId) {
      console.log('Error: Invalid l1 provider chain Id');
      process.exit(0);
    }
    if (l2Network.chainId != bridges[this.bridge].l2ChainId) {
      console.log('Error: Invalid l2 provider chain Id');
      process.exit(0);
    }
  }

  private _formatBridgeForId(bridge: Bridge): string {
    if (bridge.endsWith('-Rinkeby')) {
      return bridge.slice(0, -8);
    } else if (bridge.endsWith('-Kovan')) {
      return bridge.slice(0, -6);
    }

    return bridge;
  }
}
