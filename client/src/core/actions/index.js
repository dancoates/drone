/** @module core/actions/index */

// Minimize requests to optimize API 
let loading = false;


import request from 'superagent';

/**
 * Action creator to manage getting input data.
 */
export const INIT_WITH_DATA = 'INIT_WITH_DATA';

/**
 * Action creator to manage getting input data.
 */
export function input(data) {
    return function(dispatch) {
        if(!loading) {
            dispatch({
                type : INIT_WITH_DATA,
                data : data
            });

            // Start calculating optimum route (can take a while)
            dispatch(optimizeRoute());
        } else {
            // rudimentary error handling :/
            alert('Please wait for optimization to finish before submitting another request');
        }
    };

}


/**
 * Action type for handling route optimization
 */
export const OPTIMIZE_PATH = 'OPTIMIZE_PATH';


/**
 * Request optimum route from API.
 * Passes an array of coordinates for billboards to API and receives a path.
 */
export function optimizeRoute() {
    return function(dispatch, getState) {
        const route = getState().routing.route;
        // move [0,0] to start of billboards so that we don't cheat by jumping to the
        // first billboard's location.
        const billboards = [[0,0]].concat(
            route.billboards.map(billboard => billboard.coord)
                            .filter(coord => coord[0] !== 0 || coord[1] !== 0) // Make sure there aren't duplicate [0,0] entries
        );

        // rudimentary measure to stop server melting
        if(billboards.length > 900) {
            return;
        }

        loading = true;
        // @TODO add error handling here.
        request
            .post('http://routing.dancoat.es/')
            .send({ billboards : billboards })
            .set('Accept', 'application/json')
            .end(function(err, res){
                loading = false;
                if(res.body && typeof res.body === 'object') {
                    dispatch({
                        type : OPTIMIZE_PATH,
                        resp : res.body
                    });
                }
            });

    };
}