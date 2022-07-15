import { useContext } from "react";
import { AuthContext } from "../store/auth-context";

const WelcomePage = () => {
  const catImage = require("../assets/cat.jpg");
  const authContext = useContext(AuthContext);
  return (
    <section className="welcome centered">
      <h1>
        {authContext.isLoggedIn
          ? "Welcome on Board!"
          : "Need to authenticate to access this page."}
      </h1>
      {authContext.isLoggedIn && (
        <div className="welcome__image-container">
          <img alt="welcome" src={catImage}></img>
        </div>
      )}
    </section>
  );
};

export default WelcomePage;
