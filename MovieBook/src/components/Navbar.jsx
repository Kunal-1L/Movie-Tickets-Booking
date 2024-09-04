import { IoSearch, IoMenu } from "react-icons/io5"; // Import IoMenu for hamburger icon
import styles from "./Navbar.module.css";
import { useContext, useState } from "react";
import { GlobalContext } from "../store/GlobalStore";
import { IoCloseSharp } from "react-icons/io5";
import {useNavigate} from 'react-router-dom'
const Navbar = ({navRef, updatePosition}) => {
  const { login, setLogin } = useContext(GlobalContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = sessionStorage.getItem('user');
  const handleSearchSubmit = () => {};
  const navigate = useNavigate();
  const handleLogin = (status) => {
    navigate('/')
    setMenuOpen(false);
    setLogin(status);
    updatePosition();
  };

  const handleLogout = () =>  {
    sessionStorage.clear();
    navigate('/');
    setMenuOpen(false);
    updatePosition();
  }
  const toggleMenu = () => {

    setMenuOpen(!menuOpen); 
    setLogin('');
    updatePosition();
  };

  return (
    <div className={styles.nav_container} ref={navRef}>
      <div className={`${styles.app_logo}`}>
        <img
          src=".././public/cinebook-high-resolution-logo-transparent (2).png"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.hamburger_icon} onClick={toggleMenu}>
        {menuOpen ? <IoCloseSharp />: <IoMenu /> }
      </div>
      <div
        className={`${styles.inner_nav_container} ${
          menuOpen ? styles.show : styles.hide
        }`}
      >
        <div className={`${styles.home_tag} ${styles.common_nav}`} onClick={() => navigate('/')}>Home</div>
        <div className={`${styles.movies_tag} ${styles.common_nav}`} onClick={() => navigate('/movies_gallery')}> 
          Movies
        </div>
        <div className={`${styles.about_tag} ${styles.common_nav}`} onClick={() => navigate('/about')}>About</div>

        <div className={`${styles.search_container}`}>
          <div className={styles.search_icon}>
            <IoSearch />
          </div>
          <form className={styles.search_input_div}>
            <input
              type="text"
              name="movie-name"
              placeholder="Search your movies here"
            ></input>
          </form>
        </div>
      </div>

      {!user ?
      <div
        className={`${styles.authentication_container} ${
          menuOpen ? styles.show : styles.hide
        }`}
      >
        <div className={styles.sign_in} onClick={() => handleLogin("sign_in")}>
          Sign In
        </div>
        <div className={styles.sign_up} onClick={() => handleLogin("sign_up")}>
          Sign Up
        </div>
      </div> : <div
        className={`${styles.profile_container} ${
          menuOpen ? styles.show : styles.hide
        }`}
      >
        <div className={styles.profile} >
          Profile
        </div>
        <div className={styles.drop_up_list} >
          <div className={styles.item1}>{user}</div>
          <div className={styles.item2} onClick={handleLogout}>Log Out</div>
        </div>
      </div>}
    </div>
  );
};

export default Navbar;
