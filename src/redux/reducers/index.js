import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import peopleReducer from './people';
import userDetailsReducer from './peopleDetails';

export const history = createBrowserHistory();

const initialState = {};

export function appReducer(state = initialState, action) {
  return state;
}

const rootReducer = combineReducers({
  app: appReducer,
  people: peopleReducer,
  peopleDetails: userDetailsReducer,
  router: connectRouter(history)
})

export default rootReducer;