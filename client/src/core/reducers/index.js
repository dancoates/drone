// import { List } from 'immutable';

import routing from 'core/reducers/routing';

export const initialState = {
    routing : {}
};

export default function reducer(state = initialState, action) {

    return {
        routing : routing(state.routing, action)
    };  
}