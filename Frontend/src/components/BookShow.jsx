import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./BookShow.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
const BookShow = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [theaterList, setTheaterList] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null);
  const [theater, setTheater] = useState(-1);
  const [seatSelectCnt, setSeatSelectCnt] = useState(0);
  const [datesTimes, setDatesTimes] = useState([]);
  const [seats, setSeats] = useState([]);
  const [bill, setBill] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const [bookedTickets, setBookedTickets] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [theaterResponse, movieResponse] = await Promise.all([
          axios.get("https://movie-booking-kkjw.onrender.com/check_theater", {
            params: { movieId },
          }),
          axios.get("https://movie-booking-kkjw.onrender.com/movie_details", {
            params: { movieId, flag: 1 },
          }),
        ]);
        setTheaterList(theaterResponse.data.result);
        setMovieDetails(movieResponse.data.movieDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const handleViewClick = async (theater_id, index) => {
    setTheater(index);
    setLoading(true);
    try {
      const response = await axios.get("https://movie-booking-kkjw.onrender.com/check_dates", {
        params: { theater_id, movieId },
      });
      setDatesTimes(response.data.result);
      setStatus("DatesTimes");
    } catch (error) {
      console.error("Error checking dates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSeats = async (date, startTime, endTime) => {
    setLoading(true);
    try {
      const response = await axios.get("https://movie-booking-kkjw.onrender.com/check_seats", {
        params: {
          theater_id: theaterList[theater].theater_id,
          movieId,
          date,
          startTime,
          endTime,
        },
      });
      setSeats(response.data.result[0]);
      setStatus("BookingSeats");
    } catch (error) {
      console.error("Error checking seats:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (rowIndex, seatIndex) => {
    const updatedSeats = [...seats.bookingSeats];
    const updatedRow = [...updatedSeats[rowIndex]];
    const currentAvailability = updatedRow[seatIndex].availability;

    updatedRow[seatIndex].availability =
      currentAvailability === 1
        ? -1
        : currentAvailability === -1
        ? 1
        : currentAvailability;

    setSeatSelectCnt(seatSelectCnt - updatedRow[seatIndex].availability);
    updatedSeats[rowIndex] = updatedRow;
    setSeats({ ...seats, bookingSeats: updatedSeats });
  };

  const handleBookClick = async () => {
    setLoading(true);
    try {
      const currentBill = seatSelectCnt * seats.ticketPrice;
      alert(`Your Total Bill: Rs. ${currentBill}`);
  
      // Update seats' availability and collect booked seats
      const updatedSeats = seats.bookingSeats.map((row) =>
        row.map((seat) => {
          if (seat.availability === -1) {
            return { ...seat, availability: 0 };
          }
          return seat;
        })
      );
  
      const newBookedTickets = seats.bookingSeats.flatMap((row) =>
        row
          .filter((seat) => seat.availability === -1)
          .map((seat) => seat.seat_number)
      );
  
      setBookedTickets((prevTickets) => [...prevTickets, ...newBookedTickets]);
  
      // Send the updated seats to the server
      const res = await axios.post("https://movie-booking-kkjw.onrender.com/book_seats", {
        theater_id: theaterList[theater].theater_id,
        movieId,
        seats: { ...seats, bookingSeats: updatedSeats },
      });
  
      // Set the bill and status
      setBill(currentBill);
      setStatus("Booking Success");
    } catch (error) {
      console.error("Error booking seats:", error);
      setStatus("Booking Failed");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCloseClick = () => {
    setTheater(-1);
    setDatesTimes([]);
    setSeats([]);
    setSeatSelectCnt(0);
    setStatus("");
    setBookedTickets([]);
  };

  return (
    <div>
      {loading ? (
        <div className={styles.movieHeader_container}>
        <Loading />
        </div>
      ) : theaterList && theaterList.length <= 0 ?        <div className={styles.movieHeader_container} >
            <div style={{marginLeft:'50%', marginTop:'20%' , transform:'translateX(-50%)', color:'red', fontSize:'1.5rem'}} >Sorry no theater available currently. Please Check later on...</div>
      </div>:movieDetails ? (
        <>
          <div className={styles.movieHeader_container}>
            <div className={styles.img_cont}>
              <img src={movieDetails.poster_url} alt={movieDetails.title} />
            </div>
            <div className={styles.tag_cont}>
              <div className={styles.tag_title}>{movieDetails.description}</div>
              <div className={styles.release_date}>
                Release Date: {movieDetails.release_date.split("T")[0]}
              </div>
            </div>
          </div>
          {status === "DatesTimes" ? (
            <div className={styles.dates_container}>
              <h3>Select Date and Time: </h3>
              {datesTimes.map((dates, datesIndex) => (
                <div key={datesIndex} className={styles.date_container}>
                  <div>Date: {dates.date}</div>
                  {dates.times.map((time, timeIndex) => (
                    <div key={timeIndex} className={styles.time_container}>
                      <div>Start Time: {time.startTime}</div>
                      <div>End Time: {time.endTime}</div>
                      <div>Ticket Price: {time.ticketPrice}</div>
                      <div
                        className={styles.checkSeatsButton}
                        onClick={() =>
                          handleCheckSeats(
                            dates.date,
                            time.startTime,
                            time.endTime
                          )
                        }
                      >
                        Check Seats
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : status === "BookingSeats" ? (
            <div className={styles.seating_container}>
              <h3>Available Seats</h3>
              {seats.bookingSeats.map((row, rowIndex) => (
                <div key={rowIndex}>
                  <span style={{ color: "aqua", fontSize: "1.1rem" }}>
                    Row {String.fromCharCode(65 + rowIndex)}
                  </span>
                  <div className={styles.seat_row}>
                    {row.map((seat, seatIndex) => (
                      <div
                        key={seatIndex}
                        title={seat.seat_number}
                        className={`${styles.seat} ${
                          seat.availability === 1
                            ? styles.theater_available_seat
                            : seat.availability === -1
                            ? styles.theater_selected_seat
                            : styles.theater_unavailable_seat
                        }`}
                        onClick={() => handleSeatClick(rowIndex, seatIndex)}
                      >
                        {seatIndex + 1}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                className={styles.booking_button}
                onClick={handleBookClick}
              >
                Book Tickets
              </button>
              <button
                className={styles.close_button}
                onClick={handleCloseClick}
              >
                Cancel
              </button>
            </div>
          ) : status === "Booking Success" ? (
            <div className={styles.bill_container}>
            <h5>Explore more to get more...</h5>
            <h4>TicketId: {sessionStorage.getItem("user")}</h4>
            <h3>Your Seats Id:</h3>

            <div style={{display:'flex', margin:'1rem 0rem', flexDirection:'row', justifyContent:'space-around', flexWrap:'wrap'}}>
            {bookedTickets.map((booked_seat, index) => (
              <h4 style={{color:'aqua'}} key={index}>{booked_seat}</h4>
            ))}
            </div>
            <h3>Total Bill: ${bill}</h3>
            <h5>
              Thank you for connecting with{" "}
              <span
                style={{ color: "aqua", cursor: "pointer" }} 
                onClick={() => navigate("/")}
              >
                CineBook
              </span>{" "}
              Reserve, Relax, Watch
            </h5>
          </div>
          
          ) : (
            <div className={styles.theater_list_container}>
              <h1>Theaters List</h1>
              {theaterList.map((theaterItem, index) => (
                <div className={styles.theater} key={index}>
                  <div>{theaterItem.name}</div>
                  <div>{theaterItem.location}</div>
                  <button
                    onClick={() =>
                      handleViewClick(theaterItem.theater_id, index)
                    }
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={styles.movieHeader_container}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default BookShow;
