import { L2Bridge } from '../src/lib/bridges/layer2s/L2Bridge';
import { BigNumber, providers } from 'ethers';
import { assert } from 'chai';
import { config } from 'dotenv';

config({ path: '../.env' });

describe('Plugin', function () {
  it('assert true', function () {
    assert.ok(true);
  });

  it('runs', async function () {
    const l1Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_L1_RPC);
    const l2Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_L2_RPC);

    const bridge = new L2Bridge('Arbitrum-L1L2-Rinkeby');
    await bridge.loadProviders({ l1Provider, l2Provider });

    await bridge.getCrossChainTxConfigBytes(
      '0x4A8Cc549c71f12817F9aA25F7f6a37EB1A4Fa087',
      '0xbc54330e6f09cca5c1c8ae5421b9481dd83cba12',
      '0x',
      BigNumber.from(0),
    );
  });
});
