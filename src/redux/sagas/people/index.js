import { call, takeEvery, put, apply, take, select, fork } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';
import { LOAD_USERS, LOAD_USERS_SUCCESS } from '../../reducers/people/actions';
import { selectPeople } from '../../reducers/people/selectors';

export function* loadPeopleDetails() {

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

// worker saga
export function* loadUsersOnRouteEnter() {
  while (true) {
    // take our action with "take" effect from redux-saga
    const action = yield take(LOCATION_CHANGE)

    // checking that our pathname is equal to main page and we can run our next code
    if (action.payload.location.pathname === '/') {
      // select something from our state with "select" effect from redux-saga
      const state = yield select(selectPeople);
      const { page, search } = state;

      // put will dispatch an action (like dispatch itself in usual components)
      yield put({
        type: LOAD_USERS,
        payload: {
          page, search
        }
      })
    }
  }
}

// watcher saga means Saga that watches an action (here LOAD_USERS action)
// on each matching action, it starts a function as its task (here loadPeopleList function, it is worker saga).
export default function* peopleSaga() {
  yield fork(loadUsersOnRouteEnter);
  yield takeEvery(LOAD_USERS, loadPeopleList);
}