import * as angular from 'angular';
import 'angular-mocks/ngMock';
import { promiseMessagesModule } from '../module';

describe('ResetStateProviderService', () => {
  let $timeout, scheduler;
  beforeEach(() => {
    angular.mock.module(promiseMessagesModule.name);
    angular.mock.inject((_$timeout_, promiseMessagesScheduler) => {
      $timeout = _$timeout_;
      scheduler = promiseMessagesScheduler;
    });
  });

  it('should reset after 2000ms', () => {
    let reset = jasmine.createSpy('reset');
    let schedule = scheduler(reset);

    schedule(2000);

    $timeout.flush(1000);
    expect(reset).not.toHaveBeenCalled();

    $timeout.flush(1000);
    expect(reset).toHaveBeenCalled();
  });

  it('should prevent previous when scheduled', () => {
    let reset = jasmine.createSpy('reset');
    let schedule = scheduler(reset);

    schedule(2000);

    $timeout.flush(1000);
    expect(reset).not.toHaveBeenCalled();

    schedule(2000);

    $timeout.flush(1000);
    expect(reset).not.toHaveBeenCalled();

    $timeout.flush(1000);
    expect(reset).toHaveBeenCalled();
  });
});
