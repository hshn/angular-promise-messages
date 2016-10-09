import * as angular from 'angular';
import { SchedulerFactory } from './services/scheduler';
import { PromiseMessagesProvider } from './providers/promise-messages';
import { PromiseMessagesController, PromiseMessagesDirective } from './directives/promise-messages';
import { PromiseMessageDirective } from './directives/promise-message';

export let promiseMessagesModule = angular
  .module('promiseMessages', [])
  .provider('promiseMessages', PromiseMessagesProvider)
  .factory('promiseMessagesScheduler', SchedulerFactory)
  .directive('promiseMessages', PromiseMessagesDirective)
  .directive('promiseMessage', PromiseMessageDirective)
  .controller('PromiseMessagesController', PromiseMessagesController);
