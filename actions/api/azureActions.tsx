import store from '../../store'
const nullFunction = () => {};

const DEFAULT_KEY = "NULL";
const DEFAULT_REGION = "NULL";
enum AZURE_STATUS {
    "CORRECT",
    "PENDING",
    "NULL"
}

//AZURE ACTIONS
export const saveAzureOptions = (props) => {
    if (props.azureKey !== DEFAULT_KEY) {
        localStorage.setItem('azure_subscription_key', props.azureKey);
    }
    if (props.azureRegion !== DEFAULT_REGION) {
        localStorage.setItem('azure_region', props.azureRegion);
    }
    store.dispatch({type: 'SAVE_AZURE_OPTIONS', payload: {azureKey: props.azureKey, azureRegion: props.azureRegion}})
}

export const changeAzureStatus = (props) => {
    store.dispatch({type: 'CHANGE_AZURE_STATUS', payload: {azureStatus: props.status}});
}
