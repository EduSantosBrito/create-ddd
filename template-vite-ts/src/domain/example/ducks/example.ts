// TYPES
const SET_COUNTER = "example/SET_COUNTER";

export type State = {
    counter: number;
};

type Action = {
    type: string;
    payload: Partial<State>;
};

// INITIAL STATE
const initialState = {
    counter: 1,
};

// REDUCER
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case SET_COUNTER:
            return { ...state, counter: action.payload.counter };
        default:
            return state;
    }
};

export default reducer;

// ACTION
export const setCounter = (counter: number) => {
    return {
        type: SET_COUNTER,
        payload: {
            counter,
        },
    };
};
