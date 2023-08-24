import Input from "../../Shared/Components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/Util/validators";
import styles from "./Authenticate.module.css";
import useForm from "../../Shared/Hooks/form-hook";
import Card from "../../Shared/Components/UIElements/Card";
import Button from "../../Shared/Components/FormElements/Button";
import { useState, useContext } from "react";
import AuthContext from "../../Shared/Context/auth-context";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import useHttp from "../../Shared/Hooks/http-hook";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";

const Authenticate = () => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const [authState, inputChangeHandler, setAuthData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const changeModeHandler = () => {
    if (!isLogin) {
      setAuthData(
        { ...authState.inputs, username: undefined, image: undefined },
        authState.inputs.email.isValid && authState.inputs.password.isValid
      );
    } else {
      setAuthData(
        {
          ...authState.inputs,
          username: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogin((prevState) => !prevState);
  };

  const authenticationSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLogin) {
      try {
        const data = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          {
            "Content-Type": "application/json",
          },
          JSON.stringify({
            email: authState.inputs.email.value,
            password: authState.inputs.password.value,
          })
        );
        login(data.userId, data.token);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("email", authState.inputs.email.value);
        formData.append("name", authState.inputs.username.value);
        formData.append("password", authState.inputs.password.value);
        formData.append("image", authState.inputs.image.value);

        const data = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          {},
          formData
        );
        login(data.userId, data.token);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className={styles.authentication}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLogin ? "Login Required" : "SignUp"}</h2>
        <hr />
        <form
          className={styles["user-form"]}
          onSubmit={authenticationSubmitHandler}
        >
          {!isLogin && (
            <Input
              id="username"
              label="Username"
              element="input"
              onInput={inputChangeHandler}
              type="text"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid user name!"
            />
          )}
          {!isLogin && (
            <ImageUpload
              id="image"
              center
              onInput={inputChangeHandler}
              errorText="Please Provide an Image"
            />
          )}
          <Input
            id="email"
            label="E-mail"
            element="input"
            onInput={inputChangeHandler}
            type="email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address!"
          />
          <Input
            id="password"
            label="Password"
            element="input"
            onInput={inputChangeHandler}
            type="password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter a valid password (at least 8 characters long)!"
          />
          <Button disabled={!authState.isValid} type="submit">
            {isLogin ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={changeModeHandler}>
          SWITCH TO {isLogin ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Authenticate;
