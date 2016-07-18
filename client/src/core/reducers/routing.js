import * as actions from 'core/actions';

import PathParser from 'core/util/path-parser';

export default function routing(state, action) {

    if(action.type === actions.INIT_WITH_DATA) {
        const parser = new PathParser(action.data);
        const route = parser.parse();
        return Object.assign({}, state, {
            route : route
        });
    }
}