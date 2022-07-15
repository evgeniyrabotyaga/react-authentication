import { useContext, useState } from "react";
import { AuthContext } from "../store/auth-context";
import { Navigate } from "react-router-dom";
import useInput from "../hooks/use-input";
import { API_KEY } from "./LoginPage";

const ProfilePage = () => {
  const authContext = useContext(AuthContext);
  const [isChanged, setIsChanged] = useState(false);
  const [error, setError] = useState(null);

  const {
    enteredValue: passwordValue,
    hasError: passwordHasError,
    inputBlurHandler: passwordBlurHandler,
    inputChangeHandler: passwordChangeHandler,
    valueIsValid,
    reset: resetPassword,
  } = useInput((password) => password.trim().length > 6);

  let formIsValid = false;

  if (valueIsValid) formIsValid = true;

  const fetchHandler = async () => {
    setError(null);
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            idToken: authContext.token,
            password: passwordValue,
            returnSecureToken: false,
          }),
          headers: { "Content-type": "application/json" },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        let errorMessage = "Authentication failed!";
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      setIsChanged(false);
      return;
    }
    fetchHandler();
    setIsChanged(true);
    resetPassword();
  };

  const inputClass = passwordHasError ? "invalid" : "";

  return authContext.isLoggedIn ? (
    <section className="centered profile">
      <h1>Your User Profile</h1>
      <form onSubmit={formSubmitHandler}>
        <label htmlFor="new-password">New Password</label>
        <input
          className={inputClass}
          value={passwordValue}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          id="new-password"
          type="password"
        ></input>
        {passwordHasError && (
          <p className="error-message">
            Password must be at least 7 characters long.
          </p>
        )}
        {!error && isChanged && (
          <p className="success-message">Password Updated!</p>
        )}
        <button type="submit">Change Password</button>
        {error && <p className="error-message align-center">{error}</p>}
      </form>
    </section>
  ) : (
    <Navigate to="/auth" />
  );
};

export default ProfilePage;
