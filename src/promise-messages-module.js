import angular from 'angular';
import {PromiseMessagesDirective, PromiseMessagesController} from './directives/promise-messages';
import {PromiseMessageDirective} from './directives/promise-message';
import {PromiseMessagesProvider} from './providers/promise-messages';

export default angular
    .module('promiseMessages', [])
    .provider('promiseMessages', PromiseMessagesProvider)
    .directive('promiseMessages', PromiseMessagesDirective)
    .directive('promiseMessage', PromiseMessageDirective)
    .controller('PromiseMessagesController', PromiseMessagesController)
;
