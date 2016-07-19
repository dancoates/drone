import React from 'react';



/**
 *
 * Component to render users chosen route to canvas
 * @extends {React.Component}
 *
 */
class DisplayRoute extends React.Component {

    /**
     *
     * Pass props to super and initiate members
     * @param {Object} props - React props passed to component
     */
    constructor(props) {
        super(props);

        /**
         *
         * Amount of padding to allow around edges of canvas.
         * This is used to ensure that billboard circles are not cut off.
         */
        this.canvasPadding = 20;

        this.toggleOptimizedRoute = this.toggleOptimizedRoute.bind(this);

        this.state = {
            showingOptimized : false
        };
    }

    toggleOptimizedRoute() {
        this.setState({
            showingOptimized : !this.state.showingOptimized
        });
    }


    /**
     *
     * React lifecycle method. If component recieves `route` props then
     * render canvas outside of react (see `renderRoute` method for details)
     */
    componentDidUpdate() {
        if(!this.props.route) return;

        this.renderRoute();

        // Scroll down to visualization (shouldn't really be handled here)
        window.location.hash = 'route-map';
    }

    /**
     *
     * Convert passed coordinates to normalized pixel positions on page.
     *
     * @param {Number} pos    -           The x or y position from left or top side.
     *
     * @param {Array}  bounds -           The x or y bounds in the form [lower, upper]
     *                                    used to calculate the distance from furthest
     *                                    left/up to furthest right/down point.
     *
     * @param {Number} canvasSideLength - The length of the relevant (width or height) dimension

     */
    normaliseCoordinates(pos, bounds, canvasSideLength) {
        return (this.canvasPadding / 2) +                    // Push down/left by padding amount
               (pos - bounds[0]) / (bounds[1] - bounds[0]) * // Fraction that point is across bounds
               (canvasSideLength - this.canvasPadding);      // Multiplied by usable canvas width
    }


    /**
     *
     * Render routes to canvas.
     */
    renderRoute() {

        // Save route to shorter var.
        const route = this.props.route;

        const xCoordRange = route.bounds.upper[0] - route.bounds.lower[0]; // The range of x values
        const yCoordRange = route.bounds.upper[1] - route.bounds.lower[1]; // The range of y values

        let canvasRatio = xCoordRange / yCoordRange;
        canvasRatio = canvasRatio < 10 ? canvasRatio : 10; // Limit ratio to 10:1

        // Use multiple canvas layers so that they can be rendered separately
        const layers = {
            startPoint : {
                canvas : this.refs.startPoint,
                ctx : this.refs.startPoint.getContext('2d')
            },
            path : {
                canvas : this.refs.path,
                ctx : this.refs.path.getContext('2d')
            },
            billboards : {
                canvas : this.refs.billboards,
                ctx : this.refs.billboards.getContext('2d')
            },
            pathOptimized : {
                canvas : this.refs.pathOptimized,
                ctx : this.refs.pathOptimized.getContext('2d')
            },
            billboardsOptimized : {
                canvas : this.refs.billboardsOptimized,
                ctx : this.refs.billboardsOptimized.getContext('2d')
            }
        };

        // Calculate width/height based on canvas ratio
        const canvasWidth = 960;
        const canvasHeight = 960 / canvasRatio;

        // Set heights and widths of layers and contexts
        // Also clears canvases
        layers.path.canvas.width = canvasWidth;
        layers.path.canvas.height = canvasHeight;
        layers.billboards.canvas.width = canvasWidth;
        layers.billboards.canvas.height = canvasHeight;
        layers.pathOptimized.canvas.width = canvasWidth;
        layers.pathOptimized.canvas.height = canvasHeight;
        layers.billboardsOptimized.canvas.width = canvasWidth;
        layers.billboardsOptimized.canvas.height = canvasHeight;
        layers.startPoint.canvas.width = canvasWidth;
        layers.startPoint.canvas.height = canvasHeight;


        // Save x and y bounds separately for utility
        const xbounds = [route.bounds.lower[0], route.bounds.upper[0]];
        const ybounds = [route.bounds.lower[1], route.bounds.upper[1]];

        if(!this.state.showingOptimized) {
            this.renderPath(layers.path.ctx, route.path, 0.2, xbounds, ybounds, canvasHeight, canvasWidth);
            this.renderBillboards(layers.billboards.ctx, route.billboards, xbounds, ybounds, canvasHeight, canvasWidth);
        } else {
            if(route.optimizedPath) {
                this.renderPath(layers.pathOptimized.ctx, route.optimizedPath, 0.6, xbounds, ybounds, canvasHeight, canvasWidth);
                this.renderBillboards(layers.billboardsOptimized.ctx, route.optimizedPath.map(
                    point => ({coord : point, photoCount : 1})
                ), xbounds, ybounds, canvasHeight, canvasWidth);
            }
        }




        // render the starting point
        const startX = this.normaliseCoordinates(0, xbounds, canvasWidth);
        const startY = this.normaliseCoordinates(0, ybounds, canvasHeight);

        layers.startPoint.ctx.beginPath();
        layers.startPoint.ctx.arc(startX, startY, 4, 0, Math.PI * 2, false);
        layers.startPoint.ctx.fillStyle = 'rgb(0, 167, 255)';
        layers.startPoint.ctx.fill();
        layers.startPoint.ctx.closePath();

    }

