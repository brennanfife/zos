'use strict';

require('../../setup');

import { tryRemoveSwarmHash } from '../../../src/utils/Bytecode';

describe('contracts util functions', function() {
  describe('tryRemoveSwarmHash', function() {
    const contractBytecode = '01234567890abcdef';

    it('removes swarm hash from bytecode', function() {
      const swarmHash =
        '69b1869ae52f674ffccdd8f6d35de04d578a778e919a1b41b7a2177668e08e1a';
      const swarmHashWrapper = `65627a7a72305820${swarmHash}`;
      const metadata = `a1${swarmHashWrapper}0029`;
      const bytecode = `0x${contractBytecode}${metadata}`;

      tryRemoveSwarmHash(bytecode).should.eq(`0x${contractBytecode}a10029`);
    });

    it('removes swarm hash from the bytecode with more complex metadata', function() {
      const swarmHash =
        '69b1869ae52f674ffccdd8f6d35de04d578a778e919a1b41b7a2177668e08e1a';
      const swarmHashWrapper = `65627a7a72305820${swarmHash}`;
      const solcVersionWrapper = '64736f6c6343000509';
      const metadata = `a2${swarmHashWrapper}${solcVersionWrapper}0032`;
      const bytecode = `0x${contractBytecode}${metadata}`;

      tryRemoveSwarmHash(bytecode).should.eq(
        `0x${contractBytecode}a2${solcVersionWrapper}0032`,
      );
    });

    it('does not change the bytecode if swarm hash is under 32 bytes', function() {
      const invalidSwarmHash =
        '69b1869ae52f674ffccdd8f6d35de04d578a778e919a1b4';
      const swarmHashWrapper = `27a7a72305820${invalidSwarmHash}0029`;
      const bytecode = `0x${contractBytecode}a16560029${swarmHashWrapper}`;

      tryRemoveSwarmHash(bytecode).should.eq(bytecode);
    });

    it('does not change the bytecode if swarm hash prefix is invalid', function() {
      const swarmHash =
        '69b1869ae52f674ffccdd8f6d35de04d578a778e919a1b41b7a2177668e08e1a';
      const invalidSwarmHashWrapper = `a165627a7a72305821${swarmHash}0029`;
      const bytecode = `0x${contractBytecode}${invalidSwarmHashWrapper}`;

      tryRemoveSwarmHash(bytecode).should.eq(bytecode);
    });

    it('does not change the bytecode if metadata length is not reliable', function() {
      const swarmHash =
        '69b1869ae52f674ffccdd8f6d35de04d578a778e919a1b41b7a2177668e08e1a';
      const invalidSwarmHashWrapper = `a165627a7a72305821${swarmHash}9929`;
      const bytecode = `0x${contractBytecode}${invalidSwarmHashWrapper}`;

      tryRemoveSwarmHash(bytecode).should.eq(bytecode);
    });
  });
});
