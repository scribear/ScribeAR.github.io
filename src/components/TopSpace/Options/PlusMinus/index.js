import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

export default function PlusMinus(props) {
     const setting = useSelector(props.setting)
     const lockScreen = useSelector((state) => state.lockScreen)
     const dispatch = useDispatch()
     return (
          <div className="row">
               <div className="col-2 align-items-center">
                    <button className="btn btn-default"
                      onClick={() => {
                         if (!lockScreen)
                              dispatch(props.decrement())
                      }}>-</button>
               </div>
               <div className="col-5">
                    <p>{props.item}</p>
               </div>
               <div className="col-1">
                    <p style={{textAlign:"right"}}>{setting}</p>
               </div>
               <div className="col-2 align-items-center">
                    <button className="btn btn-default"
                      onClick={() => {
                         if (!lockScreen)
                              dispatch(props.increment())
                      }}>+</button>
               </div>
          </div>
     );
}
