import routing from 'core/reducers/routing';

/**
 * @module core/reducers/index
 */

/**
 *
 * Inital state used as default state param in reducers.
 */
export const initialState = {
    routing : {}
};

/**
 *
 * Combine reducer functions into one, pass state slices and actions
 * to reducers
 */
function reducer(state = initialState, action) {
    return {
        routing : routing(state.routing, action)
    };  
}

export default reducer;