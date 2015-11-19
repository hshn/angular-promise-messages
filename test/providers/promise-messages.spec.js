import angular from 'angular';
import mocks from 'angular-mocks';
import module from '../../src/promise-messages-module';

describe('PromiseMessagesProvider', () => {

    function loadModule (configurator) {
        const testModule = angular.module(`${module.name}.test`, [module.name]).config(['promiseMessagesProvider', configurator || angular.noop]);

        angular.mock.module(testModule.name);
    }

    beforeEach(() => {
        let promiseMessages;

        loadModule(provider => {
            provider
                .state('none')
                    .disableAutoReset()
                .end()
                .state('fulfilled')
                    .setAutoResetDelay(200)
                .end()
        });

        angular.mock.inject(_promiseMessages_ => promiseMessages = _promiseMessages_)


        it('state "none" should be configured correctly', () => {
            const none = promiseMessages.get('none')

            expect(none).toBeTruthy();
            expect(none.willAutoReset()).toBe(false);
        });

        it('state "pending" should be configured correctory', () => {
            const pending = promiseMessages.get('pending');

            expect(pending).toBeTruthy();
            expect(pending.willAutoReset()).toBe(false);
        });

        it('state "rejected" should be configured correctory', () => {
            const rejected = promiseMessages.get('rejected');

            expect(rejected).toBeTruthy();
            expect(rejected.willAutoReset()).toBe(false);
        });

        it('state "fulfilled" should be configured correctory', () => {
            const fulfilled = promiseMessages.get('fulfilled');

            expect(fulfilled).toBeTruthy();
            expect(fulfilled.willAutoReset()).toBe(true);
            expect(fulfilled.getAutoResetDelay()).toEqual(200);
        });
    });
});
