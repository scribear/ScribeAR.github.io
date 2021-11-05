import { useDispatch } from 'react-redux';
export default function Theme(props) {
    const dispatch = useDispatch()
    type color = {
        hex: string
        rgb: string
        text: number
    }
    
    let colors: color[][] = [
        [
            {hex: '#000000', rgb: '#466636', text: 0},
            {hex: '#000000', rgb: '#995262', text: 0},
            {hex: '#000000', rgb: '#527399', text: 1},
            {hex: '#000000', rgb: '#705299', text: 1},
        ],
        [    
            {hex: '#0f0f0f', rgb:  '#292929', text: 0},
            {hex: '#5c5c5c', rgb: '#1f1f1f', text: 0},
            {hex: '#c2c2c2', rgb: '#5c5c5c', text: 0},
            {hex: '#ebebeb', rgb: '#858585', text: 0},
        ],
        //Dark
        [
            {hex: '#23331b', rgb: '#466636', text: 1},
            {hex: '#331b21', rgb: '#995262', text: 1},
            {hex: '#1b2633', rgb: '#527399', text: 1},
            {hex: '#251b33', rgb: '#705299', text: 1},
        ],
        //Light
        [
            {hex: '#d7ffc4', rgb: '#689952', text: 0},
            {hex: '#ffc4d1', rgb: '#b35f72', text: 0},
            {hex: '#c4dfff', rgb: '#5f86b3', text: 0},
            {hex: '#ddc4ff', rgb: '#835fb3', text: 0},
        ],
        //Light
        [   
            {hex: '#f7fff3', rgb: '#8bcc6d', text: 0},
            {hex: '#fff3f6', rgb: '#ff88a3', text: 0},
            {hex: '#f3f9ff', rgb: '#88bfff', text: 0},
            {hex: '#f8f3ff', rgb: '#bb88ff', text: 0},
        ],
        
    ]
    const changeTheme = (event) =>
    {
        let copy = JSON.parse(event.target.value)
        if (copy.text == 0) {
            copy.text = '#000000'
        } else {
            copy.text = '#FFFFFF'
        }
        dispatch({type: 'CHANGE_PRIMARY_THEME', payload: copy.hex})
        dispatch({type: 'CHANGE_SECONDARY_THEME', payload: copy.rgb})
        dispatch({type: 'CHANGE_TEXT_COLOR', payload: copy.text})
    }
    return (
        <div className="circle-picker " style={{display: 'flex', flexWrap: 'wrap', marginBottom: '-2vw', marginLeft: '.8vw' }}>
                <table>
                {Array.from(Array(5)).map((_, xIndex) => (
                    <tr>
                        {colors[xIndex].map((colors: color, yIndex) =>
                            <th>
                                <div style={{ width: '1.5vw', height: '1.5vw', marginRight: '.8vw', marginBottom: '.8vw', transform: 'scale(1)', transition: 'transform 100ms ease 0s' }}>
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
                                            boxShadow: colors.hex + ' 0px 0px 0px 15px inset',
                                            transition: 'box-shadow 100ms ease 0s'
                                        }} />
                                    </span>
                                </div>
                            </th>
                        )}
                    </tr>
                     ))}
                </table>
        </div>

    )

}

            