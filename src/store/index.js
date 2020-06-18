import {createStore, combineReducers} from 'redux'

// 7882896e3ffc4fe3b2f4c055f0914d67 <- thats the key!!

const initialState = {
    inputValue: 'enter'
}

const initialStateRegion = {
    inputValue: 'enter'
}

const initialStateSuccess= {
    inputValue: 'false'
}

var azureKeyReducer = (state = initialState, action) =>{

    switch(action.type) {
        case 'INPUT_KEY':
            return Object.assign({}, state, {inputValue: action.text });

        default:
            return state;
    }
}

var isSuccessReducer = (state = initialStateSuccess, action) =>{

    switch(action.type) {
        case 'INPUT_SUCCESS':
            return Object.assign({}, state, {inputValue: action.text });
        default:
            return state;
    }
}



var azureRegionOptionsReducer = (state = initialStateRegion, action) => {
    switch(action.type) {
        case 'INPUT_REGION':
            return Object.assign({}, state, {inputValue: action.text});

        default:
            return state;
    }
}


const allReducers = combineReducers({
    azureOptions: azureRegionOptionsReducer,
    azureKey: azureKeyReducer,
    isSuccess: isSuccessReducer,
});


const store = createStore(azureKeyReducer);

export default store;
