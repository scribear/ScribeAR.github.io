import React, { useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import store from '../../../../store/';
import './index.css'

export default function RegionOptions(props) {

    return (
        <div className = "regionSelect">
            <select id="regionOptions">
                        <option value="westus">US West</option>
                        <option value="westus2">US West 2</option>
                        <option value="ussouthcentral">US South Central</option>
                        <option value="northcentralus" selected="selected">US West Central</option>
                        <option value="useast">US East</option>
                        <option value="useast2">US East 2</option>
                        <option value="europewest">Europe West</option>
                        <option value="europenorth">Europe North</option>
                        <option value="brazilsouth">South Brazil</option>
                        <option value="australiaeast">East Australia</option>
                        <option value="asiasoutheast">Asia Southeast</option>
                        <option value="asiaeast">Asia East</option>
                    </select>
        </div>
    )
}
