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
    constructor() {
        super();
        this.state = DEFAULT_STATE;

        this.addHover = this.addHover.bind(this);
        this.clickPercent = this.clickPercent.bind(this);
        this.createRef = this.createRef.bind(this);
        this.returnDuration = this.returnDuration.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.handlePlayhead = this.handlePlayhead.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.moveplayhead = this.moveplayhead.bind(this);
        this.removeHover = this.removeHover.bind(this);
    }

    componentDidMount() {
        this.setState({
            playHeadWidth: this.playHead.style.width,
            timelineWidth: this.timeline.offsetWidth - this.playHead.offsetWidth
        });

        window.addEventListener('mouseup', this.mouseUp, false);
        window.addEventListener('resize', this.handleResize, false);
        this.audioNode.addEventListener('timeupdate', this.handlePlayhead, false);
    }

    addHover(e) {
        let newMargLeft = e.pageX - handleOffsetParent(this.timeline);

        if (newMargLeft >= 0 && newMargLeft <= this.state.timelineWidth) {
            this.setState(state => ({ ...state, hoverWidth: newMargLeft + 'px' }));
        };

        if (newMargLeft < 0) {
            this.setState(state => ({ ...state, hoverWidth: DEFAULT_HOVER_WIDTH }));
        };

        if (newMargLeft > this.state.timelineWidth) {
            this.setState(state => ({
                ...state,
                hoverWidth: this.state.timelineWidth + 'px'
            }));
        };
    }

    clickPercent(e) {
        return (e.pageX - handleOffsetParent(this.timeline)) / this.state.timelineWidth;
    }

    returnDuration() {
        this.setState(state => ({
            ...state,
            sourceDuration: this.audioNode.duration,
            formattedDuration: handleTime(this.audioNode.duration)
        }));
        this.updateTime();
    }

    pause() {
        this.audioNode.pause();
        this.setState({ playing: false });
    }

    play() {
        this.audioNode.play();
        this.setState({ playing: true });
    }

    updateTime() {
        this.setState(state => ({
            ...state,
            formattedCurrentTime: handleTime(this.audioNode.currentTime),
            formattedDuration: handleTime(this.audioNode.duration)
        }));

        if (this.audioNode.currentTime === this.state.sourceDuration) {
            this.setState({ playing: false });
        };
    }

    handlePlayhead() {
        let playPercent = this.state.timelineWidth * (this.audioNode.currentTime / this.audioNode.duration);

        this.setState({ playHeadMarginLeft: playPercent + 'px' });
    }

    handleResize() {
        let padding = this.playHead.style.paddingLeft;
        let p = handlePaddingResize(padding);

        this.state.timelineWidth = (this.timeline.offsetWidth - this.playHead.offsetWidth) + p;
        this.handlePlayhead();
    }

    mouseDown() {
        this.setState(state => ({
            ...state,
            scrubberClicked: true
        }));

        window.addEventListener('mousemove', this.moveplayhead, true);
        this.audioNode.removeEventListener('timeupdate', this.handlePlayhead, false);
    }

    mouseUp(e) {
        if (this.state.scrubberClicked === false) {
            return;
        };

        this.moveplayhead(e);
        window.removeEventListener('mousemove', this.moveplayhead, true);
        this.audioNode.currentTime = this.audioNode.duration * this.clickPercent(e);
        this.audioNode.addEventListener('timeupdate', this.handlePlayhead, false);

        this.setState(state => ({
            ...state,
            scrubberClicked: false
        }));
    }

    moveplayhead(e) {
        let positionOffset = handleOffsetParent(this.timeline);
        let newMargLeft = e.pageX - positionOffset;
        let n = this.playHead.style.width;

        if (newMargLeft >= 0 && newMargLeft <= this.state.timelineWidth) {
            this.setState({
                playHeadWidth: newMargLeft + 'px'
            });
        };

        if (newMargLeft < 0) {
            this.setState({
                playHeadWidth: DEFAULT_HOVER_WIDTH
            });
        };

        if (newMargLeft > this.state.timelineWidth) {
            this.setState({
                playHeadWidth: this.state.timelineWidth + 'px'
            });
        };
    }

    removeHover() {
        this.setState(state => ({
            ...state,
            hoverWidth: DEFAULT_HOVER_WIDTH
        }));
    }

    createRef(name, node) {
        this[name] = node;
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
                                handleTimeUpdate={this.handlePlayhead}
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
                                playHeadMarginLeft={this.state.playHeadMarginLeft}
                                playHeadWidth={this.state.playHeadWidth}
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

Riverine.propTypes = {
    source: PropTypes.string.isRequired
};

export default Riverine;
