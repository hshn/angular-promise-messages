import * as angular from 'angular';

import ITimeoutService = angular.ITimeoutService;
import IPromise = angular.IPromise;

function scheduler($timeout: ITimeoutService, fn: () => void) {
  let timer: IPromise<void>;

  function clearTimer() {
    if (timer) {
      $timeout.cancel(timer);
      timer = null;
    }
  }

  function scheduleFn(delay: number) {
    if (delay >= 0) {
      timer = $timeout(fn, delay);
    }
  }

  return function schedule(delay: number) {
    clearTimer();
    scheduleFn(delay);
  }
}

SchedulerFactory.$inject = ['$timeout'];
export function SchedulerFactory($timeout: ITimeoutService): Scheduler {
  return fn => scheduler($timeout, fn);
}

export interface Scheduler {
  (fn: () => void): Schedule
}

export interface Schedule {
  (delay: number): void
}

