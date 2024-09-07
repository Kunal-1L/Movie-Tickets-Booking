import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useUpdateQuery } from "./customHooks/useQueryParam";
import Movie from "./Movie";
import { useNavigate, useParams } from "react-router-dom";
import styles1 from "./MoviesGallery.module.css";
import Banner from "./Banner";
const MoviesGallery = () => {
  const query = useQuery();
  const updateQuery = useUpdateQuery();
  const [movies, setMovies] = useState([]);
  const skip = parseInt(query.get("skip")) || 0;
  const limit = parseInt(query.get("limit")) || 10;
  const navigate = useNavigate();
  const { search } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("https://movie-booking-kkjw.onrender.com/movies", {
          params: {
            skip,
            limit,
            search,
          },
        });
        console.log(result);
        setMovies(result.data.latestMovies);
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    };

    fetchData();
  }, [skip, limit, search]); 

  const handleNextClick = () => {
    if (movies.length >= limit) updateQuery({ skip: skip + limit, limit });
    else updateQuery({ skip: 0, limit });
  };

  const handlePrevClick = () => {
    if (skip - limit >= 0) {
      updateQuery({ skip: skip - limit, limit });
    } else navigate("/");
  };

  return (
    <div className={styles1.gallery_container}>
      <Banner />
      <h1 className={styles1.movies_gallery}>Movies Gallery</h1>
      <div className={styles1.gallery}>
       
          {movies.map((movie, index) => (
            <Movie key={index} movie={movie} />
          ))}
        </div>
      <div className={styles1.btn_cont}>
        {skip !== 0 && (
          <button onClick={handlePrevClick} className={styles1.prev_btn}>
            Previous Page
          </button>
        )}
        {movies.length >= limit && (
          <button onClick={handleNextClick} className={styles1.next_btn}>
            Next Page
          </button>
        )}
      </div>
    </div>
  );
};

export default MoviesGallery;
