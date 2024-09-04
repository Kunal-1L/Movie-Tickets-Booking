import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about_container}>
      Welcome to CineBook, your ultimate destination for a seamless movie
      booking experience. Whether you're a movie buff, a casual viewer, or
      planning a special night out, CineBook is here to make the process of
      reserving your seats as smooth as possible.
      <div>Reserve</div>
      CineBook allows you to easily browse through a wide selection of movies,
      showtimes, and cinemas in your area. With just a few clicks, you can
      reserve your tickets for the latest blockbusters or timeless classics. Our
      user-friendly interface ensures that finding the perfect movie at the
      perfect time is hassle-free.
      <div>Relax </div>Forget about standing in long queues or worrying about
      sold-out shows. CineBook lets you book your tickets in advance, so all you
      have to do is arrive at the cinema, relax, and enjoy the show. We’ve also
      partnered with multiple cinemas to offer exclusive deals and discounts,
      making your movie-going experience even more enjoyable.
      <div> Watch</div> With your tickets securely booked through CineBook, all
      that’s left to do is sit back and watch the magic unfold on the big
      screen. Whether you prefer IMAX, 3D, or a cozy indie theatre, we’ve got
      you covered. At CineBook, we believe that watching a movie should be an
      effortless and delightful experience from start to finish.
    </div>
  );
};

export default About;
