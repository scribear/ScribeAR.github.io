import * as React from 'react';
import Theme from '../../theme'
import { useDispatch} from 'react-redux';
// import { map } from '../../../words';
import {TextField, Autocomplete, ThemeProvider} from '../../../muiImports';

export default function PremadePhraseList() {
//   const {myTheme} = Theme()
//   const dispatch = useDispatch();
//   const handleClickItem = (code) => { 
//     let toBeParsed = map.get(code)
//     if (toBeParsed) {
//     let json = JSON.parse(toBeParsed)
//     console.log(json)
//     }
// }
//   return (
//     <div>
//         <ThemeProvider theme={myTheme}>      
//         <Autocomplete
//               disablePortal
//               id="combo-box-demo"
//               value={"pick something"}
//               options={Array.from(map.keys())}
//               sx={{ width: 300 }}
//               onChange={(event, newValue) => {
//                 handleClickItem(newValue)
//               }}
//               renderInput={(params) => <TextField {...params} />}
//             />
//       </ThemeProvider>

//     </div>
//   );
}
