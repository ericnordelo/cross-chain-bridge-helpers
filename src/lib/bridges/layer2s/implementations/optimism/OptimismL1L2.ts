/* eslint-disable @typescript-eslint/no-explicit-any */
import { canonicalTransactionChainABI as ABI } from './ABIs';
import { Provider } from '@ethersproject/abstract-provider';
import { Bridge } from '../../../types/bridge';
import { BigNumber, utils, Contract } from 'ethers';
import { L2Bridge } from '../../L2Bridge';

export class OptimismL1L2Bridge extends L2Bridge {
  public l1Provider: Provider;
  public l2Provider: Provider;

  public readonly bridgeId: string;

  private canonicalTransactionChain: string;

  constructor(public readonly bridge: Bridge) {
    super(bridge);

    if (bridge == 'Optimism-L1L2') {
      this.canonicalTransactionChain = '0x5E4e65926BA27467555EB562121fac00D24E9dD2';
    } else if (bridge == 'Optimism-L1L2-Kovan') {
      this.canonicalTransactionChain = '0xf7B88A133202d41Fe5E2Ab22e6309a1A4D50AF74';
    }
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

    return utils.defaultAbiCoder.encode(
      ['bytes4', 'uint32', 'uint256'],
      [this.bridgeId, gasLimit, l2CallValue],
    );
  }

  private async _getCrossChainTxConfigParams(
    sender: string,
    destAddr: string,
    l2CallDataHex: string,
    l2CallValue: BigNumber,
    l2Provider: Provider,
  ): Promise<object> {
    const zero = BigNumber.from(0);

    let gasLimit;
    // if is a deposit
    if (l2CallValue.gte(zero)) {
      gasLimit = zero;
    } else {
      gasLimit = await l2Provider.estimateGas({
        from: sender,
        to: destAddr,
        data: l2CallDataHex,
        value: zero,
      });
    }

    // get current prepaid gas from CTC
    const ctc = new Contract(this.canonicalTransactionChain, ABI, this.l1Provider);
    const prepaidGas = await ctc.enqueueL2GasPrepaid();

    return {
      gasLimit: gasLimit > prepaidGas.toNumber() ? gasLimit : prepaidGas.toNumber(),
    };
  }
}
