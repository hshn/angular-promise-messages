# angular-promise-messages

[![Build Status](https://travis-ci.org/hshn/angular-promise-messages.svg?branch=master)](https://travis-ci.org/hshn/angular-promise-messages) [![Dependency Status](https://david-dm.org/hshn/angular-promise-messages.svg)](https://david-dm.org/hshn/angular-promise-messages)

The `promiseMessages` module provides enhanced support for displaying messages depending on some promise within templates.

- [Demo](http://plnkr.co/edit/FS9kLOJLKxMpXdYLdupS?p=preview)

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

## Basic usage

Use the attribute `for` to pass a promise to a directive. Then the directive starts watching the promise.

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

## Function support

Use the attribute `forAction` when you want to pass a promise which will be returned by a function.

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

## Auto resetting state

Resetting a promise state automatically when the state is changed by configuring delays until reset.

It is useful if want to reset a message when a promise state was changed (such as rejected).

### Configure globally

```js
.config(function (promiseMessagesProvider) {
    promiseMessagesProvider
        // will reset state after 3000ms when fulfilled
        .state('fulfilled')
            .setAutoResetDelay(3000)
        .end()
        // will reset state after 500ms when rejected
        .state('rejected')
            .setAutoResetDelay(500)
        .end()
})
```

### Overriding global configurations

- `disableAutoReset`: Disable auto resetting
- `autoResetDelay`: Override auto resetting delay

```html
<promise-messages for="promise">
    <promise-message>Default</promise-message>
    <promise-message when="pending">Pending</promise-message>
    <!-- Disable auto resetting -->
    <promise-message when="fulfilled" disable-auto-reset>Fulfilled</promise-message>
    <!-- Override auto resetting delay -->
    <promise-message when="rejected" auto-reset-delay="1500">Rejected</promise-message>
</promise-messages>
```

# Contribution

1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request :D
