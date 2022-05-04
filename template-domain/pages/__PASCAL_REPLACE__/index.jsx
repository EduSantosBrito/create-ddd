import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Button from "../../components/Button";
import { setCounter } from "../../ducks/__LOWER_REPLACE__";

const __PASCAL_REPLACE__ = () => {
    const dispatch = useDispatch();
    const counter = useSelector((store) => store.__LOWER_REPLACE__.counter);
    const [stateCounter, setStateCounter] = useState(counter);

    return (
        <div>
            <h1>__PASCAL_REPLACE__</h1>
            <h2>State counter - {stateCounter}</h2>
            <h2>Redux counter - {counter}</h2>
            <Button onClick={() => setStateCounter(actualValue => actualValue + 1)}>ADD +</Button>
            <Button onClick={() => dispatch(setCounter(stateCounter))}>Push to redux</Button>
        </div>
    );
};

export default __PASCAL_REPLACE__;
