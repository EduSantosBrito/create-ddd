// TYPES
const SET_COUNTER = "example/SET_COUNTER";

// INITIAL STATE
const initialState = {
  counter: 1,
};

// REDUCER
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTER:
      return { ...state, counter: action.payload.counter };
    default:
      return state;
  }
};

export default reducer;

// ACTION
export const setCounter = (counter) => {
  return {
    type: SET_COUNTER,
    payload: {
      counter,
    },
  };
};
