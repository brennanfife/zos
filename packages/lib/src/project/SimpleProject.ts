import Proxy from '../proxy/Proxy';
import Logger from '../utils/Logger';
import ZWeb3 from '../artifacts/ZWeb3';
import Contract from '../artifacts/Contract';
import { ContractInterface } from './AppProject';
import BaseSimpleProject from './BaseSimpleProject';
import ProxyFactory from '../proxy/ProxyFactory';
import { TxParams } from '../artifacts/ZWeb3';

const log: Logger = new Logger('SimpleProject');

export default class SimpleProject extends BaseSimpleProject {
  public constructor(
    name: string = 'main',
    proxyFactory?: ProxyFactory,
    txParams: TxParams = {},
  ) {
    super(name, proxyFactory, txParams);
  }

  public async upgradeProxy(
    proxyAddress: string,
    contract: Contract,
    contractParams: ContractInterface = {},
  ): Promise<Contract> {
    const {
      implementationAddress,
      pAddress,
      initCallData,
    } = await this._setUpgradeParams(proxyAddress, contract, contractParams);
    const proxy = Proxy.at(pAddress, this.txParams);
    await proxy.upgradeTo(implementationAddress, initCallData);
    log.info(`Instance at ${proxyAddress} upgraded`);
    return contract.at(proxyAddress);
  }

  public async changeProxyAdmin(
    proxyAddress: string,
    newAdmin: string,
  ): Promise<Proxy> {
    const proxy: Proxy = Proxy.at(proxyAddress, this.txParams);
    await proxy.changeAdmin(newAdmin);
    log.info(`Proxy ${proxyAddress} admin changed to ${newAdmin}`);
    return proxy;
  }

  public async getAdminAddress(): Promise<string> {
    if (this.txParams.from)
      return new Promise(resolve => resolve(this.txParams.from));
    else return ZWeb3.defaultAccount();
  }
}
