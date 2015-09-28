import angular from 'angular';
import mocks from 'angular-mocks';
import module from '../../src/promise-messages-module';

describe('PromiseMessagesDirective', () => {
    beforeEach(() => {
        angular.mock.module(module.name);
    });

    describe('forAction', () => {
        let $element, $scope;
        beforeEach(() => {
            inject(($rootScope, $compile) => {
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
