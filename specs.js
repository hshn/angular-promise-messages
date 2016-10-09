Error.stackTraceLimit = Infinity;

global.jQuery = require('jquery');

require('core-js/es5');

var testContext = require.context('./src', true, /\.spec\.ts$/);

requireAll(testContext);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
