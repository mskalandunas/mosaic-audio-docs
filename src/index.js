'use strict';

import React from 'react';
import { render } from 'react-dom';
import Riverine from './js/components/riverine';

const Root = () => {
  return (
    <div>
      <Riverine
        hover={true}
        source="audio/1.mp3"
      />
    </div>
  )
}

render(<Root/>, document.querySelector('#root'));
