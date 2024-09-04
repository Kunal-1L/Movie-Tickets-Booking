import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Theater from "./components/Theater";
import BookShow from './components/BookShow';
import Footer from './components/Footer';
import About from './components/About'
import MoviesGallery from "./components/MoviesGallery";
function App() {
  const navRef = useRef(null);
  const [heroTop, setHeroTop] = useState(0);
  const updatePosition = () => {
    if (navRef.current) {
      setHeroTop(navRef.current.getBoundingClientRect().height);
    }
  };

  useEffect(() => {
    updatePosition(); 

    window.addEventListener('resize', () => updatePosition);

    return removeEventListener('resize', updatePosition);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Navbar navRef={navRef} updatePosition={() => setTimeout(updatePosition, 0)}  />
      <div
        className="hero_container"
        style={{ position: "relative", top: heroTop }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:movieId" element={<MovieDetails />}></Route>
          <Route path="/theater_details" element={<Theater />}></Route>
          <Route path="/movies_gallery" element={<MoviesGallery />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/book_show/:movieId" element={<BookShow />}></Route>
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
