import { useState } from "react";

const useInput = (verificationFunc) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = verificationFunc(enteredValue);
  const hasError = isTouched && !valueIsValid;

  const inputChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    enteredValue,
    hasError,
    valueIsValid,
    inputBlurHandler,
    inputChangeHandler,
    reset,
  };
};

export default useInput;
