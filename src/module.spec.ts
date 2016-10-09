import * as angular from 'angular';
import 'angular-mocks/ngMock';
import { promiseMessagesModule } from './module';
import { CurrentStates } from './directives/promise-messages';

import IAugmentedJQuery = angular.IAugmentedJQuery;
import IScope = angular.IScope;
import IPromise = angular.IPromise;
import IQService = angular.IQService;
import ITimeoutService = angular.ITimeoutService;
import Spy = jasmine.Spy;

function testModule() {
  return angular.module(`${promiseMessagesModule.name}.test`, [promiseMessagesModule.name])
}

describe('PromiseMessagesDirective', () => {

  interface Scope extends IScope {
    $state?: CurrentStates
    promise?: IPromise<any>
    action?: Spy
  }

  let $element: IAugmentedJQuery, $scope: Scope;

  beforeEach(function () {
    const module = testModule()
      .config(promiseMessagesProvider => {
        promiseMessagesProvider
          .state('rejected')
          .setAutoResetDelay(500)
          .end()
          .state('pending')
          .setAutoResetDelay(1000)
          .end()
    });

    angular.mock.module(module.name);
    angular.mock.inject(($compile, $rootScope) => {
      $element = $compile(`
        <promise-messages state="$state" for="promise" for-action="action()">
            <promise-message>none</promise-message>
            <promise-message when="pending" disable-auto-reset>pending</promise-message>
            <promise-message when="rejected">rejected</promise-message>
            <promise-message when="fulfilled" auto-reset-delay="300">fulfilled</promise-message>
        </promise-messages>
      `)($scope = $rootScope.$new());
      $scope.$digest();
    });
  });

  it('should expose controller', () => {
    expect($scope.$state).toBeTruthy();
    expect($scope.$state.name).toEqual('none');
    expect($scope.$state.none).toEqual(true);
    expect($scope.$state.pending).toEqual(false);
    expect($scope.$state.rejected).toEqual(false);
    expect($scope.$state.fulfilled).toEqual(false);
  });

  describe('for attribution', () => {
    let $q: IQService;
    beforeEach(() => {
      angular.mock.inject((_$q_: IQService) => $q = _$q_);
    });

    it('should display "none" until promise is set', () => {
      expect($element.text().trim()).toEqual('none');
    });

    it('should display "pending" while promise is pending', () => {
      let defer = $q.defer();

      $scope.promise = defer.promise;
      $scope.$digest();

      expect($element.text().trim()).toEqual('pending');
    });

    it('should display "fulfilled" when promise is fulfilled', () => {
      let defer = $q.defer();

      $scope.promise = defer.promise;
      $scope.$digest();

      defer.resolve();
      $scope.$digest();

      expect($element.text().trim()).toEqual('fulfilled');
    });

    it('should display "rejected" when promise is rejected', () => {
      let defer = $q.defer();

      $scope.promise = defer.promise;
      $scope.$digest();

      defer.reject();
      $scope.$digest();

      expect($element.text().trim()).toEqual('rejected');
    });
  });

  describe('forAction attribution', () => {
    let $q: IQService;
    beforeEach(() => {
      angular.mock.inject((_$q_: IQService) => $q = _$q_);
    });

    it('should display "none" until trigger action', () => {
      expect($element.text().trim()).toEqual('none');
    });

    it('should display "pending" when action is triggered', () => {
      let defer = $q.defer();

      $scope.action = jasmine.createSpy('action()');
      $scope.action.and.returnValue(defer.promise);

      $element.triggerHandler('click');
      expect($element.text().trim()).toEqual('pending');
    });

    it('should display "fulfilled" when action is resolved', () => {
      let defer = $q.defer();

      $scope.action = jasmine.createSpy('action()');
      $scope.action.and.returnValue(defer.promise);

      $element.triggerHandler('click');

      defer.resolve();
      $scope.$digest();
      expect($element.text().trim()).toEqual('fulfilled');
    });

    it('should display "fulfilled" when action is rejected', () => {
      let defer = $q.defer();

      $scope.action = jasmine.createSpy('action()');
      $scope.action.and.returnValue(defer.promise);

      $element.triggerHandler('click');

      defer.reject();
      $scope.$digest();
      expect($element.text().trim()).toEqual('rejected');
    });

    it('should digest scope after trigger the action', () => {
      let defer = $q.defer();

      $scope.action = jasmine.createSpy('action');
      $scope.action.and.returnValue(defer.promise);

      $element.triggerHandler('click');
      expect($scope.action).toHaveBeenCalled()
    });
  });

  describe('auto state resetting', () => {
    let $timeout: ITimeoutService, $q: IQService;
    beforeEach(() => {
      angular.mock.inject((_$timeout_: ITimeoutService, _$q_: IQService) => {
        $timeout = _$timeout_;
        $q = _$q_;
      })
    });

    it('should not reset state which has no auto reset delay', () => {
      $scope.$digest();

      expect($element.text().trim()).toEqual('none');

      $timeout.verifyNoPendingTasks();
    });

    it('should reset state after 500ms when rejected (global config)', () => {
      let defer = $q.defer();

      $scope.promise = defer.promise;
      $scope.$digest();

      defer.reject();
      $scope.$digest();

      expect($element.text().trim()).toEqual('rejected');

      $timeout.flush(499);
      expect($element.text().trim()).toEqual('rejected');

      $timeout.flush(1);
      expect($element.text().trim()).toEqual('none');
    });

    it('should reset state after 300ms when fulfilled (local config)', () => {
      let defer = $q.defer();

      $scope.promise = defer.promise;
      $scope.$digest();

      defer.resolve();
      $scope.$digest();

      expect($element.text().trim()).toEqual('fulfilled');

      $timeout.flush(299)
      expect($element.text().trim()).toEqual('fulfilled');

      $timeout.flush(1)
      expect($element.text().trim()).toEqual('none');
    });

    it('should not reset state when pending if disabled (local config)', () => {
      let defer = $q.defer();

      $scope.promise = defer.promise;
      $scope.$digest();

      expect($element.text().trim()).toEqual('pending');

      $timeout.verifyNoPendingTasks();
    });
  });
});
