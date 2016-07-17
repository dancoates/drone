export const INIT_WITH_DATA = 'INIT_WITH_DATA';

export function input(data) {
    return {
        type : INIT_WITH_DATA,
        data : data
    };
}