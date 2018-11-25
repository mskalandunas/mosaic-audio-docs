import './css/player.css';
import React from 'react';
import { render } from 'react-dom';
import Riverine from './js/components/Riverine';

const Root = () => {
    return (
        <div>
            <Riverine
                source="audio/1.mp3"
            />
        </div>
    );
};

render(<Root/>, document.querySelector('#root'));
