import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./store";

function Counter() {
  const count = useSelector((state) => state.value);
  const dispatch = useDispatch();

  return (
    <div className="p-4">
      <h1 className="text-2xl">Count: {count}</h1>
      <button
        onClick={() => dispatch(increment())}
        className="m-2 p-2 bg-blue-500 text-white rounded"
      >
        Increment
      </button>
      <button
        onClick={() => dispatch(decrement())}
        className="m-2 p-2 bg-red-500 text-white rounded"
      >
        Decrement
      </button>
    </div>
  );
}

export default Counter;
