import * as angular from 'angular';
import { SchedulerFactory } from './services/scheduler';

export let promiseMessagesModule = angular
  .module('promiseMessages', [])
  .factory('promiseMessagesScheduler', SchedulerFactory);
