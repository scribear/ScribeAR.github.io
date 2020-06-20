import React, { useState } from 'react';
import onClickOutside from 'react-onclickoutside';

export default function TargetLanguge(props) {

    return (
        <div>
            <select id="targetlanguageoptions">
                        <option value="ar-">Arabic - EG</option>
                        <option value="ca">Catalan - ES</option>
                        <option value="da">Danish - DK</option>
                        <option value="da">Danish - DK</option>
                        <option value="de">German - DE</option>
                        <option value="en">English - AU</option>
                        <option value="en">English - CA</option>
                        <option value="en">English - GB</option>
                        <option value="en">English - IN</option>
                        <option value="en">English - NZ</option>
                        <option value="en" selected="selected">English - US</option>
                        <option value="es">Spanish - ES</option>
                        <option value="es">Spanish - MX</option>
                        <option value="fi">Finnish - FI</option>
                        <option value="fr">French - CA</option>
                        <option value="fr">French - FR</option>
                        <option value="hi">Hindi - IN</option>
                        <option value="it">Italian - IT</option>
                        <option value="ja">Japanese - JP</option>
                        <option value="ko">Korean - KR</option>
                        <option value="nb">Norwegian - NO</option>
                        <option value="nl">Dutch - NL</option>
                        <option value="pl">Polish - PL</option>
                        <option value="pt">Portuguese - BR</option>
                        <option value="pt">Portuguese - PT</option>
                        <option value="ru">Russian - RU</option>
                        <option value="sv">Swedish - SE</option>
                        <option value="zh">Chinese - CN</option>
                        <option value="zh">Chinese - HK</option>
                        <option value="zh">Chinese - TW</option>

                    </select>
        </div>
    )
}