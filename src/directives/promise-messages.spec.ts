import * as angular from 'angular';
import 'angular-mocks/ngMock';
import { promiseMessagesModule } from '../module';

describe('PromiseMessagesDirective', () => {
  beforeEach(() => {
    angular.mock.module(promiseMessagesModule.name);
  });

  describe('forAction', () => {
    let $element: angular.IAugmentedJQuery, $scope;
    beforeEach(() => {
      angular.mock.inject(($rootScope, $compile) => {
        $element = $compile('<promise-messages for-action="action()" />')($scope = $rootScope.$new());
        $scope.$digest();
      });
    });

    it('should bind event', () => {
      $scope.action = jasmine.createSpy('action()');
      expect($scope.action).not.toHaveBeenCalled();

      $element.triggerHandler('click');
      expect($scope.action).toHaveBeenCalled();
    });

    it('should unbind event when $destroy', () => {
      $scope.action = jasmine.createSpy('action()');

      $scope.$destroy();

      $element.triggerHandler('click');
      expect($scope.action).not.toHaveBeenCalled();
    });
  });
});
