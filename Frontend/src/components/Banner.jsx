import { useEffect, useState } from "react";
import styles from "./Banner.module.css";

const images = [
  "/3d-glasses-with-popcorns-clapperboard-concrete-backdrop.jpg",
  "/8204905.jpg",
  "/movie-background-collage.jpg"
];


const Banner = () => {

  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((current + 1) % 3); // Cycle through the images
    }, 6000);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className={styles.banner_container}>
      {images.map((src, index) => (
        current === index && 
        <div key={index} className={styles.banner}>
          <img src={src} alt={`banner-${index}`} />
        </div>
      ))}
    </div>
  );
};

export default Banner;
