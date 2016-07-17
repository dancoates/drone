import React from 'react';

export default class DisplayRoute extends React.Component {
    constructor(props) {
        super(props);
        this.canvasPadding = 20;
        this.iteration = 0; // Used to stop rendering outside of react if react updates
    }

    componentWillUpdate() {
        this.iteration += 1;
    }

    componentDidUpdate() {
        if(!this.props.route) return;

        this.renderRoute();
    }

    normaliseCoordinates(pos, bounds, canvasSideLength) {
        return (this.canvasPadding / 2) +                    // Push down/left by padding amount
               (pos - bounds[0]) / (bounds[1] - bounds[0]) * // Fraction that point is across bounds
               (canvasSideLength - this.canvasPadding);      // Multiplied by usable canvas width
    }

    renderRoute() {

        const iteration = this.iteration;

        const route = this.props.route;

        const xCoordRange = route.bounds.upper[0] - route.bounds.lower[0]; // The range of x values
        const yCoordRange = route.bounds.upper[1] - route.bounds.lower[1]; // The range of y values
        let canvasRatio = xCoordRange / yCoordRange;
        canvasRatio = canvasRatio < 10 ? canvasRatio : 10; // Limit ratio to 10:1

        // Use multiple canvas layers so that they can be rendered separately
        const layers = {
            path : {
                canvas : this.refs.path,
                ctx : this.refs.path.getContext('2d')
            },
            billboards : {
                canvas : this.refs.billboards,
                ctx : this.refs.billboards.getContext('2d')
            }
        };

        // Calculate width/height based on canvas ratio
        const canvasWidth = 960;
        const canvasHeight = 960 / canvasRatio;

        // Set heights and widths of layers and contexts
        layers.path.canvas.width = canvasWidth;
        layers.path.canvas.height = canvasHeight;
        layers.billboards.canvas.width = canvasWidth;
        layers.billboards.canvas.height = canvasHeight;

        // Save x and y bounds separately for utility
        const xbounds = [route.bounds.lower[0], route.bounds.upper[0]];
        const ybounds = [route.bounds.lower[1], route.bounds.upper[1]];

        const rendersPerFrame  = 10; // Rendering once per frame is too slow, this speeds things up

        // Variables to be updated while looping through path
        let i = 0;                  // The current index
        let lastPos = [0,0];        // The x,y coords of last iteration
        let incrementalCount = {};  // An incremental count of photos taken of each billboard
        let rendersThisFrame = 0;   // Variable to be incremented for each render in a frame
        let distance = 0;           // Count the distance travelled over time
        let lastBillboardCount = 0; // Stop billboard count from jumping around

        const render = function() {
            // Cancel rendering if react has changed
            if(this.iteration !== iteration) return;

            const point = route.path[i] === 'x' ? lastPos : route.path[i];

            const x = this.normaliseCoordinates(point[0], xbounds, canvasWidth);
            const y = this.normaliseCoordinates(point[1], ybounds, canvasHeight);
            const lastx = this.normaliseCoordinates(lastPos[0], xbounds, canvasWidth);
            const lasty = this.normaliseCoordinates(lastPos[1], ybounds, canvasHeight);

            // Update incremental count object
            incrementalCount[point[0]] = incrementalCount[point[0]] || {};
            incrementalCount[point[0]][point[1]] = incrementalCount[point[0]][point[1]] || 0;
            incrementalCount[point[0]][point[1]] += 1;

            // If photo was taken then a billboard needs to be drawn
            if(route.path[i] === 'x') {
                layers.billboards.ctx.beginPath();
                layers.billboards.ctx.arc(x, y, 2, 0, Math.PI * 2, false);

                // Set fill style to hsla color range between green and red. Red spots indicate many
                // photos taken
                layers.billboards.ctx.fillStyle = 'hsla(' + (100 - (incrementalCount[point[0]][point[1]] / 10) * 80) +', 100%, 60%, 1)';
                layers.billboards.ctx.fill();
                layers.billboards.ctx.closePath();

                // Update billboard count
                let newBillboardCount = route.billboardMap[point[0]][point[1]] + 1;
                if(newBillboardCount > lastBillboardCount) {
                    this.refs.meta_billboards.textContent = newBillboardCount;
                    lastBillboardCount = newBillboardCount;
                }

            // Otherwise, draw a path
            } else {
                layers.path.ctx.beginPath();
                layers.path.ctx.moveTo(lastx, lasty);
                layers.path.ctx.lineTo(x,y);
                layers.path.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                layers.path.ctx.stroke();
                layers.path.ctx.closePath();
                distance += 1;

                // Draw text
                const xDirection = point[0] < 0 ? 'West'  : 'East';
                const yDirection = point[1] < 0 ? 'North' : 'South';

                this.refs.meta_distance.textContent = distance;
                this.refs.meta_position.textContent = Math.abs(point[0]) + 'km ' + xDirection + ' ' + 
                                                      Math.abs(point[1]) + 'km ' + yDirection + ' ';
            }

            

            lastPos = point;
            i += 1;


            

            if(i < route.path.length) {
                if(rendersThisFrame < rendersPerFrame) {
                    rendersThisFrame ++;
                    render();
                } else {
                    rendersThisFrame = 0;
                    requestAnimationFrame(render);
                }
            }
        }.bind(this);

        render();

    }

    render() {
        return (
            <div className='displayRoute'>
                {this.props.route ? (
                    <div className='displayRoute_layers'>
                        <canvas ref='path'></canvas>
                        <canvas ref='billboards'></canvas>
                        <div className='displayRoute_meta'>
                            <div className='displayRoute_meta_value'>
                                <div className='displayRoute_meta_value_name'>
                                    Distance
                                </div>
                                <div ref='meta_distance' className='displayRoute_meta_value_num'>
                                    
                                </div>
                                <div className='displayRoute_meta_value_units'>
                                    KM
                                </div>
                            </div>

                            <div className='displayRoute_meta_value'>
                                <div className='displayRoute_meta_value_name'>
                                    Billboards Photographed
                                    <small>(at least once)</small>
                                </div>
                                <div ref='meta_billboards' className='displayRoute_meta_value_num displayRoute_meta_value_num-large'>
                                    
                                </div>
                            </div>

                            <div className='displayRoute_meta_value'>
                                <div className='displayRoute_meta_value_name'>
                                    Position from start
                                </div>
                                <div ref='meta_position' className='displayRoute_meta_value_num'>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

DisplayRoute.propTypes = {
    route : React.PropTypes.object
};

