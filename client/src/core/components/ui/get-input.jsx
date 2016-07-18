import React from 'react';

import defaultInput from 'core/data/default-input';

export default class GetInput extends React.Component {
    constructor(props) {
        super(props);
        this.loadDefault = this.loadDefault.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleModalTextChange = this.handleModalTextChange.bind(this);
        this.submitModalText = this.submitModalText.bind(this);
        this.state = {
            modal : false,
            text : '',
            error : false
        };
    }

    loadDefault() {
        this.props.onInput(defaultInput);
    }

    showModal() {
        this.setState({
            modal : true,
            error : false
        });
    }

    hideModal() {
        this.setState({
            modal : false,
            error : false
        });
    }

    handleModalTextChange(e) {
        this.setState(Object.assign({}, this.state, {
            text : e.target.value,
            error : false
        }));
    }

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

    render() {
        return (
            <div className='getInput'>
                <h2 className='getInput_heading'>drone instructions</h2>
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

GetInput.propTypes = {
    onInput : React.PropTypes.func.isRequired
};

