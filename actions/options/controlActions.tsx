import store from '../../store'


export const SwitchListening = () => {
    store.dispatch({type: 'FLIP_RECORDING'})
}
