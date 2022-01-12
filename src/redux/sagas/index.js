import { spawn, call, all, take, fork, cancel, actionChannel } from 'redux-saga/effects';
import peopleSaga from './people';

export default function* rootSaga() {
  const sagas = [peopleSaga];

  // call our all sagas with "all" effect and use "spawn" effect to create a distributed task
  // so we launch sagas in a distributed manner using spawn and wait for them to start using the all effect
  yield all(sagas.map(s => spawn(s)));
}