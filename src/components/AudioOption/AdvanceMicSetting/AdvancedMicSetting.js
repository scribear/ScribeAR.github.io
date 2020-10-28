import React from 'react';
import PlusMinus from "../../TopSpace/Options/PlusMinus/PlusMinus";
import {
    decrease_sensitivity,
    increase_sensitivity,
} from "../../../redux/actions";

export default function AdvanceMicSetting() {
   const sens = (state) => state.sens;

    return (
        <div className="item-wrapper">
            <PlusMinus item="Sensitivity" setting={sens}
                       increment={increase_sensitivity}
                       decrement={decrease_sensitivity}/>
        </div>
    )
}