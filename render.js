/* globals document */
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./desktop/App.js');
ReactDOM.render(
  React.createElement(App.default, {}),
  document.getElementById('reactors')
);
