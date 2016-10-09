import * as angular from 'angular';
import { SchedulerFactory } from './services/scheduler';
import { PromiseMessagesProvider } from './providers/promise-messages';
import { PromiseMessagesController } from './directives/promise-messages';

export let promiseMessagesModule = angular
  .module('promiseMessages', [])
  .provider('promiseMessages', PromiseMessagesProvider)
  .factory('promiseMessagesScheduler', SchedulerFactory)
  .controller('PromiseMessagesController', PromiseMessagesController);
