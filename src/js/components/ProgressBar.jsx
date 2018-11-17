import PropTypes from 'prop-types';
import React from 'react';

export const ProgressBar = props => {
    return (
        <div className="riverine-progress" onMouseDown={props.mouseDown}>
            <div className="riverine-seek-bar">
                <div className="riverine-play-bar" onMouseDown={props.mouseDown}/>
            </div>
        </div>
    );
};

ProgressBar.propTypes = {
    mouseDown: PropTypes.func.isRequired
};

export default ProgressBar;