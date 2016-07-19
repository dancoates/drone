import * as actions from 'core/actions';

import PathParser from 'core/util/path-parser';


/**
 * @module core/reducers/routing
 */

/**
 *
 * Handle routing actions and update state accordingly
 */
function routing(state, action) {

    // Parse route string and update state.routing.route
    // with organized oute data.
    if(action.type === actions.INIT_WITH_DATA) {
        const parser = new PathParser(action.data);
        const route = parser.parse();
        return Object.assign({}, state, {
            route : route,
            optimizedPath : null
        });
    }


    // Add optimized path returned from API to 
    // routing information
    if(action.type === actions.OPTIMIZE_PATH) {
        return Object.assign({}, state, {
            route : Object.assign({}, state.route, {
                optimizedPath : action.resp.route,
                optimizedDistance : action.resp.distance
            })
        });
    }
}

export default routing;