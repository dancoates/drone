
export default class PathParser {
    constructor(path) {
        this.path = path;

        this.STARTPOS = [0,0];
        this.MOVE_MAP = {
            '<' : [0, -1], // Move -1 in x axis
            '>' : [0,  1], // Move +1 in x axis
            '^' : [1, -1], // Move -1 in y axis
            'v' : [1,  1]  // Move +1 in y axis
        };
    }

    parse() {
        const path = this.path;

        // Iterate over path instructions input and resolve drone location over time.
        // This reduce method mutates the result each iteration for performance reasons.
        return path.split('').reduce((result, action) => {

            // Movement Instruction
            if(this.MOVE_MAP[action]) {
                const axisIndex = this.MOVE_MAP[action][0]; // The axis to move in 0=x 1=y
                const delta     = this.MOVE_MAP[action][1]; // The amount to move

                result.currentpos[axisIndex] += delta; // Move it

                result.path.push([result.currentpos[0], result.currentpos[1]]); // Add new position
                                                                                // to path

                // Update upper and lower bounds if necessary
                result.bounds.lower[axisIndex] =
                    result.currentpos[axisIndex] < result.bounds.lower[axisIndex] ?
                        result.currentpos[axisIndex] : result.bounds.lower[axisIndex];

                result.bounds.upper[axisIndex] =
                    result.currentpos[axisIndex] > result.bounds.upper[axisIndex] ?
                        result.currentpos[axisIndex] : result.bounds.upper[axisIndex];


            // Take Photo instruction
            } else {

                // Save values for brevity
                const x = result.currentpos[0];
                const y = result.currentpos[1];
                
                // Save billboard index to billboardMap lookup map for easy access

                // Create x coord object
                result.billboardMap[x] = result.billboardMap[x] || {};

                // If billboard isn't already mapped, set it's index to the billboard array
                // length so that it is added to the end.
                result.billboardMap[x][y] = typeof result.billboardMap[x][y] === 'number' ?
                    result.billboardMap[x][y] : result.billboards.length;

                // If it isn't already created, create an object with billboard info
                result.billboards[result.billboardMap[x][y]] = result.billboards[result.billboardMap[x][y]] || {
                    photoCount : 0, // The total amount of photos taken of the billboard
                    coord : [x,y]   // The x,y position of the billboard
                };

                result.billboards[result.billboardMap[x][y]].photoCount += 1; // increment photo count

                result.path.push('x'); // Save photo location to path
            }

            return result;
        }, {
            billboards   : [], // A list of all the billboards
            billboardMap : {}, // A map to allow easy access to billboard data using x,y coords
            currentpos : [this.STARTPOS[0], this.STARTPOS[1]], // The current [x,y] position
            bounds : {         // The lower and upperbounds for x and y coordinates
                lower : [0,0], // computed here as it is faster than looping through
                upper : [0,0]  // all the billboards again later.
            },
            path : [],         // The path that the drone takes, an array of [x,y] coords.
            distance : path.replace(/x/g, '').length // The distance travelled in km
        });
    }
}