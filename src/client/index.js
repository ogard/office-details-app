/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { install, Effects } from 'redux-elmish';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'bootstrap/dist/css/bootstrap.css';
import { addLocaleData, IntlProvider } from 'react-intl';
import srLocaleData from 'react-intl/locale-data/sr';
import muiTheme from './muiTheme';
import './app.css';

import Main from './main';

addLocaleData(srLocaleData);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // podesavanje za verziju <= 2.11
    serialize: {
      options: true,
    },
    // podesavanje za verziju >= 2.12
    serializeAction: true,
    serializeState: true,
  }) : compose
;
const storeFactory = composeEnhancers(
  install(Main.init),
)(createStore);
/* eslint-enable no-underscore-dangle */

const safeUpdate = (model, action) => {
  let result;
  try {
    result = Main.update(model, action);
  } catch (e) {
    // TODO: notifikacija
    console.error(e);
    result = [model, Effects.none()];
  }
  return result;
};

const store = storeFactory(safeUpdate);

const renderApp = View => {
  const ConnectedView = connect(appState => ({ model: appState }))(View);

  render((
    <Provider store={store}>
      <IntlProvider locale="sr-Cyrl-RS">
        <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
          <ConnectedView />
        </MuiThemeProvider>
      </IntlProvider>
    </Provider>
  ), document.getElementById('root'));
};

renderApp(Main.View);
