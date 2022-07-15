import { useContext, useState } from "react";
import useInput from "../hooks/use-input";
import { AuthContext } from "../store/auth-context";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

export const API_KEY = "AIzaSyAi5Mq5x3fE1bMw8qFbXhfCmCdRwmKor3w";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  let formIsValid = false;

  const {
    enteredValue: emailValue,
    hasError: emailHasError,
    valueIsValid: emailIsValid,
    inputBlurHandler: emailBlurHandler,
    inputChangeHandler: emailChangeHandler,
    reset: resetEmail,
  } = useInput((email) =>
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  );

  const {
    enteredValue: passwordValue,
    hasError: passwordHasError,
    valueIsValid: passwordIsValid,
    inputBlurHandler: passwordBlurHandler,
    inputChangeHandler: passwordChangeHandler,
    reset: resetPassword,
  } = useInput((password) => password.trim().length > 6);

  const switchFormHandler = () => {
    resetPassword();
    resetEmail();
    setError(null);
    setIsLogin((prevState) => !prevState);
  };

  if (isLogin && emailIsValid && passwordValue.trim().length > 0)
    formIsValid = true;
  if (!isLogin && emailIsValid && passwordIsValid) formIsValid = true;

  let url;
  if (isLogin) {
    url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  } else {
    url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  }

  const fetchHandler = async (url, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
        headers: { "Content-type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = "Authentication failed!";
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const timeLeft = new Date(new Date().getTime() + +data.expiresIn * 1000);

      authContext.login(data.idToken, timeLeft.toISOString());
      navigate("/", { replace: true });
    } catch (error) {
      if (
        error.message === "EMAIL_NOT_FOUND" ||
        error.message === "INVALID_PASSWORD"
      ) {
        setError("Invalid email address or password.");
      } else if (error.message === "EMAIL_EXISTS") {
        setError("This email address is already being used.");
      } else if (error.message.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
        setError(
          "Access to this account has been temporarily disabled due to many failed login attempts."
        );
      } else {
        setError(error.message);
      }
    }
    setIsLoading(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    fetchHandler(url, emailValue, passwordValue);
  };

  const inputClass = {
    email: emailHasError ? "invalid" : "",
    password: !isLogin && passwordHasError ? "invalid" : "",
  };

  return (
    <section className="centered login">
      <form onSubmit={submitHandler}>
        <h3>{isLogin ? "Login" : "Sign Up"}</h3>
        <div className="login__input">
          <label htmlFor="your-email">Your Email</label>
          <input
            className={inputClass.email}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            value={emailValue}
            type="email"
            id="your-email"
          ></input>
          {emailHasError && (
            <p className="error-message ">Email input is invalid.</p>
          )}
        </div>
        <div className="login__input">
          <label htmlFor="your-password">Your Password</label>
          <input
            className={inputClass.password}
            onBlur={passwordBlurHandler}
            onChange={passwordChangeHandler}
            value={passwordValue}
            type="password"
            id="your-password"
          ></input>
          {!isLogin && passwordHasError && (
            <p className="error-message">
              Password must be at least 7 characters long.
            </p>
          )}
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <button
            disabled={!formIsValid}
            className="login__submit"
            type="submit"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        )}
        {error && <p className="error-message align-center">{error}</p>}
        {isLoading ? null : (
          <button
            className="login__change"
            onClick={switchFormHandler}
            type="button"
          >
            {isLogin ? "Create New Account" : "Login with Existing Account"}
          </button>
        )}
      </form>
    </section>
  );
};

export default LoginPage;
