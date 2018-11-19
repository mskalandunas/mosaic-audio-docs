import PropTypes from 'prop-types';
import React from 'react';

import { REFS } from '../lib/constants';

export const Timeline = props => {
    return (
        <div className="riverine-progress"
            onMouseDown={props.handleMouseDown}
            onMouseMove={props.handleMouseMove}
            onMouseOut={props.handleMouseOut}
            ref={node => props.createRef(REFS.PLAYHEAD, node)}
        >
            <div className="riverine-seek-bar" style={{ width: props.hoverWidth }}>
                <div
                    className="riverine-play-bar"
                    onMouseDown={props.mouseDown}
                    ref={node => props.createRef(REFS.TIMELINE, node)}
                    style={{
                        marginLeft: props.playHeadMarginLeft,
                        width: props.playHeadWidth
                    }}
                />
            </div>
        </div>
    );
};

Timeline.propTypes = {
    // mouseDown: PropTypes.func.isRequired
};

export default Timeline;