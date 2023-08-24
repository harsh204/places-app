import styles from "./Input.module.css";
import { useEffect, useReducer } from "react";
import { validate } from "../../Util/validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };

    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default: {
      return state;
    }
  }
};

const Input = (props) => {
  const [inputState, dispatchFunction] = useReducer(inputReducer, {
    value: props.value || "",
    isValid: props.valid || false,
    isTouched: false,
  });

  const inputChangeHandler = (event) => {
    dispatchFunction({
      type: "CHANGE",
      value: event.target.value,
      validators: props.validators,
    });
  };

  const inputTouchHandler = () => {
    dispatchFunction({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        type={props.type}
        placeholder={props.placeholder}
        id={props.id}
        onChange={inputChangeHandler}
        onBlur={inputTouchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        rows={props.rows || 3}
        id={props.id}
        onChange={inputChangeHandler}
        onBlur={inputTouchHandler}
        value={inputState.value}
      />
    );

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  return (
    <div
      className={`${styles["form-control"]} ${
        !inputState.isValid &&
        inputState.isTouched &&
        styles["form-control--invalid"]
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
