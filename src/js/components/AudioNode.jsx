import PropTypes from 'prop-types';
import React from 'react';

import { newId } from '../lib/utilities';

export const AudioNode = props => {
    return (
        <audio
            id={newId(props.audioIdPrefix)}
            loop={props.loop}
            onDurationChange={props.returnDuration}
            onTimeUpdate={props.updateTime}
            preload={props.preload}
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