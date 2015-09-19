import angular from 'angular';
import {PromiseMessagesDirective, PromiseMessagesController} from './promise-messages';
import PromiseMessageDirective from './promise-message';

export default angular
    .module('promiseMessages', [])
    .directive('promiseMessages', PromiseMessagesDirective)
    .directive('promiseMessage', PromiseMessageDirective)
    .controller('PromiseMessagesController', PromiseMessagesController)
;
