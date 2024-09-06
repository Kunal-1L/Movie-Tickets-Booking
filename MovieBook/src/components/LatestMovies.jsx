import styles from "./LatestMovies.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Movie from "./Movie";
const LatestMovies = () => {

    const [latestMovies, setLatestMovies] = useState([]);
  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        const result = await axios.get("/movies", {
          params: {
            limit: 4,
            skip: 0,
          },
        });
        setLatestMovies(result.data.latestMovies); 
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchLatestMovies();
  }, []);

  return <div className={styles.latest_movies_container}>
    {latestMovies.map((movie, index) => 
        <Movie key = {index} movie={movie}></Movie>
    )}
  </div>
};
export default LatestMovies;
