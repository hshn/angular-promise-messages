import * as angular from 'angular';
import { SchedulerFactory } from './services/scheduler';
import { PromiseMessagesProviderImpl } from './providers/promise-messages';
import { PromiseMessagesController, PromiseMessagesDirective } from './directives/promise-messages';
import { PromiseMessageDirective } from './directives/promise-message';

export let promiseMessagesModule = angular
  .module('promiseMessages', [])
  .provider('promiseMessages', PromiseMessagesProviderImpl)
  .factory('promiseMessagesScheduler', SchedulerFactory)
  .directive('promiseMessages', PromiseMessagesDirective)
  .directive('promiseMessage', PromiseMessageDirective)
  .controller('PromiseMessagesController', PromiseMessagesController);
