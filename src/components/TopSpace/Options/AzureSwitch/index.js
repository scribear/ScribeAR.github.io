import React from 'react'
import MenuSwitch from '../../../PopMenu/MenuSwitch'
import {useSelector} from 'react-redux'
import {prev_azure,
        next_azure} from '../../../../redux/actions'
import Divider from '@material-ui/core/Divider'
import Save from '../Save'
import Record from '../Record'

export default function AzureSwitch(){
    const sw = (state)=>state.azuresw 
    const setting = useSelector(sw)
    if (setting == 1){
        return (
            <div>
                <MenuSwitch title = 'WebSpeech' left = {prev_azure} right = {next_azure} />
                <Divider/>
                <div className="item-wrapper">
                    <Record />
                </div>
                <div className="item-wrapper">
                    <Save />
                 </div>
            </div>
        )
    }else{
        return (
            <div>
                <MenuSwitch title = 'Azure' left = {prev_azure} right = {next_azure}/>
                <Divider />
                <div className="item-wrapper instruction">
                    <Save />
                 </div>
            </div>
        )
    }
}