import PropTypes from 'prop-types';
import React from 'react';

import { REFS } from '../lib/constants';

export const AudioNode = props => {
    return (
        <audio
            id={props.audioNodeId}
            loop={props.loop}
            onDurationChange={props.updateDuration}
            onTimeUpdate={() => {
                props.updateTime();
                props.movePlayHead();
            }}
            preload={props.preload}
            ref={node => props.createRef(REFS.AUDIO, node)}
        >
            <source src={props.source} />
        </audio>
    );
};

AudioNode.defaultProps = {
    audioNodeId: null,
    loop: false,
    preload: 'auto'
};

AudioNode.propTypes = {
    audioNodeId: PropTypes.string,
    createRef: PropTypes.func.isRequired,
    loop: PropTypes.bool,
    movePlayHead: PropTypes.func.isRequired,
    preload: PropTypes.string,
    updateDuration: PropTypes.func.isRequired,
    source: PropTypes.string.isRequired,
    updateTime: PropTypes.func.isRequired
};

export default AudioNode;