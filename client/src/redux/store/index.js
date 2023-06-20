const initialState={};
import {createStore,applyMiddleware,legacy_createStore} from 'redux';
import rootReducer from '../reducers';

import thunk from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension";



const middleware=[thunk];
const store = createStore(rootReducer,{},composeWithDevTools(applyMiddleware(...middleware))
);