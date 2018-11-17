import PropTypes from 'prop-types';
import React from 'react';

export const PauseButton = props => {
    return (
        <li className="pause-button-container">
            <a className="riverine-pause" onClick={props.pause}>
                <i className="fa fa-pause"></i>
            </a>
        </li>
    );
};

PauseButton.propTypes = {
    pause: PropTypes.func.isRequired
};

export default PauseButton;