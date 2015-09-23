import angular from 'angular';
import mocks from 'angular-mocks';
import module from '../../src/promise-messages-module';

describe('PromiseMessagesProvider', () => {

    function loadModule (configurator) {
        let testModule = angular.module(`${module.name}.test`, [module.name]).config(['promiseMessagesProvider', configurator || angular.noop]);
        angular.mock.module(testModule.name);
    }

    describe('willAutoReset()', () => {
        it('should be false when disableAutoReset()', () => {
            loadModule(provider => provider.disableAutoReset());

            angular.mock.inject(promiseMessages => {
                expect(promiseMessages.willAutoReset()).toBe(false);
            });
        });

        it('should be false when passing negative value to setAutoResetAfter()', () => {
            loadModule(provider => provider.setAutoResetAfter(-1));

            angular.mock.inject(promiseMessages => {
                expect(promiseMessages.willAutoReset()).toBe(false);
            });
        });
    });

    describe('getAutoResetAfter()', () => {
        it('should return 2000 as default value', () => {
            loadModule();
            angular.mock.module(promiseMessages => {
                expect(promiseMessages.getAutoResetAfter()).toEqual(2000);
            });
        });

        it('should return passed value', () => {
            loadModule(provider => provider.setAutoResetAfter(999));

            angular.mock.inject(promiseMessages => {
                expect(promiseMessages.getAutoResetAfter()).toEqual(999);
            });
        });

        it('should return -1 when disableAutoReset()', () => {
            loadModule(provider => provider.disableAutoReset());

            angular.mock.inject(promiseMessages => {
                expect(promiseMessages.getAutoResetAfter()).toEqual(-1);
            });
        });
    });
});
