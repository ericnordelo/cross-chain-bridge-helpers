import { L2Bridge } from '../src/lib/bridges/layer2s/L2Bridge';
import { BigNumber } from 'ethers';
import { assert } from 'chai';

describe('Plugin', function () {
  it('assert true', function () {
    assert.ok(true);
  });

  it('runs', async function () {
    const bridge = new L2Bridge('Optimism-L1L2');
    await bridge.loadProviders();

    await bridge.getCrossChainTxConfigBytes(
      '0x4A8Cc549c71f12817F9aA25F7f6a37EB1A4Fa087',
      '0xbc54330e6f09cca5c1c8ae5421b9481dd83cba12',
      '0x',
      BigNumber.from(0),
    );
  });
});
