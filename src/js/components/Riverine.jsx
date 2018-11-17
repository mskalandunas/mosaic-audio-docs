import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { handleOffsetParent, handleTime } from '../lib/utilities';

import { AudioNode } from './AudioNode'; // consider renaming
import { Controls } from './Controls';
import { PauseButton } from './PauseButton';
import { PlayButton } from './PlayButton';
import { ProgressBar } from './ProgressBar';
import { TimeHandler } from './TimeHandler';

export class Riverine extends Component {
    constructor() {
        super();

        this.state = {
            duration: '', // should this be an int?
            playing: false
        };

        this.scrubberClicked = false;
        this.audioNode = '';
        this.playButton = '';
        this.playHead = '';
        this.timeline = '';
        this.timelineWidth = '';
        this.sourceDuration = '';

        this.addHover = this.addHover.bind(this);
        this.clickPercent = this.clickPercent.bind(this);
        this.returnDuration = this.returnDuration.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.handleHover = this.handleHover.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.handlePlayhead = this.handlePlayhead.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.moveplayhead = this.moveplayhead.bind(this);
        this.removeHover = this.removeHover.bind(this);
    }

    componentDidMount() {
        const that         = ReactDOM.findDOMNode(this).children[0].children[0].children[0];
        this.audioNode     = that.children[0];
        this.duration      = that.children[3];
        this.hover         = that.children[2].children[0];
        this.playButton    = that.children[1].children[0].children[0];
        this.playHead      = that.children[2].children[0].children[0];
        this.timeline      = that.children[2];
        this.timelineWidth = this.timeline.offsetWidth - this.playHead.offsetWidth;

        window.addEventListener('mouseup', this.mouseUp, false);
        window.addEventListener('resize', this.handleResize, false);
        this.audioNode.addEventListener('timeupdate', this.handlePlayhead, false);
        this.timeline.addEventListener('mouseover', this.handleHover, false);
    }

    addHover(e) {
        let positionOffset = handleOffsetParent(this.timeline);
        let newMargLeft = e.pageX - positionOffset;

        if (newMargLeft >= 0 && newMargLeft <= this.timelineWidth) {
            this.hover.style.width = newMargLeft + 'px';
        };

        if (newMargLeft < 0) {
            this.hover.style.width = '0px';
        };

        if (newMargLeft > this.timelineWidth) {
            this.hover.style.width = this.timelineWidth + 'px';
        };
    }

    clickPercent(e) {
        let positionOffset = handleOffsetParent(this.timeline);
        return (e.pageX - positionOffset) / this.timelineWidth;
    }

    returnDuration() {
        this.sourceDuration = this.audioNode.duration;
        this.duration.innerHTML = handleTime(this.audioNode.duration);
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
        this.duration.innerHTML = handleTime(this.audioNode.currentTime) + ' / ' + handleTime(this.audioNode.duration);

        if (this.audioNode.currentTime === this.sourceDuration) {
            this.playButton.children[0].classList = '';
            this.playButton.children[0].classList = 'fa fa-play';
        };
    }

    handleHover() {
        if (this.props.hover) {
            this.timeline.addEventListener('mousemove', this.addHover, false);
            this.timeline.addEventListener('mouseout', this.removeHover, false);
        };
    }

    handlePlayhead() {
        let playPercent = this.timelineWidth * (this.audioNode.currentTime / this.audioNode.duration);

        if (this.props.margin) {
            this.playHead.style.marginLeft = playPercent + 'px';
        } else {
            this.playHead.style.paddingLeft = playPercent + 'px';
        };
    }

    handleResize() {
        let padding = this.playHead.style.paddingLeft;
        let p;

        padding === '' ? p = 0 : p = parseInt(padding.substring(0, padding.length - 2));
        this.timelineWidth = (this.timeline.offsetWidth - this.playHead.offsetWidth) + p;
        this.handlePlayhead();
    }

    mouseDown() {
        this.scrubberClicked = true;
        window.addEventListener('mousemove', this.moveplayhead, true);
        this.audioNode.removeEventListener('timeupdate', this.handlePlayhead, false);
    }

    mouseUp(e) {
        if (this.scrubberClicked === false) {
            return;
        };

        this.moveplayhead(e);
        window.removeEventListener('mousemove', this.moveplayhead, true);
        this.audioNode.currentTime = this.audioNode.duration * this.clickPercent(e);
        this.audioNode.addEventListener('timeupdate', this.handlePlayhead, false);
        this.scrubberClicked = false;
    }

    moveplayhead(e) {
        let positionOffset = handleOffsetParent(this.timeline);
        let newMargLeft = e.pageX - positionOffset;
        let n = this.playHead.style.width;

        if (newMargLeft >= 0 && newMargLeft <= this.timelineWidth) {
            n = newMargLeft + 'px';
        };

        if (newMargLeft < 0) {
            n = '0px';
        };

        if (newMargLeft > this.timelineWidth) {
            n = this.timelineWidth + 'px';
        };
    }

    removeHover() {
        this.hover.style.width = '0px';
    }

    render() {
        return (
            <div>
                <div className="riverine-player">
                    <div className="riverine-type-single">
                        <div className="riverine-gui riverine-interface riverine-player">
                            <AudioNode
                                audioIdPrefix={this.props.audioIdPrefix}
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
                            <ProgressBar mouseDown={this.mouseDown} />
                            <TimeHandler/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

Riverine.defaultProps = {
    hover: true
};

Riverine.propTypes = {
    hover: PropTypes.bool,
    source: PropTypes.string.isRequired
};

export default Riverine;
