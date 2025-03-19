import { configureStore } from "@reduxjs/toolkit";

// Example reducer (replace with your own)
const initialState = { value: 0 };

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "increment":
      return { ...state, value: state.value + 1 };
    case "decrement":
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: counterReducer,
});

export const increment = () => ({ type: "increment" });
export const decrement = () => ({ type: "decrement" });
