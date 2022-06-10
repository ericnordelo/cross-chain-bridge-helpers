/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { Protocol, IBridge } from '../types/bridge';
import { getBridgeConfigParams as getArbitrumParams } from './implementations/arbitrum';
import { getBridgeConfigParams as getOptimismParams } from './implementations/optimism';
import { BigNumber, utils, providers } from 'ethers';
import { getConfig } from '../../config';

export class L2Bridge implements IBridge {
  public l1Provider: Provider;
  public l2Provider: Provider;

  constructor(public readonly protocol: Protocol) {}

  public async loadProviders() {
    const { config } = await getConfig();

    switch (this.protocol) {
      case 'Arbitrum': {
        this.l2Provider = new providers.JsonRpcProvider(config.arbitrumL2Rpc);
        this.l1Provider = new providers.JsonRpcProvider(config.arbitrumL1Rpc);
        break;
      }
      case 'Optimism': {
        this.l2Provider = new providers.JsonRpcProvider(config.optimismL2Rpc);
        break;
      }
    }
  }

  public async getProtocolConfigParameters(
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ): Promise<object> {
    switch (this.protocol) {
      case 'Arbitrum': {
        return getArbitrumParams(
          sender,
          destAddr,
          l2CallDataHex,
          l2CallValue,
          this.l1Provider,
          this.l2Provider,
        );
      }
      case 'Optimism': {
        return getOptimismParams(sender, destAddr, l2CallDataHex, l2CallValue, this.l2Provider);
      }
    }
  }

  public async getProtocolConfigBytes(
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ): Promise<string> {
    const params = await this.getProtocolConfigParameters(
      sender,
      destAddr,
      l2CallDataHex,
      l2CallValue,
    );

    switch (this.protocol) {
      case 'Arbitrum': {
        const arbParams = params as {
          gasLimit: BigNumber;
          maxSubmissionFee: BigNumber;
          maxFeePerGas: BigNumber;
          totalL2GasCosts: BigNumber;
        };

        return utils.defaultAbiCoder.encode(
          ['uint256', 'uint256', 'uint256', 'address', 'address', 'uint256', 'uint256'],
          [
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
      case 'Optimism': {
        // In Optimism just the gasLimit is encoded
        return utils.defaultAbiCoder.encode(['uint32'], [params]);
      }
    }
  }
}
