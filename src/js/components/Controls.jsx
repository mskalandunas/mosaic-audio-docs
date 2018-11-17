import PropTypes from 'prop-types';
import React from 'react';

export const Controls = props => {
    return (
        <div className="riverine-controls">
            {props.children}
        </div>
    );
};

Controls.propTypes = {
    children: PropTypes.node.isRequired
};

export default Controls;