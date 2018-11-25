import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { AudioNode } from './AudioNode';
import { Controls } from './Controls';
import { PauseButton } from './PauseButton';
import { PlayButton } from './PlayButton';
import { TimeHandler } from './TimeHandler';
import { Timeline } from './Timeline';

import { DEFAULT_HOVER_WIDTH, DEFAULT_STATE } from '../lib/constants';
import { handleOffsetParent, handlePaddingResize, handleTime } from '../lib/utilities';

export class Riverine extends Component {
    constructor(props) {
        super(props);
        this.state = DEFAULT_STATE;

        this.createRef = this.createRef.bind(this);
        this.getPercentageOfProgressAtClick = this.getPercentageOfProgressAtClick.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.movePlayHead = this.movePlayHead.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.setDefaultHoverWidth = this.setDefaultHoverWidth.bind(this);
        this.setHoverWidth = this.setHoverWidth.bind(this);
        this.startDraggingPlayHead = this.startDraggingPlayHead.bind(this);
        this.stopDraggingPlayHead = this.stopDraggingPlayHead.bind(this);
        this.updateDuration = this.updateDuration.bind(this);
        this.updateTime = this.updateTime.bind(this);
    }

    componentDidMount() {
        this.setState(() => ({
            timelineWidth: this.timeline.offsetWidth - this.playHead.offsetWidth
        }));

        window.addEventListener('mouseup', this.stopDraggingPlayHead, false);
        window.addEventListener('resize', this.handleWindowResize, false);
        this.audioNode.addEventListener('timeupdate', this.movePlayHead, false);
    }

    createRef(name, node) {
        this[name] = node;
    }

    getPercentageOfProgressAtClick(e) {
        return (e.pageX - handleOffsetParent(this.timeline)) / this.state.timelineWidth;
    }

    handleWindowResize() {
        let padding = this.playHead.style.paddingLeft;
        let p = handlePaddingResize(padding);

        this.setState(() => ({
            timelineWidth: this.timeline.offsetWidth - this.playHead.offsetWidth + p
        }));

        this.movePlayHead();
    }

    movePlayHead() {
        let percentagePlayed =
            this.state.timelineWidth
            * (this.audioNode.currentTime / this.audioNode.duration);

        this.setState(() => ({ playHeadPaddingLeft: percentagePlayed + 'px' }));
    }

    play() {
        this.audioNode.play();
        this.setState(() => ({ playing: true }));
    }

    pause() {
        this.audioNode.pause();
        this.setState(() => ({ playing: false }));
    }

    setDefaultHoverWidth() {
        this.setState(() => ({
            hoverWidth: DEFAULT_HOVER_WIDTH
        }));
    }

    setHoverWidth(e) {
        const paddingLeft = e.pageX - handleOffsetParent(this.timeline);

        if (paddingLeft >= 0 && paddingLeft <= this.state.timelineWidth) {
            this.setState(() => ({ hoverWidth: paddingLeft + 'px' }));
        }

        if (paddingLeft < 0) {
            this.setState(() => ({ hoverWidth: DEFAULT_HOVER_WIDTH }));
        }

        if (paddingLeft > this.state.timelineWidth) {
            this.setState(() => ({
                hoverWidth: this.state.timelineWidth + 'px'
            }));
        }
    }

    startDraggingPlayHead() {
        this.setState(() => ({
            scrubberClicked: true
        }));

        this.audioNode.removeEventListener('timeupdate', this.movePlayHead, false);
    }

    stopDraggingPlayHead(e) {
        if (this.state.scrubberClicked === false) {
            return;
        }

        this.audioNode.currentTime =
            this.audioNode.duration
            * this.getPercentageOfProgressAtClick(e);
        this.audioNode.addEventListener('timeupdate', this.movePlayHead, false);

        this.setState(() => ({
            scrubberClicked: false
        }));
    }

    updateDuration() {
        this.setState(() => ({
            sourceDuration: this.audioNode.duration,
            formattedDuration: handleTime(this.audioNode.duration)
        }));

        this.updateTime();
    }

    updateTime() {
        this.setState(() => ({
            formattedCurrentTime: handleTime(this.audioNode.currentTime),
            formattedDuration: handleTime(this.audioNode.duration)
        }));

        if (this.audioNode.currentTime === this.state.sourceDuration) {
            this.setState(() => ({ playing: false }));
        }
    }

    render() {
        return (
            <div>
                <div className="riverine-player">
                    <div className="riverine-type-single">
                        <div className="riverine-gui riverine-interface riverine-player">
                            <AudioNode
                                audioNodeId={this.props.audioNodeId}
                                createRef={this.createRef}
                                movePlayHead={this.movePlayHead}
                                loop={this.props.loop}
                                preload={this.props.preload}
                                source={this.props.source}
                                updateDuration={this.updateDuration}
                                updateTime={this.updateTime}
                            />
                            <Controls>
                                {this.state.playing
                                    ? <PauseButton pause={this.pause} />
                                    : <PlayButton play={this.play} />}
                            </Controls>
                            <Timeline
                                createRef={this.createRef}
                                handleMouseDown={this.startDraggingPlayHead}
                                handleMouseMove={this.setHoverWidth}
                                handleMouseOut={this.setDefaultHoverWidth}
                                hoverWidth={this.state.hoverWidth}
                                playHeadPaddingLeft={this.state.playHeadPaddingLeft}
                            />
                            <TimeHandler
                                currentTime={this.state.formattedCurrentTime}
                                duration={this.state.formattedDuration}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Riverine.defaultProps = {
    audioNodeId: null,
    loop: false,
    preload: 'auto'
};

Riverine.propTypes = {
    audioNodeId: PropTypes.string,
    loop: PropTypes.bool,
    preload: PropTypes.string,
    source: PropTypes.string.isRequired
};

export default Riverine;
