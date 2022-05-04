import example, { State as ExampleState } from "./example";

export type RootState = {
    example: ExampleState;
};

export const reducers = { example };
