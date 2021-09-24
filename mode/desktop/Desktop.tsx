import './Desktop.css';
import AppBar from '../../components/topbar/topbar'
import React, { Dispatch, useState, Component } from 'react';
import { changeCurrentAPI } from './../../actions/api/APIActions'
import { useDispatch, useSelector } from 'react-redux';
import Recognition from './../../components/api/recognition'
export default function Desktop(props) {
   const dispatch = useDispatch()
   const idk = useSelector((state) => state)
   console.log(idk)
   return (
     <div>
        <AppBar/>
     </div>
   )
  }

