import React, { useState } from "react";
import "./count.css";
import { useDispatch, useSelector } from "react-redux";
import {increment, decrement, incrementByAmount } from "../../redux/counter"

const ReduxCount = () => {

    // const [count, setCount] = useState(0);

    const { count } = useSelector((state) => state.counter) //select a state
    const dispatch = useDispatch() // select an action

    return (
        <div className="counter-container">
            <h1 className="counter-title">The count is: {count}</h1>
            <div className="button-group">
                <button className="counter-button increment" onClick={() => dispatch(increment())}>
                    Increment
                </button>
                <button className="counter-button decrement" onClick={() => dispatch(decrement())}>
                    Decrement
                </button>
                <button className="counter-button decrement" onClick={() => dispatch(incrementByAmount(20))}>
                    Increment By 20
                </button>
            </div>
        </div>
    )
}

export default ReduxCount
