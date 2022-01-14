import { call, takeEvery, put, apply, take, select, fork } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';
import { LOAD_USERS, LOAD_USERS_SUCCESS } from '../../reducers/people/actions';
import { selectPeople } from '../../reducers/people/selectors';
import { matchPath } from 'react-router';
import { getRouteConfig } from '../../../routes';
import { MAIN_ROUTE, PEOPLE_DETAILS_ROUTE } from '../../../routes';
import { LOAD_USER_DETAILS, LOAD_USER_DETAILS_FAILURE, LOAD_USER_DETAILS_SUCCESS } from '../../reducers/peopleDetails/actions'

export function* loadPeopleDetails({payload}) {
  const { id } = payload;
  
  try {
    const request = yield call(
      fetch,
      `https://swapi.dev/api/people/${id}`
    );
    const data = yield apply(request, request.json);

    yield put({
      type: LOAD_USER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    yield put({
      type: LOAD_USER_DETAILS_FAILURE,
      payload: error,
    })
  }
  
}

// worker saga
export function* loadPeopleList({ payload }) {
  const { page, search } = payload;

  // call creates a plain object describing the function call
  // the redux-saga middleware takes care of executing the function call and resuming the generator with the resolved response
  const request = yield call(
    fetch,
    `https://swapi.dev/api/people?page=${page}&search=${search}`
  );
  const data = yield apply(request, request.json);

  // put will dispatch an action (like dispatch itself in usual components)
  yield put({
    type: LOAD_USERS_SUCCESS,
    payload: data,
  })
}

// worker saga? now its watcher
export function* routeChangeSaga() {
  while (true) {
    // take our action with "take" effect from redux-saga
    const action = yield take(LOCATION_CHANGE)

    // checking that our pathname is equal to main page and we can run our next code
    if (matchPath(action.payload.location.pathname, getRouteConfig(MAIN_ROUTE))) {
      // select something from our state with "select" effect from redux-saga
      const state = yield select(selectPeople);
      const { page, search } = state;

      // put will dispatch an action (like dispatch itself in usual components)
      yield put({
        type: LOAD_USERS,
        payload: {
          page, search
        }
      });
    }

    const detailsPage = matchPath(action.payload.location.pathname, getRouteConfig(PEOPLE_DETAILS_ROUTE));

    if (detailsPage) {
      const { id } = detailsPage.params;

      if (id) {
        yield put({
        type: LOAD_USER_DETAILS,
        payload: {
          id, 
        }
      });
      }
    }
  }
}

// watcher saga means Saga that watches an action (here LOAD_USERS action)
// on each matching action, it starts a function as its task (here loadPeopleList function, it is worker saga).
export default function* peopleSaga() {
  yield fork(routeChangeSaga);
  yield takeEvery(LOAD_USERS, loadPeopleList);
  yield takeEvery(LOAD_USER_DETAILS, loadPeopleDetails)
}