import angular from 'angular';
import {PromiseMessagesDirective, PromiseMessagesController} from './directives/promise-messages';
import {PromiseMessageDirective} from './directives/promise-message';
import {PromiseMessagesProvider} from './providers/promise-messages';
import {SchedulerFactory} from './services/scheduler';

export default angular
    .module('promiseMessages', [])
    .provider('promiseMessages', PromiseMessagesProvider)
    .factory('promiseMessagesScheduler', SchedulerFactory)
    .directive('promiseMessages', PromiseMessagesDirective)
    .directive('promiseMessage', PromiseMessageDirective)
    .controller('PromiseMessagesController', PromiseMessagesController)
;
