import request from 'superagent';
export const INIT_WITH_DATA = 'INIT_WITH_DATA';


export function input(data) {
    return {
        type : INIT_WITH_DATA,
        data : data
    };
}


export function optimizeRoute() {
    return function(dispatch, getState) {
        const route = getState().routing.route;
        const billboards = route.billboards.map(billboard => billboard.coord);

        request
            .post('http://routing.dancoat.es/')
            .send({ billboards : billboards })
            .set('Accept', 'application/json')
            .end(function(err, res){
                console.log(err, res);
            });

    };
}