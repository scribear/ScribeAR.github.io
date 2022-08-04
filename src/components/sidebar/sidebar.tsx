import * as React from 'react';
import {IconButton,  ListItemText, ListItem, ListItemIcon, Grid, ExpandMore,  ExpandLess,  List,  EqualizerIcon,  DetailsIcon, Divider,} from '../../muiImports'
import DisplayMenu from './display/menu';
import LangMenu from './language/menu';
import PhraseMenu from './phrase/menu';
import VisualizationMenu from './audioVisBar/menu';
import CloseIcon from '@material-ui/icons/Close';

export default function STT(props) {
  const [state, setState] = React.useState({
    display: false,
    lang: true,
    visualization: false,
    phraseRecognition: false,
  });

  const mobCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
  };
  
  const toggleDrawer =
    (head: string) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setState({ ...state, [head]: !state[head] })
      }
  
  const listItemHeader = (subMenu: string, drawerName: string, Icon) => {
    return (
    <ListItem>
        <ListItemIcon>
          <Icon/>
        </ListItemIcon>
        <ListItemText primary= {subMenu} />
        <IconButton onClick={toggleDrawer(drawerName)} >
          {state[drawerName] ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
    )
  }


  return (
    <div>
    <h2 className="d-table-cell tar2" style={{textAlign: "left", paddingLeft: "20px", transition:'.6s'}}>Menu</h2>
      <List
        sx={{ width: '50vw',
         bgcolor: 'background.paper',
         '@media (max-width: 800px) and (orientation: portrait)': {
            width: '100vw',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
         },
        '@media (max-height: 600px) and (orientation: landscape)': {
          width: '100vw',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
        },
          }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <LangMenu
          open={state.lang}
          isRecording={props.isRecording}
          listItemHeader={listItemHeader}
        />
        <Divider/>
        <DisplayMenu
          open={state.display}
          listItemHeader={listItemHeader}
        />
        <Divider/>
        <PhraseMenu
          open={state.phraseRecognition}
          icon={DetailsIcon}
          listItemHeader={listItemHeader}
        />
        <Divider/>
          <VisualizationMenu
            open={state.visualization}
            icon={EqualizerIcon}
            listItemHeader={listItemHeader}
          />
        <Divider/>
        
        

        {/* <button onClick={props.onClose}>Check</button> */}
      </List>
      {mobCheck() ? 
      <Grid container style={{
        width: '20vw',
      }}>
      <IconButton onClick={props.onClose} sx={{
            cursor:'pointer',
            float:'right',
            position: 'absolute',
            right: '3px',
            top: '2vh',
            '@media (max-width: 350px)': {
              top: '3.5vh',
            },
            width: '10vw',
            height: '10vw',
        }}>
          <CloseIcon style={{
            width: '10vw',
            height: '10vh',
            paddingRight: '20px',
          }} />
        </IconButton>
        </Grid> : null}
    </div>
  );
}


