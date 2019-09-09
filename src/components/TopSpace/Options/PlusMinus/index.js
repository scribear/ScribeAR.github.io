import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

export default function PlusMinus(props) {
     const setting = useSelector(props.setting);
     const dispatch = useDispatch();
     console.log(setting);
     return (
          <div className="row">
               <div className="col-2 align-items-center">
                    <button
                      className="btn btn-default"
                      onClick={() => dispatch(props.decrement())}>-</button>
               </div>
               <div className="col-5">
                    <p>{props.item}</p>
               </div>
               <div className="col-1">
                    <p style={{textAlign:"right"}}>{setting}</p>
               </div>
               <div className="col-2 align-items-center">
                    <button
                      className="btn btn-default"
                      onClick={() => dispatch(props.increment())}>+</button>
               </div>
          </div>
     );
}
