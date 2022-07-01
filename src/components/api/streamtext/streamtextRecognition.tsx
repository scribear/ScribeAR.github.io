import * as React from 'react';
import { DisplayStatus, StreamTextStatus, ControlStatus } from '../../../redux/types'


//   \"IHaveADream\" is the demo
//    props.streamTextStatus.streamTextKey -> The StreamText Key entered into the textbox 
//    props.displayStatus.textSize -> textSize 

export default function StreamText(props) {
//     let ttext = 
// "    <!DOCTYPE html>"+
// "    <html lang=\"en\">"+
// "    <head>"+
// "      <meta charset=\"UTF-8\">"+
// "      <title>Embedded player</title>"+
// "      <style>"+
// "        * {"+
// "          margin: 0;"+
// "          padding: 0;"+
// "        }"+
// "        html,"+
// "        body,"+
// "        table {"+
// "          width: 100%;"+
// "          height: 100%"+
// "        }"+
// "        td {"+
// "          width: 100%;"+
// "        }"+
// "      </style>"+
// "    </head>"+
// "    "+
// "    <body id=\"mcp\">"+
// "      <table>"+
// "        <tbody>"+
// "          <tr id=\"header\">"+
// "            <td>"+
// "              <label htmlFor=\"fontSize\">Size</label>"+
// "              <select id=\"fontSize\">"+
// "                <option value=\"14px\">14</option>"+
// "                <option value=\"18px\">18</option>"+
// "                <option value=\"24px\">24</option>"+
// "                <option value=\"30px\">30</option>"+
// "                <option value=\"36px\">36</option>"+
// "                <option value=\"42px\">42</option>"+
// "              </select>"+
// "              <label htmlFor=\"fontFamily\">Font</label>"+
// "              <select id=\"fontFamily\">"+
// "                <option value=\"Arial,sans-serif\">Arial</option>"+
// "                <option value=\"Courier New,monospace\">Courier New</option>"+
// "                <option value=\"Trebuchet MS,sans-serif\">Trebuchet</option>"+
// "                <option value=\"Verdana,sans-serif\">Verdana</option>"+
// "              </select>"+
// "              <label htmlFor=\"backColor\">Background</label>"+
// "              <select id=\"backColor\">"+
// "                <option value=\"#000000\">Black</option>"+
// "                <option value=\"#0000ff\">Blue</option>"+
// "                <option value=\"#008000\">Green</option>"+
// "                <option value=\"#ff0000\">Red</option>"+
// "                <option value=\"#ffff00\">Yellow</option>"+
// "                <option value=\"#ffffff\" selected=\"selected\">White</option>"+
// "              </select>"+
// "              <label htmlFor=\"foreColor\">Color</label>"+
// "              <select id=\"foreColor\">"+
// "                <option value=\"#000000\">Black</option>"+
// "                <option value=\"#00008b\">Dark Blue</option>"+
// "                <option value=\"#0000ff\">Blue</option>"+
// "                <option value=\"#008000\">Green</option>"+
// "                <option value=\"#ff0000\">Red</option>"+
// "                <option value=\"#ffff00\">Yellow</option>"+
// "                <option value=\"#ffffff\">White</option>"+
// "              </select>"+
// "              <label htmlFor=\"language\" id=\"languageLabel\" style=\"display: none\">Language</label>"+
// "              <select id=\"language\" style=\"display: none\">"+
// "              </select>"+
// "              <label htmlFor=\"scroll\">Scroll</label>"+
// "              <input type=\"checkbox\" id=\"scroll\" checked=\"checked\" />"+
// "            </td>"+
// "          </tr>"+
// "          <tr id=\"content\">"+
// "            <td style=\"height: 100%;\">"+
// "              <iframe id=\"streamTextIFrame\" style=\"border:0;width:100%;height:100%\"></iframe>"+
// "            </td>"+
// "          </tr>"+
// "        </tbody>"+
// "      </table>"+
// "      <script>"+
// "        document.querySelector(\"#streamTextIFrame\").src = \"//www.streamtext.net/player/embedded\" + document.location.search + \"&annotations=1\";"+
// "    "+
// "        let fontSize = document.querySelector(\"#fontSize\");"+
// "        let scroll = document.querySelector(\"#scroll\");"+
// "        let fontFamily = document.querySelector(\"#fontFamily\");"+
// "        let backColor = document.querySelector(\"#backColor\");"+
// "        let foreColor = document.querySelector(\"#foreColor\");"+
// "        let language = document.querySelector(\"#language\");"+
// "        let languageLabel = document.querySelector(\"#languageLabel\");"+
// "    "+
// "        var streamTextWindow;"+
// "        window.addEventListener(\"message\", receiveMessage, false);"+
// "    "+
// "        function receiveMessage(event) {"+
// "          if (event.source === window) return;"+
// "    "+
// "          let data = event.data && JSON.parse(event.data);"+
// "          if (!data || data.operation !== \"initialize\") return;"+
// "    "+
// "          streamTextWindow = event.source;"+
// "          updateOptions(data.options);"+
// "        }"+
// "    "+
// "        function updateOptions(options) {"+
// "          if (options.fontFamily) fontFamily.value = options.fontFamily;"+
// "          if (options.fontSize) fontSize.value = options.fontSize;"+
// "          if (options.foreColor) foreColor.value = options.foreColor;"+
// "          if (options.backColor) backColor.value = options.backColor;"+
// "          if (options.scroll !== undefined) scroll.checked = options.scroll;"+
// "          if (options.languages && options.languages.length > 1) {"+
// "            language.innerHTML = \"\"; //clear the options if they exist"+
// "            language.style.display = \"unset\";"+
// "            languageLabel.style.display = \"unset\";"+
// "            options.languages.forEach(function (lang) {"+
// "              let option = document.createElement(\"option\");"+
// "              option.value = lang.value;"+
// "              option.label = lang.label;"+
// "              language.appendChild(option);"+
// "            });"+
// "            language.value = options.language;"+
// "          }"+
// "        }"+
// "    "+
// "        function updateStreamTextWindow(options) {"+
// "          if (!streamTextWindow) return;"+
// "          streamTextWindow.postMessage(JSON.stringify({ operation: \"update-options\", options: options }), \"*\");"+
// "        }"+
// "    "+
// "        document.addEventListener(\"DOMContentLoaded\", function () {"+
// "          fontFamily.addEventListener(\"change\", function (e) {"+
// "            updateStreamTextWindow({ fontFamily: e.target.value });"+
// "          });"+
// "          fontSize.addEventListener(\"change\", function (e) {"+
// "            updateStreamTextWindow({ fontSize: e.target.value });"+
// "          });"+
// "          foreColor.addEventListener(\"change\", function (e) {"+
// "            updateStreamTextWindow({ foreColor: e.target.value });"+
// "          });"+
// "          backColor.addEventListener(\"change\", function (e) {"+
// "            updateStreamTextWindow({ backColor: e.target.value });"+
// "          });"+
// "          scroll.addEventListener(\"change\", function (e) {"+
// "            updateStreamTextWindow({ scroll: e.target.checked });"+
// "          });"+
// "          language.addEventListener(\"change\", function (e) {"+
// "            updateStreamTextWindow({ language: e.target.value });"+
// "          });"+
// "        });"+
// "      </script>"+
// "    </body>"+
// "    "+
// "    </html> "



//     function createMarkup(ttext) { return {__html: ttext}; };
//     const yo = () => {
//     document.querySelector("#streamTextIFrame").src = "//www.streamtext.net/player/embedded" + document.location.search + "&annotations=1";

//     let fontSize = document.querySelector("#fontSize");
//     let scroll = document.querySelector("#scroll");
//     let fontFamily = document.querySelector("#fontFamily");
//     let backColor = document.querySelector("#backColor");
//     let foreColor = document.querySelector("#foreColor");
//     let language = document.querySelector("#language");
//     let languageLabel = document.querySelector("#languageLabel");

//     var streamTextWindow;
//     window.addEventListener("message", receiveMessage, false);

//     function receiveMessage(event) {
//       if (event.source === window) return;

//       let data = event.data && JSON.parse(event.data);
//       if (!data || data.operation !== "initialize") return;

//       streamTextWindow = event.source;
//       updateOptions(data.options);
//     }

//     function updateOptions(options) {
//       if (options.fontFamily) fontFamily.value = options.fontFamily;
//       if (options.fontSize) fontSize.value = options.fontSize;
//       if (options.foreColor) foreColor.value = options.foreColor;
//       if (options.backColor) backColor.value = options.backColor;
//       if (options.scroll !== undefined) scroll.checked = options.scroll;
//       if (options.languages && options.languages.length > 1) {
//         language.innerHTML = ""; //clear the options if they exist
//         language.style.display = "unset";
//         languageLabel.style.display = "unset";
//         options.languages.forEach(function (lang) {
//           let option = document.createElement("option");
//           option.value = lang.value;
//           option.label = lang.label;
//           language.appendChild(option);
//         });
//         language.value = options.language;
//       }
//     }

//     function updateStreamTextWindow(options) {
//       if (!streamTextWindow) return;
//       streamTextWindow.postMessage(JSON.stringify({ operation: "update-options", options: options }), "*");
//     }

//     document.addEventListener("DOMContentLoaded", function () {
//       fontFamily.addEventListener("change", function (e) {
//         updateStreamTextWindow({ fontFamily: e.target.value });
//       });
//       fontSize.addEventListener("change", function (e) {
//         updateStreamTextWindow({ fontSize: e.target.value });
//       });
//       foreColor.addEventListener("change", function (e) {
//         updateStreamTextWindow({ foreColor: e.target.value });
//       });
//       backColor.addEventListener("change", function (e) {
//         updateStreamTextWindow({ backColor: e.target.value });
//       });
//       scroll.addEventListener("change", function (e) {
//         updateStreamTextWindow({ scroll: e.target.checked });
//       });
//       language.addEventListener("change", function (e) {
//         updateStreamTextWindow({ language: e.target.value });
//       });
//     });
//     }
//             return (
//                 <html lang="en">


// <body id="mcp">
//   <table>
//     <tbody>
//       <tr id="header">
//         <td>
//           <label htmlFor="fontSize">Size</label>
//           <select id="fontSize">
//             <option value="14px">14</option>
//             <option value="18px">18</option>
//             <option value="24px">24</option>
//             <option value="30px">30</option>
//             <option value="36px">36</option>
//             <option value="42px">42</option>
//           </select>
//           <label htmlFor="fontFamily">Font</label>
//           <select id="fontFamily">
//             <option value="Arial,sans-serif">Arial</option>
//             <option value="Courier New,monospace">Courier New</option>
//             <option value="Trebuchet MS,sans-serif">Trebuchet</option>
//             <option value="Verdana,sans-serif">Verdana</option>
//           </select>
//           <label htmlFor="backColor">Background</label>
//           <select id="backColor">
//             <option value="#000000">Black</option>
//             <option value="#0000ff">Blue</option>
//             <option value="#008000">Green</option>
//             <option value="#ff0000">Red</option>
//             <option value="#ffff00">Yellow</option>
//             <option value="#ffffff" selected="true">White</option>
//           </select>
//           <label htmlFor="foreColor">Color</label>
//           <select id="foreColor">
//             <option value="#000000">Black</option>
//             <option value="#00008b">Dark Blue</option>
//             <option value="#0000ff">Blue</option>
//             <option value="#008000">Green</option>
//             <option value="#ff0000">Red</option>
//             <option value="#ffff00">Yellow</option>
//             <option value="#ffffff">White</option>
//           </select>
//           <label htmlFor="language" id="languageLabel" style="display: none">Language</label>
//           <select id="language" style="display: none">
//           </select>
//           <label htmlFor="scroll">Scroll</label>
//           <input type="checkbox" id="scroll" checked="checked" />
//         </td>
//       </tr>
//       <tr id="content">
//         <td style="height: 100%;">
//           <iframe id="streamTextIFrame" style="border:0;width:100%;height:100%"></iframe>
//         </td>
//       </tr>
//     </tbody>
//   </table>
//     {{
        
   
// }}
// </body>
// </html> 
//             );
       return (null)
}