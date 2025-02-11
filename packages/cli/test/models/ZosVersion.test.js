'use strict';

import {
  checkVersion,
  isMigratableZosversion,
} from '../../src/models/files/ZosVersion';

contract('ZosVersion', function() {
  describe('functions', function() {
    describe('checkVersion', function() {
      context('when latest version', function() {
        it('returns true', function() {
          (() => checkVersion('2.2', 'zos.json')).should.not.throw();
        });
      });

      context('when version is undefined', function() {
        it('throws error', function() {
          (() => checkVersion(undefined, 'zos.json')).should.throw(
            /zos version identifier not found in/,
          );
        });
      });

      context('when version does not exact major and minor', function() {
        it('throws error on different major', function() {
          (() => checkVersion('3.2', 'zos.json')).should.throw(
            /Unrecognized zos version identifier/,
          );
        });

        it('throws error on different minor', function() {
          (() => checkVersion('2.3', 'zos.json')).should.throw(
            /Unrecognized zos version identifier/,
          );
        });
      });

      context(
        'when version is not the latest one, but a valid one',
        function() {
          it('does not fail nor returns true', function() {
            (() => checkVersion('2', 'zos.json')).should.not.throw(
              /Unrecognized zos version identifier/,
            );
            (() => checkVersion('2', 'zos.json')).should.not.throw(
              /zos version identifier not found in/,
            );
          });
        },
      );
    });

    describe('isMigratableZosversion', function() {
      context('when version is migratable', function() {
        it('returns false', function() {
          isMigratableZosversion('2').should.be.true;
        });
      });

      context('when version is the latest one', function() {
        it('returns true', function() {
          isMigratableZosversion('2.2').should.be.false;
        });
      });

      context('when version is null or undefined', function() {
        it('returns true', function() {
          isMigratableZosversion(undefined).should.be.false;
          isMigratableZosversion(null).should.be.false;
        });
      });
    });
  });
});
