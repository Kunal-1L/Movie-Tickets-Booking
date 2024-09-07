import { useRef, useState } from "react";
import styles from "./Theater.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Help from "./Help";

const Admin = () => {
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [producers, setProducers] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [casts, setCasts] = useState([{ name: "", role: "" }]);
  const navigate = useNavigate();

  // Common add row handler
  const handleAddRow = (setFunction, currentArray) => {
    setFunction([...currentArray, ""]);
  };

  // Common remove row handler
  const handleRemove = (setFunction, currentArray, index) => {
    const updatedArray = [...currentArray];
    updatedArray.splice(index, 1);
    setFunction(updatedArray);
  };

  // Common change handler
  const handleChange = (setFunction, currentArray, index, value) => {
    const updatedArray = [...currentArray];
    updatedArray[index] = value;
    setFunction(updatedArray);
  };

  const movieTitleRef = useRef(null);
  const movieDescriptionRef = useRef(null);
  const movieReleaseDateRef = useRef(null);
  const movieDurationRef = useRef(null);
  const moviePosterURLRef = useRef(null);
  const movieTrailerURLRef = useRef(null);
  const movieProductionCompanyRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movieInfo = {
      movieTitle: movieTitleRef.current.value,
      movieDescription: movieDescriptionRef.current.value,
      movieReleaseDate: movieReleaseDateRef.current.value,
      movieDuration: movieDurationRef.current.value,
      moviePoster: moviePosterURLRef.current.value,
      movieTrailer: movieTrailerURLRef.current.value,
      movieProductionCompany: movieProductionCompanyRef.current.value,
      genres,
      directors,
      producers,
      languages,
      casts
    };

    console.log(movieInfo);

    try {
      const response = await axios.post(
        "https://movie-booking-kkjw.onrender.com/add_movie_details",
        movieInfo
      );

      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error while adding movie details. Please try again.");
    }
  };

  return (
    <div className={styles.theater_container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.form_section}>
          <label htmlFor="movieTitle">Title:</label>
          <input ref={movieTitleRef} type="text" name="movieTitle" required />

          <label htmlFor="movieDescription">Description:</label>
          <input
            type="text"
            name="movieDescription"
            ref={movieDescriptionRef}
            required
          />

          <label htmlFor="movieReleaseDate">Release Date:</label>
          <input
            ref={movieReleaseDateRef}
            type="date"
            name="movieReleaseDate"
            required
          />

          <label htmlFor="movieDuration">Duration:</label>
          <input
            type="number"
            name="movieDuration"
            ref={movieDurationRef}
            required
            placeholder='in minutes'
          />
        </div>

        <label htmlFor="moviePoster">Poster URL:</label>
        <input
          ref={moviePosterURLRef}
          type="text"
          name="moviePoster"
          required
        />

        <label htmlFor="movieTrailer">Trailer URL:</label>
        <input
          type="text"
          name="movieTrailer"
          ref={movieTrailerURLRef}
          required
        />

        <label htmlFor="movieProductionCompany">Production Company:</label>
        <input
          ref={movieProductionCompanyRef}
          type="text"
          name="movieProductionCompany"
          required
        />

        <Help
          inputArr={genres}
          value="Genres"
          handleChange={(arr, index, val) =>
            handleChange(setGenres, genres, index, val)
          }
          handleRemove={(arr, index) => handleRemove(setGenres, genres, index)}
          handleAddRow={() => handleAddRow(setGenres, genres)}
        />

        <Help
          inputArr={directors}
          value="Directors"
          handleChange={(arr, index, val) =>
            handleChange(setDirectors, directors, index, val)
          }
          handleRemove={(arr, index) =>
            handleRemove(setDirectors, directors, index)
          }
          handleAddRow={() => handleAddRow(setDirectors, directors)}
        />

        <Help
          inputArr={producers}
          value="Producers"
          handleChange={(arr, index, val) =>
            handleChange(setProducers, producers, index, val)
          }
          handleRemove={(arr, index) =>
            handleRemove(setProducers, producers, index)
          }
          handleAddRow={() => handleAddRow(setProducers, producers)}
        />

        <Help
          inputArr={languages}
          value="Languages"
          handleChange={(arr, index, val) =>
            handleChange(setLanguages, languages, index, val)
          }
          handleRemove={(arr, index) =>
            handleRemove(setLanguages, languages, index)
          }
          handleAddRow={() => handleAddRow(setLanguages, languages)}
        />

        <Help
          inputArr={casts}
          value="Casts"
          handleChange={(arr, index, val) =>
            handleChange(setCasts, casts, index, val)
          }
          handleRemove={(arr, index) => handleRemove(setCasts, casts, index)}
          handleAddRow={() =>
            handleAddRow(setCasts, [...casts, { name: "", role: "" }])
          }
        />

        <div className={styles.theater_button}>
          <button type="submit">Register Movie</button>
        </div>
      </form>
    </div>
  );
};

export default Admin;
