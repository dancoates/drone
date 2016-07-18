import request from 'superagent';
export const INIT_WITH_DATA = 'INIT_WITH_DATA';
export const OPTIMIZE_PATH = 'OPTIMIZE_PATH';


export function input(data) {
    return {
        type : INIT_WITH_DATA,
        data : data
    };
}


export function optimizeRoute() {
    return function(dispatch, getState) {
        const route = getState().routing.route;
        const billboards = [[0,0]].concat(route.billboards.map(billboard => billboard.coord));

        request
            .post('http://routing.dancoat.es/')
            .send({ billboards : billboards })
            .set('Accept', 'application/json')
            .end(function(err, res){
                if(res.body && typeof res.body === 'object') {
                    dispatch({
                        type : OPTIMIZE_PATH,
                        path : res.body
                    });
                }
            });

    };
}