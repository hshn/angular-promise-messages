# angular-promise-messages

[![Build Status](https://travis-ci.org/hshn/angular-promise-messages.svg?branch=master)](https://travis-ci.org/hshn/angular-promise-messages)

The `promiseMessages` module provides enhanced support for displaying messages depending on some promise within templates.

- [Demo](http://plnkr.co/edit/P5w7kyWfN2evpley82lt?p=preview)

# Installation

install via npm

```bash
npm install angular-promise-messages --save
```

install via bower

```bash
bower install angular-promise-messages --save
```

Add `promiseMessages` as dependency in your module:

```js
angular.module('yourModule', [
    'promiseMessages'
]);
```

```js
// es6 way
import promiseMessages from 'angular-promise-messages';

angular.module('yourModule', [
    promiseMessages.name
]);
```

# Usage

## Basic usage (listening promise)

```html
<promise-messages for="promise">
    <!-- Default message -->
    <promise-message>Default</promise-message>
    <!-- Pending message -->
    <promise-message when="pending">Pending</promise-message>
    <!-- Fulfilled message -->
    <promise-message when="fulfilled">Fulfilled</promise-message>
    <!-- Rejected message -->
    <promise-message when="rejected">Rejected</promise-message>
</promise-messages>
```

```js
function someAction () {
  // Passing a promise object to the `for` attribute
  // of the `promiseMessages` directive
  $scope.promise = $http.get('http://...');
}
```

## Function support (listening promise that is returned by function)

Use the attribute `forAction` when you want to specify a function that returns promise.

```html
<promise-messages for-action="functionThatReturnsPromise()">
    <promise-message>Default</promise-message>
    <promise-message when="pending">Pending</promise-message>
    <promise-message when="fulfilled">Fulfilled</promise-message>
    <promise-message when="rejected">Rejected</promise-message>
</promise-messages>
```

```js
function functionThatReturnsPromise () {
  // Passing a promise object to the `forAction` attribute
  // of the `promiseMessages` directive by returning promise.
  return $http.get('http://...');
}
```

## Theming

If the `states` attribute is specified, states will be published into related scope.

Then, you can theme it as you want by using published states.

```html
<promise-messages for="promise" states="states" ng-disabled="states.pending"
                  ng-class="{'btn-default': states.none || states.pending, 'btn-danger': states.rejected, 'btn-success': states.resolved}">
    <promise-message>Default</promise-message>
    <promise-message when="pending">Pending</promise-message>
    <promise-message when="fulfilled">Fulfilled</promise-message>
    <promise-message when="rejected">Rejected</promise-message>
</promise-messages>
```

# Contribution

1. Fork it!
1. Create your feature branch: git checkout -b my-new-feature
1. Commit your changes: git commit -am 'Add some feature'
1. Push to the branch: git push origin my-new-feature
1. Submit a pull request :D
