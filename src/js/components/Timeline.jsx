import PropTypes from 'prop-types';
import React from 'react';

import { REFS } from '../lib/constants';

export const Timeline = props => {
    return (
        <div className="riverine-progress"
            onMouseDown={props.handleMouseDown}
            onMouseMove={props.handleMouseMove}
            onMouseOut={props.handleMouseOut}
            ref={node => props.createRef(REFS.TIMELINE, node)}
        >
            <div className="riverine-seek-bar" style={{ width: props.hoverWidth }}>
                <div
                    className="riverine-play-bar"
                    onMouseDown={props.handleMouseDown}
                    ref={node => props.createRef(REFS.PLAYHEAD, node)}
                    style={{
                        paddingLeft: props.playHeadPaddingLeft
                    }}
                />
            </div>
        </div>
    );
};

Timeline.propTypes = {
    createRef: PropTypes.func.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    handleMouseMove: PropTypes.func.isRequired,
    handleMouseOut: PropTypes.func.isRequired,
    hoverWidth: PropTypes.string.isRequired,
    playHeadPaddingLeft: PropTypes.string.isRequired
};

export default Timeline;