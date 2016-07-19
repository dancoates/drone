import React from 'react';
import ReactDOM from 'react-dom';
import {compose, createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducers, {initialState} from 'core/reducers';

import App from 'core/components/app';

/**
 *
 * Main Drone component. 
 *
 */
class Drone {
    /**
     *
     * Sets up redux store with reducers and initial state.
     * Renders `App` component to DOM.
     */
    constructor() {
        /**
         *
         * The DOM element where the app should be rendered
         */
        this.element = document.getElementById('app');

        /**
         *
         * Reducers to handle state manipulation
         */
        this.reducers = reducers;

        /**
         *
         * Store instance to manage state and dispatching of actions
         */
        this.store = this.setUpStore();
        
        this.render();
    }

    /**
     *
     * Set up redux store with reducers and middleware
     * @return {Object} the store instance
     */
    setUpStore() {
        return createStore(this.reducers, initialState, compose(applyMiddleware(thunk)));
    }

    /**
     *
     * Render App into DOM
     */    
    render() {
        ReactDOM.render(
            <Provider store={this.store}>
                <App/>
            </Provider>,
            this.element
        );
    }
}

export default Drone;