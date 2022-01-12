import { LOAD_USERS, LOAD_USERS_FAILURE, LOAD_USERS_SUCCESS } from "./actions";

const initialState = {
  page: 1,
  search: '',
  loading: false,
  error: null,
  data: null,
  // data: {
  //   total: 0,
  //   results: 0,
  // }
}

export default function peopleReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USERS: {
      const { page, search } = action.payload;

      return {
        ...state,
        loading: true,
        page,
        search,
      };
    }
      
    case LOAD_USERS_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    }
      
    case LOAD_USERS_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
      
    default:
      return state;
  }
}