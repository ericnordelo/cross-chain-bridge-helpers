import { getBridgeConfigParams } from './lib/bridges/arbitrum';
import { BigNumber } from 'ethers';

async function main() {
  const bridgeConfig = await getBridgeConfigParams(
    '0x4A8Cc549c71f12817F9aA25F7f6a37EB1A4Fa087',
    '0xbc54330e6f09cca5c1c8ae5421b9481dd83cba12',
    '0x',
    BigNumber.from(1),
  );

  console.log(bridgeConfig);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
