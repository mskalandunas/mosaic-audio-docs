import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { handleOffsetParent, handleTime, newId } from '../lib/utilities';

export class Riverine extends Component {
    constructor() {
        super();
        this.scrubberClicked = false;
        this.duration = '';
        this.audioNode = '';
        this.playButton = '';
        this.playHead = '';
        this.timeline = '';
        this.timelineWidth = '';
        this.sourceDuration = '';

        this.addHover = this.addHover.bind(this);
        this.clickPercent = this.clickPercent.bind(this);
        this.returnDuration = this.returnDuration.bind(this);
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

    play() {
        if (this.audioNode.paused) {
            this.audioNode.play();
            this.playButton.children[0].classList = '';
            this.playButton.children[0].classList = 'fa fa-pause';
        } else {
            this.audioNode.pause();
            this.playButton.children[0].classList = '';
            this.playButton.children[0].classList = 'fa fa-play';
        };
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
                            <audio id={newId('audio-')} preload="auto" onDurationChange={this.returnDuration} onTimeUpdate={this.updateTime} loop={this.props.loop}>
                                <source src={this.props.source}/>
                            </audio>
                            <ul className="riverine-controls">
                                <li className="play-button-container">
                                    <a className="riverine-play" onClick={this.play}>
                                        <i className="fa fa-play"></i>
                                    </a>
                                </li>
                            </ul>
                            <div className="riverine-progress" onMouseDown={this.mouseDown}>
                                <div className="riverine-seek-bar">
                                    <div className="riverine-play-bar" onMouseDown={this.mouseDown}></div>
                                </div>
                            </div>
                            <div className="riverine-time-holder">
                                <span></span>
                            </div>
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
