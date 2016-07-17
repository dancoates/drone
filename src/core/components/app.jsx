import React from 'react';
import {connect} from 'react-redux';

import GetInput from 'core/components/ui/get-input';
import DisplayRoute from 'core/components/ui/display-route';

import * as actions from 'core/actions';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
    } 
    
    handleInput(data) {
        this.props.dispatch(actions.input(data));
    }

    render() {
        console.log(this.props);
        return (
            <div className='container'>
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

App.propTypes = {
    dispatch : React.PropTypes.func.isRequired,
    routing : React.PropTypes.object
};

export default connect(state => state)(App);