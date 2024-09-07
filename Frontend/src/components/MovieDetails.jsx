import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import styles from "./MovieDetails.module.css";
import { GlobalContext } from "../store/GlobalStore";
import ShowTime from "./ShowTime";
import Loading from "./Loading";

const MovieDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const { showForm, setShowForm, bookingAvailable, setBooking } =
    useContext(GlobalContext);
  const role = sessionStorage.getItem("role");


  useEffect(() => {
    setShowForm(false);
  }, [setShowForm]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const result = await axios.get("https://movie-booking-kkjw.onrender.com/movie_details", {
          params: { movieId, flag: 0 },
        });
        setMovieDetails(result.data.movieDetails);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    const checkAvailability = async () => {
      try {
        const userId = sessionStorage.getItem('user');
        const result = await axios.get("https://movie-booking-kkjw.onrender.com/check_movie", {
          params: {userId,  movieId },
        });
        console.log(result);
        setBooking(result.data.message);
      } catch (error) {
        console.error("Error checking movie availability:", error);
      }
    };

    fetchMovieDetails();
    if(role === 'Theater Manager')
      checkAvailability();
  }, [movieId, setBooking]);

  if (loading) {
    return (
      <div className={styles.movie_details_container}>
        <Loading />
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className={styles.movie_details_container}>
        <p>Movie details could not be loaded.</p>
      </div>
    );
  }

  const durationHours = Math.floor(movieDetails.duration / 60);
  const durationMinutes = movieDetails.duration % 60;
  
  const handleAddShow = () => {
    const user = sessionStorage.getItem("user");
    if(user)
      setShowForm(true);
    else{
      alert('Please Sign In first...');
      navigate('/');
    }
  };

  const handleBookShow = () => {
    const user = sessionStorage.getItem("user");

    if(user)
      navigate(`/book_show/${movieId}`);
    else{
      alert('Please Sign In first...');
      navigate('/');
    }
  };

  return (
    <div>
      <div className={styles.movie_details_container}>
        <h1>{movieDetails.title}</h1>
        {role === "Theater Manager" ? (
          bookingAvailable ? (
            <button
              className={styles.btn}
              onClick={() => alert("This movie shows already added")}
            >
              Already Added
            </button>
          ) : (
            <button className={styles.btn} onClick={handleAddShow}>
              Add Shows
            </button>
          )
        ) : (
          <button className={styles.btn} onClick={handleBookShow}>
            Book Show
          </button>
        )}
        <div>
          <img src={movieDetails.poster_url} alt={movieDetails.title} />
        </div>
        <p>{movieDetails.description}</p>
        <div className={styles.genre_container}>
          {movieDetails.genre.map((gen, index) => (
            <span key={index} className={styles.genre_item}>
              {gen}
            </span>
          ))}
        </div>
        <div>
          Release on: {new Date(movieDetails.release_date).toLocaleDateString()}
        </div>
        <div>
          Duration: {durationHours} hr : {durationMinutes} min
        </div>
        <div>Language: {movieDetails.language}</div>
        <div>
          <h2>Trailer</h2>
          <iframe
            src={movieDetails.trailer_url}
            title="Trailer"
            allowFullScreen
            style={{ width: "100%", height: "315px", border: "none" }}
          ></iframe>
        </div>
        <div>
          <h2>Cast</h2>
          {movieDetails.cast.map((cst, index) => (
            <div key={index}>
              {cst.name}, {cst.role}
            </div>
          ))}
        </div>
        <div>
          <h2>Director</h2>
          {movieDetails.director.map((drctr, index) => (
            <div key={index}>{drctr}</div>
          ))}
        </div>
        <div>
          <h2>Producer</h2>
          {movieDetails.producer.map((prdcr, index) => (
            <div key={index}>{prdcr}</div>
          ))}
        </div>
        <div>Production Company: {movieDetails.production_company}</div>
      </div>
      {showForm && <ShowTime movieId={movieId} />}
    </div>
  );
};

export default MovieDetails;
