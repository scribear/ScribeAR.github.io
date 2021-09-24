import store from '../../store'

enum APIS {
    "WEBSPEECH",
    "AZURE",
    "STREAMTEXT"
}
enum STATUS {
    "AVAILABLE",
    "NULL",
    "UNAVAILABLE"
}
export const changeCurrentAPI = (currentAPI: string) => {
    store.dispatch({type: 'CHANGED_CURRENT_API', payload: currentAPI});
}

export const changeAPIStatus = (props) => {
  if (props.API === APIS.WEBSPEECH) {
    localStorage.setItem('webspeech_status', props.status);
    store.dispatch({type: 'CHANGE_API_STATUS', payload: {webspeechStatus: props.status}})
  } else if (props.API === APIS.AZURE) {
    localStorage.setItem('azure_status', props.status);
    store.dispatch({type: 'CHANGE_API_STATUS', payload: {azureStatus: props.status}})
  } else if (props.API === APIS.STREAMTEXT) {
    localStorage.setItem('streamtext_status', props.status);
    store.dispatch({type: 'CHANGE_API_STATUS', payload: {streamtextStatus: props.status}})
  }
}
