/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber, utils, providers } from 'ethers';
import { Bridge, IBridge } from '../types/bridge';
import { bridges } from '../../constants';

type Network = providers.Network;

export abstract class L2Bridge implements IBridge {
  public l1Provider: Provider;
  public l2Provider: Provider;

  public readonly bridgeId: string;

  constructor(public readonly bridge: Bridge) {
    // bridge Id is the firts 4 bytes of the keccak256 of the bridge (without the testnet)
    this.bridgeId = utils.id(this._formatBridgeForId(bridge)).slice(0, 10);
  }

  public async loadProviders(providers: { l1Provider: Provider; l2Provider: Provider }) {
    this.l1Provider = providers.l1Provider;
    this.l2Provider = providers.l2Provider;

    // check the chain Id to avoid using the wrong providers
    const l1Network = await this.l1Provider.getNetwork();
    const l2Network = await this.l2Provider.getNetwork();

    this._checkNetworks(l1Network, l2Network);
  }

  abstract getCrossChainTxConfigParameters(
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ): Promise<object>;

  abstract getCrossChainTxConfigBytes(
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
  ): Promise<string>;

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
