import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

export default function PlusMinus({ item, value, decrement, increment }) {
     return (
          <div className="row">
               <div className="col-2 align-items-center">
                    <button onClick={decrement}>-</button>
               </div>
               <div className="col-6">
                    <p>{item}</p>
               </div>
               <div className="col-2 align-items-center">
                    <button onClick={increment}>+</button>
               </div>
          </div>
     );
}

PlusMinus.propTypes = {
     item: PropTypes.string,
     value: PropTypes.string,
     decrement: PropTypes.func,
     increment: PropTypes.func,
}
