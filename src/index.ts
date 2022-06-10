import { L2Bridge } from './lib/bridges/layer2s/L2Bridge';
import { BigNumber } from 'ethers';

async function main() {
  const bridge = new L2Bridge('Arbitrum');
  await bridge.loadProviders();

  const bridgeConfig = await bridge.getProtocolConfigParameters(
    '0x4A8Cc549c71f12817F9aA25F7f6a37EB1A4Fa087',
    '0xbc54330e6f09cca5c1c8ae5421b9481dd83cba12',
    '0x',
    BigNumber.from(0),
  );

  console.log(bridgeConfig);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
