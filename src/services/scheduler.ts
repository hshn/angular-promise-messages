import * as angular from 'angular';
import { scheduler, Schedule } from '../scheduler';

import ITimeoutService = angular.ITimeoutService;
import IPromise = angular.IPromise;

SchedulerFactory.$inject = ['$timeout'];
export function SchedulerFactory($timeout: ITimeoutService): Scheduler {
  return fn => scheduler($timeout, fn);
}

export interface Scheduler {
  (fn: () => void): Schedule
}
