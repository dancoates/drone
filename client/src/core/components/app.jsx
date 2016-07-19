import React from 'react';
import {connect} from 'react-redux';

import GetInput from 'core/components/ui/get-input';
import DisplayRoute from 'core/components/ui/display-route';

import * as actions from 'core/actions';

/**
 *
 * Main App component - wraps all other components and handles
 * dispatching user interaction actions
 * @extends {React.Component}
 *
 */
class App extends React.Component {

    /**
     *
     * Pass props to super and bind event handlers to instance
     * @param {Object} props - React props passed to component
     */
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleOptimize = this.handleOptimize.bind(this);
    } 
    
    /**
     *
     * Dispatch event to handle input change
     * @param {string} data - A drone path string to be parsed
     */
    handleInput(data) {
        this.props.dispatch(actions.input(data));
    }

    /**
     *
     * Dispatch event for user choosing to optimize route.
     */    
    handleOptimize() {
        this.props.dispatch(actions.optimizeRoute());
    }


    /**
     *
     * Render component to page
     */  
    render() {
        return (
            <div className='container'>
                <h1 className='with-subtitle'>Drone Flight Path Optimizer</h1>

                <p>An aerial drone is used to take photographs of billboards. Instructions are sent to the drone in a simple language that tells the drone which direction to move and when to take a photo. Moves are always exactly 1 km to the north (^), south (v), east (&gt;) or west (&lt;) or take a photograph (x).</p>

                <p>A simple set of instructions might be <code>x^xv</code> which takes photos of 2 billboards and ends up back at the starting location</p>

                <p>The below tools takes this input and plots the drone's path on a grid to display areas of inefficiency.</p>
                <p>Each dot on the grid is a billboard. The color of the billboard indicates how many photos have been taken of it. Green billboards have had few photos taken of them and red billboards have had many photos taken on them.</p>
                <p>The blue dot where the drone initially takes off from</p>
                <p>The path that the drone takes between the billboards is indicated by the white lines, pale white lines are paths that have only been traversed once whereas bright white lines are where the drone has doubled back on itself many times.</p>

                <p>This visualization should help identify areas where the drone is maneuvering sub-optimally</p>

                <p>The tool will also attempt to generate a more optimum route using an approximate traveling salesman solver.</p>

                
                

                <GetInput
                    onInput={this.handleInput}
                />
                <DisplayRoute
                    route={this.props.routing ? this.props.routing.route : null}
                />

            </div>
        );
    }
}

/**
 * Define proptypes for App component
 */
App.propTypes = {
    dispatch : React.PropTypes.func.isRequired,
    routing : React.PropTypes.object
};

export {App as App};
export default connect(state => state)(App);