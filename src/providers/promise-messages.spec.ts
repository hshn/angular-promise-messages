import * as angular from 'angular';
import 'angular-mocks/ngMock';
import { promiseMessagesModule } from '../module';
import { PromiseMessagesProvider } from './promise-messages';
import { StateConfigRegistry } from '../config/registry';

describe('PromiseMessagesProvider', () => {
  function loadModule(configurator: (config: PromiseMessagesProvider) => void) {
    const testModule = angular
      .module(`${promiseMessagesModule.name}.test`, [
        promiseMessagesModule.name
      ])
      .config(['promiseMessagesProvider', configurator]);

    angular.mock.module(testModule.name);
  }

  let promiseMessages: StateConfigRegistry;

  beforeEach(() => {

    loadModule(provider => {
      provider
        .state('none')
        .disableAutoReset()
        .end()
        .state('fulfilled')
        .setAutoResetDelay(200)
        .end()
    });

    angular.mock.inject((_promiseMessages_: StateConfigRegistry) => promiseMessages = _promiseMessages_);
  });

  it('state "none" should be configured correctly', () => {
    const none = promiseMessages.get('none');

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

  it('state config should be overridden', () => {
    const fulfilled = promiseMessages.get('fulfilled');

    expect(fulfilled.getAutoResetDelay()).toEqual(200);
    expect(fulfilled.override(500).getAutoResetDelay()).toEqual(500);
    expect(fulfilled.getAutoResetDelay()).toEqual(200);
  });
});
