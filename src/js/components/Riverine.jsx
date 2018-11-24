import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { handleOffsetParent, handlePaddingResize, handleTime } from '../lib/utilities';

import { DEFAULT_HOVER_WIDTH, DEFAULT_STATE, REFS } from '../lib/constants';

import { AudioNode } from './AudioNode'; // consider renaming
import { Controls } from './Controls';
import { PauseButton } from './PauseButton';
import { PlayButton } from './PlayButton';
import { Timeline } from './Timeline';
import { TimeHandler } from './TimeHandler';

export class Riverine extends Component {
    constructor(props) {
        super(props);
        this.state = DEFAULT_STATE;

        this.addHover = this.addHover.bind(this);
        this.clickPercent = this.clickPercent.bind(this);
        this.createRef = this.createRef.bind(this);
        this.handlePlayhead = this.handlePlayhead.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.removeHover = this.removeHover.bind(this);
        this.returnDuration = this.returnDuration.bind(this);
        this.updateTime = this.updateTime.bind(this);
    }

    addHover(e) {
        const paddingLeft = e.pageX - handleOffsetParent(this.timeline);

        if (paddingLeft >= 0 && paddingLeft <= this.state.timelineWidth) {
            this.setState(() => ({ hoverWidth: paddingLeft + 'px' }));
        };

        if (paddingLeft < 0) {
            this.setState(() => ({ hoverWidth: DEFAULT_HOVER_WIDTH }));
        };

        if (paddingLeft > this.state.timelineWidth) {
            this.setState(() => ({
                hoverWidth: this.state.timelineWidth + 'px'
            }));
        };
    }

    clickPercent(e) {
        return (e.pageX - handleOffsetParent(this.timeline)) / this.state.timelineWidth;
    }

    componentDidMount() {
        this.setState(() => ({
            timelineWidth: this.timeline.offsetWidth - this.playHead.offsetWidth
        }));

        window.addEventListener('mouseup', this.mouseUp, false);
        window.addEventListener('resize', this.handleResize, false);
        this.audioNode.addEventListener('timeupdate', this.handlePlayhead, false);
    }

    createRef(name, node) {
        this[name] = node;
    }

    handlePlayhead() {
        let playPercent = this.state.timelineWidth * (this.audioNode.currentTime / this.audioNode.duration);

        this.setState(() => ({ playHeadPaddingLeft: playPercent + 'px' }));
    }

    handleResize() {
        let padding = this.playHead.style.paddingLeft;
        let p = handlePaddingResize(padding);

        this.state.timelineWidth = (this.timeline.offsetWidth - this.playHead.offsetWidth) + p;
        this.handlePlayhead();
    }

    mouseDown() {
        this.setState(() => ({
            scrubberClicked: true
        }));

        this.audioNode.removeEventListener('timeupdate', this.handlePlayhead, false);
    }

    mouseUp(e) {
        if (this.state.scrubberClicked === false) {
            return;
        };

        this.audioNode.currentTime = this.audioNode.duration * this.clickPercent(e);
        this.audioNode.addEventListener('timeupdate', this.handlePlayhead, false);

        this.setState(() => ({
            scrubberClicked: false
        }));
    }

    play() {
        this.audioNode.play();
        this.setState(() => ({ playing: true }));
    }

    pause() {
        this.audioNode.pause();
        this.setState(() => ({ playing: false }));
    }

    removeHover() {
        this.setState(() => ({
            hoverWidth: DEFAULT_HOVER_WIDTH
        }));
    }

    returnDuration() {
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
        };
    }

    render() {
        return (
            <div>
                <div className="riverine-player">
                    <div className="riverine-type-single">
                        <div className="riverine-gui riverine-interface riverine-player">
                            <AudioNode
                                audioIdPrefix={this.props.audioIdPrefix}
                                createRef={this.createRef}
                                handlePlayhead={this.handlePlayhead}
                                loop={this.props.loop}
                                preload={this.props.preload}
                                source={this.props.source}
                                returnDuration={this.returnDuration}
                                updateTime={this.updateTime}
                            />
                            <Controls>
                                {this.state.playing
                                    ? <PauseButton pause={this.pause} />
                                    : <PlayButton play={this.play} />}
                            </Controls>
                            <Timeline
                                createRef={this.createRef}
                                handleMouseDown={this.mouseDown}
                                handleMouseMove={this.addHover}
                                handleMouseOut={this.removeHover}
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
        )
    }
};

Riverine.defaultProps = {
    loop: false
};

Riverine.propTypes = {
    loop: PropTypes.bool,
    source: PropTypes.string.isRequired
};

export default Riverine;
