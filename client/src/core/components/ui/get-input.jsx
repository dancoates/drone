import React from 'react';

import defaultInput from 'core/data/default-input';


/**
 *
 * Component to prompt user to enter drone path
 * @extends {React.Component}
 *
 */
class GetInput extends React.Component {

    /**
     *
     * Pass props to super and initiate members/bind methods to instance
     * @param {Object} props - React props passed to component
     */
    constructor(props) {
        super(props);


        this.loadDefault = this.loadDefault.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleModalTextChange = this.handleModalTextChange.bind(this);
        this.submitModalText = this.submitModalText.bind(this);

        /**
         *
         * Initialise ui state
         * @type {Object}
         * @property {Boolean} modal - Whether the modal is currently shown 
         * @property {String} text - The drone path input text 
         * @property {String|Boolean} error - Current error message. `false` if no error 
         *
         */
        this.state = {
            modal : false,
            text : '',
            error : false
        };
    }

    /**
     *
     * Call onInput handler and pass default input
     */
    loadDefault() {
        this.props.onInput(defaultInput);
    }

    /**
     *
     * Show the modal for user to enter custom text
     */
    showModal() {
        this.setState({
            modal : true,
            error : false
        });
    }

    /**
     *
     * Hide the modal for user to enter custom text
     * @TODO combine with showModal
     */
    hideModal() {
        this.setState({
            modal : false,
            error : false
        });
    }

    /**
     *
     * Update state as text changes in modal
     */
    handleModalTextChange(e) {
        this.setState(Object.assign({}, this.state, {
            text : e.target.value,
            error : false
        }));
    }

    /**
     *
     * Validate and submit modal text
     */
    submitModalText() {
        let text = this.state.text;
        let valid = text && !/[^\^><vx]/.test(text);

        if(valid) {
            this.props.onInput(text);
            this.setState(Object.assign({}, this.state, {
                modal : false
            }));
        } else {
            this.setState(Object.assign({}, this.state, {
                error : true
            }));
        }
    }

    /**
     *
     * Render component
     */ 
    render() {
        return (
            <div className='getInput'>
                <div className='getInput_options'>
                    <div className='getInput_options_option'>
                        <button className="getInput_button" onClick={this.loadDefault}>
                            Use default input.txt data
                        </button>
                    </div>
                    <div className='getInput_options_option'>
                        <button className="getInput_button" onClick={this.showModal}>
                            Paste or enter custom input
                        </button>
                    </div>
                </div>

                {this.state.modal ? (
                    <div className="getInput_modal">
                        <textarea
                            onChange={this.handleModalTextChange}
                            value={this.state.text}
                            className="getInput_modal_text"
                        ></textarea>
                        {
                            this.state.error ? (
                                <span className='getInput_modal_error'>Invalid Input</span>
                            ) : null
                        }
                        <button className="getInput_button" onClick={this.submitModalText}>
                            Do It
                        </button>
                        <div className="getInput_modal_close" onClick={this.hideModal}>
                            Close
                        </div>
                    </div>
                ) : null}

            </div>
        );
    }
}


/**
 * Define proptypes for GetInput component
 */
GetInput.propTypes = {
    onInput : React.PropTypes.func.isRequired
};


export default GetInput;