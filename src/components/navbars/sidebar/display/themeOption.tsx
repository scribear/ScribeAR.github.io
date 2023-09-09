import { useDispatch, useSelector } from 'react-redux';
import { RootState, DisplayStatus } from '../../../../react-redux&middleware/redux/typesImports';

export default function Theme(props) {
    const dispatch = useDispatch()

    type color = {
        hex: string
        rgb: string
        text: string
    }

    let top_colors: color[][] = [
        //hex background, rgb accent, text font color
        [    
            {hex: '#13294B', rgb: '#e84a27', text: '#ffffff'},
            {hex: '#000000', rgb: '#8b0000', text: '#ffff00'},
            {hex: '#734f9a', rgb: '#8bd450', text: '#ffffff'},
            {hex: '#f2bc94', rgb: '#722620', text: '#30110d'},
        ],
    ]
    
    let colors: color[][] = [
        //hex background, rgb accent, text font color
        //black and white
        [    
            {hex: '#0f0f0f', rgb: '#292929', text: '#FFFFFF'},
            {hex: '#5c5c5c', rgb: '#1f1f1f', text: '#FFFFFF'},
            {hex: '#c2c2c2', rgb: '#5c5c5c', text: '#000000'},
            {hex: '#ebebeb', rgb: '#858585', text: '#000000'},
        ],
        //black
        [
            {hex: '#000000', rgb: '#466636', text: '#FFFFFF'},
            {hex: '#000000', rgb: '#995262', text: '#FFFFFF'},
            {hex: '#000000', rgb: '#527399', text: '#FFFFFF'},
            {hex: '#000000', rgb: '#705299', text: '#FFFFFF'},
        ],
        //dark
        [
            {hex: '#23331b', rgb: '#466636', text: '#FFFFFF'},
            {hex: '#331b21', rgb: '#995262', text: '#FFFFFF'},
            {hex: '#1b2633', rgb: '#527399', text: '#FFFFFF'},
            {hex: '#251b33', rgb: '#705299', text: '#FFFFFF'},
        ],
        //light
        [
            {hex: '#d7ffc4', rgb: '#689952', text: '#000000'},
            {hex: '#ffc4d1', rgb: '#b35f72', text: '#000000'},
            {hex: '#c4dfff', rgb: '#5f86b3', text: '#000000'},
            {hex: '#ddc4ff', rgb: '#835fb3', text: '#000000'},
        ],
        //white
        [   
            {hex: '#f7fff3', rgb: '#8bcc6d', text: '#000000'},
            {hex: '#fff3f6', rgb: '#ff88a3', text: '#000000'},
            {hex: '#f3f9ff', rgb: '#88bfff', text: '#000000'},
            {hex: '#f8f3ff', rgb: '#bb88ff', text: '#000000'},
        ],
        //colorful
        [   
            {hex: '#3499cb', rgb: '#e2af8d', text: '#ffffff'},
            {hex: '#210070', rgb: '#42aad7', text: '#2be0f7'},
            {hex: '#ffa781', rgb: '#c40a0a', text: '#5b0e2d'},
            {hex: '#cc7619', rgb: '#41321d', text: '#2be0f7'},
        ],
    ]

    const changeTheme = (event) =>
    {
        let copy = JSON.parse(event.target.value)
        dispatch({type: 'CHANGE_PRIMARY_THEME', payload: copy.hex})
        dispatch({type: 'CHANGE_SECONDARY_THEME', payload: copy.rgb})
        dispatch({type: 'CHANGE_TEXT_COLOR', payload: copy.text})
    }

    const displayStatus = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
     });

    // will be called everytime i click on Preset Themes; needs debugging
    // const testing = () => {
    //     dispatch({type: 'CHANGE_PRIMARY_THEME', payload: colors[4][0].hex})
    //     dispatch({type: 'CHANGE_SECONDARY_THEME', payload: colors[4][0].rgb})
    //     dispatch({type: 'CHANGE_TEXT_COLOR', payload: colors[4][0].text})
    //     console.log("in here testing")
    // }

    // useEffect(() => {
    //     // Function to be executed at the first render
    //     testing();
    //   }, []);

    return (
        <div className="circle-picker " style={{display: 'flex', flexWrap: 'wrap', marginBottom: '-2vw', marginLeft: '.8vw' }}>
            <table>
                {Array.from(Array(1)).map((_, xIndex) => (
                <tr>{top_colors[xIndex].map((colors: color, yIndex) =>
                    <th><div style={{ width: '2.5vw', height: '2.5vw', marginRight: '.8vw', marginBottom: '.2vw', transform: 'scale(1)', transition: 'transform 100ms ease 0s' }}>
                        <span>
                            <button tabIndex={0} value = {JSON.stringify(colors)} onClick={changeTheme} style={{
                                background: 'transparent',
                                height: '100%',
                                width: '100%',
                                cursor: 'pointer',
                                borderStyle: 'solid',
                                position: 'relative',
                                borderColor: colors.rgb,
                                borderRadius: '30%',
                                borderWidth: 'thick',
                                outline: 'none',
                                boxShadow: colors.hex + ' 0px 0px 0px 100px inset',
                                transition: 'box-shadow 100ms ease 0s',
                                color: colors.text,
                                textAlign: 'center',
                                fontWeight: 'bolder',
                                fontSize: '1.2vw'
                                }}> T </button>
                        </span>
                        </div>
                    </th>)}
                </tr>))}
                
                <div style={{width: '400%', height: '2px', backgroundColor: displayStatus.secondaryColor, margin: '10px 0'}}></div>

                {Array.from(Array(6)).map((_, xIndex) => (
                <tr>{colors[xIndex].map((colors: color, yIndex) =>
                    <th><div style={{ width: '2.5vw', height: '2.5vw', marginRight: '.8vw', marginBottom: '.8vw', transform: 'scale(1)', transition: 'transform 100ms ease 0s' }}>
                        <span>
                            <button tabIndex={0} value = {JSON.stringify(colors)} onClick={changeTheme} style={{
                                background: 'transparent',
                                height: '100%',
                                width: '100%',
                                cursor: 'pointer',
                                borderStyle: 'solid',
                                position: 'relative',
                                borderColor: colors.rgb,
                                borderRadius: '30%',
                                borderWidth: 'thick',
                                outline: 'none',
                                boxShadow: colors.hex + ' 0px 0px 0px 100px inset',
                                transition: 'box-shadow 100ms ease 0s',
                                color: colors.text,
                                textAlign: 'center',
                                fontWeight: 'bolder',
                                fontSize: '1.2vw'
                                }}> T </button>
                        </span>
                        </div>
                    </th>)}
                </tr>))}
                </table>
        </div>

    )

}

            