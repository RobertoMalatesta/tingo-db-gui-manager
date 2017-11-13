import {combineReducers} from 'redux'

// All the new reducers go up here
const modal = (state = false, action) => {
    switch (action.type) {
        case 'MODAL':
            return action.display;    
        default:
            return state;
    }
}

const collections = (state = [], action) => {
    switch (action.type) {
        case 'ADD_COLLECTION':
            return state.find((e)=>e===action.collectionName) ? state : [...state, action.collectionName]  
        case 'DELETE_COLLECTION':
            return [...state].filter(col => col!== action.collectionName)
        default:
            return state;
    }
}

export default combineReducers({
    // name all the reducers you have defined here
    modal,
    collections
})