import PropTypes from 'prop-types';
import React from 'react';

export const PlayButton = props => {
    return (
        <li className="play-button-container">
            <a className="riverine-play" onClick={props.play}>
                <i className="fa fa-play"></i>
            </a>
        </li>
    );
};

PlayButton.propTypes = {
    play: PropTypes.func.isRequired
};

export default PlayButton;