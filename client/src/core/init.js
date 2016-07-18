import React from 'react';
import ReactDOM from 'react-dom';
import {compose, createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducers, {initialState} from 'core/reducers';

import App from 'core/components/app';


export default class Drone {
    constructor() {
        // The element where the app will be rendered
        this.element = document.getElementById('app');
        this.reducers = reducers;
        this.store = this.setUpStore();
        this.render();
    }

    setUpStore() {
        return createStore(this.reducers, initialState, compose(applyMiddleware(thunk)));
    }

    render() {
        ReactDOM.render(
            <Provider store={this.store}>
                <App/>
            </Provider>,
            this.element
        );
    }
}