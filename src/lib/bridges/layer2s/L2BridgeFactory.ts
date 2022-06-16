import { ArbitrumL1L2Bridge, ArbitrumL2L1Bridge } from './implementations/arbitrum';
import { OptimismL1L2Bridge, OptimismL2L1Bridge } from './implementations/optimism';
import { Bridge } from '../types/bridge';

export class L2BridgeFactory {
  static get(bridge: Bridge) {
    switch (bridge) {
      case 'Arbitrum-L1L2':
      case 'Arbitrum-L1L2-Rinkeby': {
        return new ArbitrumL1L2Bridge(bridge);
      }
      case 'Arbitrum-L2L1':
      case 'Arbitrum-L2L1-Rinkeby': {
        return new ArbitrumL2L1Bridge(bridge);
      }
      case 'Optimism-L1L2':
      case 'Optimism-L1L2-Kovan': {
        return new OptimismL1L2Bridge(bridge);
      }
      case 'Optimism-L2L1':
      case 'Optimism-L2L1-Kovan': {
        return new OptimismL2L1Bridge(bridge);
      }
    }
  }
}
