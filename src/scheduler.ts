import * as angular from 'angular';

import ITimeoutService = angular.ITimeoutService;
import IPromise = angular.IPromise;

export function scheduler($timeout: ITimeoutService, fn: () => void): Schedule {
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

export interface Schedule {
  (delay: number): void
}

