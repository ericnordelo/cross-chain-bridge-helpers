# Cross-Chain Bridge Helpers

This package is intented to be used alongside the Openzeppelin cross-chain libraries, to create the corresponding required bridge config for multiple bridges.

For now supports only Arbitrum and Optimism.

## Usage

1. Install the package:

   ```sh
   $ yarn add @ericnordelo/cross-chain-bridge-helpers
   ```

2. Import the `L2BridgeFactory` class, and load the providers after getting the instance:

   ```code
    import { L2BridgeFactory } from '@ericnordelo/cross-chain-bridge-helpers';

    (...)

    const bridge = L2BridgeFactory.get('Arbitrum-L1L2');
    await bridge.loadProviders({ l1Provider, l2Provider });
   ```

3. The providers should be loaded separately. This gives you the power to integrate with different frameworks and enviroments, just passing the providers through (ex: hardhat). For now, the library requires using `ethers` providers. Here is an example:

   ```code
   import { L2BridgeFactory } from '@ericnordelo/cross-chain-bridge-helpers';
   import { providers } from 'ethers';
   import { config } from 'dotenv';

   config({ path: './path/to/.env' });

   const l1Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_L1_RPC);
   const l2Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_L2_RPC);

   const bridge = L2BridgeFactory.get('Arbitrum-L1L2-Rinkeby');
   await bridge.loadProviders({ l1Provider, l2Provider });
   ```

4. Now, you can use either the `getCrossChainTxConfigParameters` or the `getCrossChainTxConfigBytes` helpers, that will return the appropriate parameters from the selected bridge:

   ```code
    async getCrossChainTxConfigParameters(
      sender: string,
      destAddr: string,
      l2CallDataHex: string,
      l2CallValue: BigNumber,
    ) : Promise<object>;

    async getCrossChainTxConfigBytes(
      sender: string,
      destAddr: string,
      l2CallDataHex: string,
      l2CallValue: BigNumber,
    ): Promise<string>;
   ```

5. The `getCrossChainTxConfigBytes` result, can be used as bridgeConfig in the Openzeppelin library.

6. These are the accepted bridges in the current version:

   ```code
    export type Bridge =
      | 'Arbitrum-L1L2'
      | 'Arbitrum-L2L1'
      | 'Optimism-L1L2'
      | 'Optimism-L2L1'
      | 'Arbitrum-L1L2-Rinkeby'
      | 'Arbitrum-L2L1-Rinkeby'
      | 'Optimism-L1L2-Kovan'
      | 'Optimism-L2L1-Kovan';
   ```