    /**
     *
     * Render a path to a context
     * @param {Object} ctx - The context to render to
     * @param {Array} path - The array to render
     * @param {Number|String} opacity - The opacity to render the string at
     * @param {Array} xbounds - The min/max x values to use to normalize x position
     * @param {Array} ybounds - The min/max y values to use to normalize y position
     * @param {Number} canvasHeight - height of the canvas
     * @param {Number} canvasWidth - width of the canvas
     */
    renderPath(ctx, path, opacity, xbounds, ybounds, canvasHeight, canvasWidth) {
        for (var i = 1; i < path.length; i++) {
            const point = path[i];
            const lastPoint = path[i - 1];

            const x = this.normaliseCoordinates(point[0], xbounds, canvasWidth);
            const y = this.normaliseCoordinates(point[1], ybounds, canvasHeight);

            const lastx = this.normaliseCoordinates(lastPoint[0], xbounds, canvasWidth);
            const lasty = this.normaliseCoordinates(lastPoint[1], ybounds, canvasHeight);

            ctx.beginPath();
            ctx.moveTo(lastx, lasty);
            ctx.lineTo(x,y);
            ctx.strokeStyle = 'rgba(255, 255, 255, '+opacity+')';
            ctx.stroke();
            ctx.closePath();
        }
        
    }

    /**
     *
     * Render a path to a context
     * @param {Object} ctx - The context to render to
     * @param {Array} billboards - The billboards to render
     * @param {Array} xbounds - The min/max x values to use to normalize x position
     * @param {Array} ybounds - The min/max y values to use to normalize y position
     * @param {Number} canvasHeight - height of the canvas
     * @param {Number} canvasWidth - width of the canvas
     */
    renderBillboards(ctx, billboards, xbounds, ybounds, canvasHeight, canvasWidth) {
        for (var i = 0; i < billboards.length; i++) {

            const billboard = billboards[i];
            const x = this.normaliseCoordinates(billboard.coord[0], xbounds, canvasWidth);
            const y = this.normaliseCoordinates(billboard.coord[1], ybounds, canvasHeight);

            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2, false);
            ctx.fillStyle = 'hsla(' + (100 - (billboard.photoCount / 10) * 200) +', 100%, 60%, 1)';
            ctx.fill();
            ctx.closePath();
        }
    }




    /**
     *
     * Render component
     */ 
    render() {


        return (
            <div className='displayRoute' id='route-map'>
                {this.props.route ? (
                    <div className='displayRoute_layers'>
                        <canvas ref='path'></canvas>
                        <canvas ref='billboards'></canvas>
                        <canvas ref='pathOptimized'></canvas>
                        <canvas ref='billboardsOptimized'></canvas>
                        <canvas ref='startPoint'></canvas>
                        <div className='displayRoute_meta'>
                            <div className='displayRoute_meta_value'>
                                <div className='displayRoute_meta_value_name'>
                                    Distance Travelled
                                </div>
                                <div ref='meta_distance' className='displayRoute_meta_value_num'>
                                    {this.state.showingOptimized && this.props.route.optimizedDistance ? this.props.route.optimizedDistance : this.props.route.distance}
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
                                    {this.props.route.billboards.length}
                                </div>
                            </div>

                            <div className='displayRoute_meta_value'>
                                {
                                    this.props.route.billboards.length > 1000 ? (
                                        <div className='displayRoute_meta_value_name'>
                                            Unable to optimize
                                            <small>too many billboards</small>
                                        </div>
                                    ) :!this.props.route.optimizedPath ? (
                                        <div className='displayRoute_meta_value_name'>
                                            Calculating Optimized route ...
                                            <small>(this can take a while)</small>
                                        </div>
                                    ) : (
                                        <button className='displayRoute_button' onClick={this.toggleOptimizedRoute}>
                                            {this.state.showingOptimized ? 'Hide' : 'Show'} Optimized Route
                                        </button>
                                    )
                                }
                                
                                
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

/**
 * Define proptypes for DisplayRoute component
 */
DisplayRoute.propTypes = {
    route : React.PropTypes.object
};


export default DisplayRoute;
