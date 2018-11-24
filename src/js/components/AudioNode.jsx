import PropTypes from 'prop-types';
import React from 'react';

import { REFS } from '../lib/constants';
import { newId } from '../lib/utilities';

export const AudioNode = props => {
    return (
        <audio
            id={newId(props.audioIdPrefix)}
            loop={props.loop}
            onDurationChange={props.returnDuration}
            onTimeUpdate={() => {
                props.updateTime();
                props.handlePlayhead();
            }}
            preload={props.preload}
            ref={node => props.createRef(REFS.AUDIO, node)}
        >
            <source src={props.source} />
        </audio>
    );
};

AudioNode.defaultProps = {
    audioIdPrefix: 'mosaic-audio-',
    loop: false,
    preload: true
};

AudioNode.propTypes = {
    audioIdPrefix: PropTypes.string,
    loop: PropTypes.bool,
    preload: PropTypes.bool,
    returnDuration: PropTypes.func.isRequired,
    source: PropTypes.string.isRequired,
    updateTime: PropTypes.func.isRequired
};

export default AudioNode;