import styles from "./Movie.module.css";
import { useNavigate } from "react-router-dom";
const Movie = ({ movie }) => {
  const navigate = useNavigate();
  const handleMovie = () => {
    navigate(`/movie/${movie._id}`);
  };
  return (
    <div onClick={handleMovie} className={styles.movie_container}>
      <div className={styles.movie_title}>{movie.title}</div>

      <div className={styles.movie_poster}>
        <img src={movie.poster_url}></img>
      </div>
      <div className={styles.movie_rating}>{movie.rating}</div>
    </div>
  );
};

export default Movie;
