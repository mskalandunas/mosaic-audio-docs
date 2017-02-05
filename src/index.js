'use strict';

import './css/style.css';
import React from 'react';
import { render } from 'react-dom';
import Riverine from './js/components/riverine';

class App extends React.Component {
  render() {
    return (
      <Riverine/>
    )
  }
}

render(<App/>, document.querySelector('#root'));
