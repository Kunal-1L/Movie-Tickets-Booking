import Banner from './Banner'
import styles from './Home.module.css'
import LatestMovies from './LatestMovies'
import { useContext } from 'react'
import Login from './Login';
import { GlobalContext } from '../store/GlobalStore'
const Home = () => {
    const {login} = useContext(GlobalContext);
    console.log(login);
    return (
        < div className={styles.home_container}>
            <Banner />
            <h1 className={styles.latest_movies}>Latest Movies</h1>
            <LatestMovies />
            <div className={styles.child_banner_container}>
                <div className={styles.banner_icon}><img src='../../public/cinebook-high-resolution-logo-transparent (4).png'></img></div>
                <div className={styles.banner_tag}>Endless Entertainment Anytime , Anywhere</div>
            </div>

            {(login === 'sign_in' || login === 'sign_up') && <Login />}
        </ div>
    )
}

export default Home;