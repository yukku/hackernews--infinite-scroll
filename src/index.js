import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';
import reducer from './reducers';
import { Provider } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import App from './containers/App';
import './index.css';

const sagaMiddleware = createSagaMiddleware();

const initialState = {};
const store = createStore(
  reducer,
  initialState,
  compose(applyMiddleware(sagaMiddleware, logger))
);

sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
