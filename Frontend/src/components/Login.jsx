import { useContext, useRef, useState } from "react";
import styles from "./Login.module.css";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../store/GlobalStore";
import Popup from "./Popup";

const SignUp = () => {
  const { login, setLogin } = useContext(GlobalContext);
  const user_id_ref = useRef(null);
  const user_password_ref = useRef(null);
  const user_role_ref = useRef(null); // Always define the ref
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newTheaterManager, setNewTheaterManager] = useState(false); // Flag to check if a new account was created by a Theater Manager
  const navigate = useNavigate();

  const handleCloseClick = () => {
    setLogin("");
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleFormSubmitClick = (e) => {
    e.preventDefault();
    const user_id_val = user_id_ref.current.value;
    const user_password_val = user_password_ref.current.value;
    const user_role = login !== "sign_in" ? user_role_ref.current.value : "";

    user_id_ref.current.value = "";
    user_password_ref.current.value = "";
    if (login !== "sign_in") user_role_ref.current.value = "";

    if (login === "sign_in") {
      handleLoginClick({ user_id_val, user_role, user_password_val });
    } else {
      handleCreateAccountClick({ user_id_val, user_role, user_password_val });
    }
  };

  const handleCreateAccountClick = async (data) => {
    try {
      const result = await axios.post(
        "http://localhost:8000/create_account",
        data
      );

      if (data.user_role === "Theater Manager") {
        setNewTheaterManager(true);
      }
      setLogin("sign_in");
    } catch (error) {
      setPopupMessage(error.response.data.message);
      setShowPopup(true);
    }
  };

  const handleLoginClick = async (data) => {
    try {
      const result = await axios.post("http://localhost:8000/sign_in", data);
      setPopupMessage(result.data.message);
      setShowPopup(true);
      sessionStorage.setItem("user", result.data.id);
      sessionStorage.setItem("role", result.data.role);

      setLogin("login_success");

      if (newTheaterManager && result.data.role === "Theater Manager") {
        navigate("/theater_details");
      } else {
        navigate("/");
      }
    } catch (error) {
      setPopupMessage("An error occurred while signing in.");
      setShowPopup(true);
    }
  };

  return (
    <form className={styles.sign_up_container} onSubmit={handleFormSubmitClick}>
      {showPopup && (
        <Popup 
          popup_message={popupMessage} 
          messageBtn={"Ok"} 
          onClose={closePopup} 
        />
      )}
      <div className={styles.closeButton_container} onClick={handleCloseClick}>
        <IoCloseSharp className={styles.closeButton} />
      </div>

      <div className={styles.sign_up_box}>
        <div className={styles.sign_up_logo}>
          {login === "sign_in" ? "Sign In" : "Sign Up"}
        </div>
        {login !== "sign_in" && (
          <div className={styles.user_role}>
            <label htmlFor="user_role">Role</label>
            <select
              className={styles.input_cont}
              name="user_role"
              ref={user_role_ref}
              style={{ float: "left" }}
              required
            >
              <option>Admin</option>
              <option>User</option>
              <option>Theater Manager</option>
            </select>
          </div>
        )}
        <div className={styles.user_id}>
          <label htmlFor="user_id">Username</label>
          <input
            className={styles.input_cont}
            type="email"
            name="user_id"
            ref={user_id_ref}
            required
          />
        </div>
        <div className={styles.user_password}>
          <label htmlFor="user_password">Password</label>
          <input
            className={styles.input_cont}
            type="password"
            name="user_password"
            ref={user_password_ref}
            required
          />
        </div>
        <div className={styles.create_account}>
          <button className={styles.authenticate} type="submit">
            {login === "sign_in" ? "Sign In" : "Sign Up"}
          </button>
        </div>
        <div>
          {login === "sign_in" ? (
            <div>
              Don't have an account?{" "}
              <span
                onClick={() => setLogin("sign_up")}
                style={{ cursor: "pointer", color: "blue" }}
              >
                Click Here
              </span>
            </div>
          ) : (
            <div>
              Already have an account?{" "}
              <span
                onClick={() => setLogin("sign_in")}
                style={{ cursor: "pointer", color: "blue" }}
              >
                Sign In
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default SignUp;
