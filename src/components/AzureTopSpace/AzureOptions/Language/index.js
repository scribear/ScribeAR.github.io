import React, { useState } from 'react';
import onClickOutside from 'react-onclickoutside';

export default function LanguageOptions(props) {

    return (
        <div>
            <select id="languageOptions">
                        <option value="ar-EG">Arabic - EG</option>
                        <option value="ca-ES">Catalan - ES</option>
                        <option value="da-DK">Danish - DK</option>
                        <option value="da-DK">Danish - DK</option>
                        <option value="de-DE">German - DE</option>
                        <option value="en-AU">English - AU</option>
                        <option value="en-CA">English - CA</option>
                        <option value="en-GB">English - GB</option>
                        <option value="en-IN">English - IN</option>
                        <option value="en-NZ">English - NZ</option>
                        <option value="en-US" selected="selected">English - US</option>
                        <option value="es-ES">Spanish - ES</option>
                        <option value="es-MX">Spanish - MX</option>
                        <option value="fi-FI">Finnish - FI</option>
                        <option value="fr-CA">French - CA</option>
                        <option value="fr-FR">French - FR</option>
                        <option value="hi-IN">Hindi - IN</option>
                        <option value="it-IT">Italian - IT</option>
                        <option value="ja-JP">Japanese - JP</option>
                        <option value="ko-KR">Korean - KR</option>
                        <option value="nb-NO">Norwegian - NO</option>
                        <option value="nl-NL">Dutch - NL</option>
                        <option value="pl-PL">Polish - PL</option>
                        <option value="pt-BR">Portuguese - BR</option>
                        <option value="pt-PT">Portuguese - PT</option>
                        <option value="ru-RU">Russian - RU</option>
                        <option value="sv-SE">Swedish - SE</option>
                        <option value="zh-CN">Chinese - CN</option>
                        <option value="zh-HK">Chinese - HK</option>
                        <option value="zh-TW">Chinese - TW</option>

                    </select>
        </div>
    )
}