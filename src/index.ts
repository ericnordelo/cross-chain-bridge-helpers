import { getBridgeConfigParams } from './lib/bridges/arbitrum';

async function main() {
  await getBridgeConfigParams();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
