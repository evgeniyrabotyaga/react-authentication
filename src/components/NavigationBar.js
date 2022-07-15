import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../store/auth-context";

const NavigationBar = () => {
  const authContext = useContext(AuthContext);

  const logoutHandler = () => {
    authContext.logout();
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <Link to="/">
          <h2>ReactAuth</h2>
        </Link>
        <ul>
          {authContext.isLoggedIn && (
            <li>
              <NavLink
                className={(data) =>
                  data.isActive ? "active-link" : undefined
                }
                to="/profile"
              >
                Profile
              </NavLink>
            </li>
          )}
          {!authContext.isLoggedIn && (
            <li>
              <NavLink
                className={(data) =>
                  data.isActive ? "active-link" : undefined
                }
                to="/auth"
              >
                Login
              </NavLink>
            </li>
          )}
          {authContext.isLoggedIn && (
            <li>
              <button onClick={logoutHandler} type="button">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
