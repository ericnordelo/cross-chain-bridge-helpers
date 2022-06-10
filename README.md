# Cross-Chain Bridge Helpers

This package is intented to be used alongside the Openzeppelin cross-chain libraries, to create the corresponding required bridge config for multiple bridges.

For now supports only Arbitrum and Optimism.

## Usage

1. Install the package:

   ```sh
   $ yarn add @ericnordelo/cross-chain-bridge-helpers
   ```

2. Add the `ccbh.js` config file with the required providers:

   ```sh
   require('dotenv').config();

   module.exports = {
      arbitrumL2Rpc: process.env.ARBITRUM_L2_RPC || '',
      arbitrumL1Rpc: process.env.ARBITRUM_L1_RPC || '',
      optimismL2Rpc: process.env.OPTIMISM_L2_RPC || '',
   };

   ```

3. Add the `.env` file with the required environment for the `ccbh.js` config file:

   ```sh
   ARBITRUM_L2_RPC=[your rpc uri]

   ARBITRUM_L1_RPC=[your rpc uri]

   OPTIMISM_L2_RPC=[your rpc uri]
   ```

4. Import the `L2Bridge` class, and load the providers after creating the instance:

   ```code
    import { L2Bridge } from '../src/lib/bridges/layer2s/L2Bridge';

    const bridge = new L2Bridge('Arbitrum');
    await bridge.loadProviders();
   ```

5. Now, you can use either the `getProtocolConfigParameters` or the `getProtocolConfigBytes` helpers, that will return the appropriate parameters from the selected protocol:

   ```code
    async getProtocolConfigParameters(
      sender: string,
      destAddr: string,
      l2CallDataHex: string,
      l2CallValue: BigNumber,
    ) : Promise<object>;

    async getProtocolConfigBytes(
      sender: string,
      destAddr: string,
      l2CallDataHex: string,
      l2CallValue: BigNumber,
    ): Promise<string>;
   ```

6. The `getProtocolConfigBytes` result, can be used as bridgeConfig in the Openzeppelin library.
