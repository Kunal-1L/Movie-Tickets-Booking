import { useState, useContext } from "react";
import { GlobalContext } from "../store/GlobalStore";
import styles from "./ShowTime.module.css";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import Loading from "./Loading";
const ShowTime = ({ movieId }) => {
  const { setShowForm, setBooking } = useContext(GlobalContext);
  const [showDateTimes, setShowDateTimes] = useState([
    { date: "", times: [{ startTime: "", endTime: "", ticketPrice: 0 }] },
  ]);
  const [loading, setLoading] = useState(false);

  const handleCloseClick = () => {
    setShowForm(false);
  };

  // Always points to the last showDateTime in the array
  const lastShowDateTimeIndex = showDateTimes.length - 1;
  const lastShowDateTime = showDateTimes[lastShowDateTimeIndex];

  const addDate = () => {
    const newShowDateTimes = [
      ...showDateTimes,
      { date: "", times: [{ startTime: "", endTime: "", ticketPrice: 0 }] },
    ];
    setShowDateTimes(newShowDateTimes);
  };

  const addTime = () => {
    if (lastShowDateTime.times.length === 3) {
      alert("Maximum 3 shows allowed per day");
    } else {
      const newTimes = [
        ...lastShowDateTime.times,
        { startTime: "", endTime: "", ticketPrice: 0 },
      ];
      const newShowDateTimes = showDateTimes.map((showDateTime, index) =>
        index === lastShowDateTimeIndex
          ? { ...showDateTime, times: newTimes }
          : showDateTime
      );
      setShowDateTimes(newShowDateTimes);
    }
  };

  const removeTime = (timeIndex) => {
    const newTimes = lastShowDateTime.times.filter(
      (_, index) => index !== timeIndex
    );

    let newShowDateTimes;
    if (newTimes.length === 0) {
      // If no times left, remove the entire date entry
      newShowDateTimes = showDateTimes.filter(
        (_, index) => index !== lastShowDateTimeIndex
      );
    } else {
      // Update the times for the specific date
      newShowDateTimes = showDateTimes.map((showDateTime, index) =>
        index === lastShowDateTimeIndex
          ? { ...showDateTime, times: newTimes }
          : showDateTime
      );
    }

    setShowDateTimes(newShowDateTimes);

    // If the entire showDateTimes array is empty, hide the form
    if (newShowDateTimes.length === 0) {
      setShowForm(false);
    }
  };

  const removeDate = () => {
    const newShowDateTimes = showDateTimes.filter(
      (_, index) => index !== lastShowDateTimeIndex
    );
    setShowDateTimes(newShowDateTimes);

    // If the entire showDateTimes array is empty, hide the form
    if (newShowDateTimes.length === 0) {
      setShowForm(false);
    }
  };

  const addShow = async () => {
    const user = sessionStorage.getItem("user");
    const showDetails = { user, showToAdd: { movieId, dates: showDateTimes } };
    setLoading(true);
    try {
      const result = await axios.post(
        "https://movie-booking-kkjw.onrender.com/add_show",
        showDetails
      );
      alert(result.data.message);
    } catch (error) {
      alert("Failed to Add shows...");
      setShowForm(false);
      setBooking(false);
      console.log(error);
    } finally {
      setShowForm(false);
      setLoading(false);
    }
    console.log(showDateTimes);
    setShowDateTimes([]);
  };

  return loading ? (
    <div className="styles.showTime_container">
      <Loading />
    </div>
  ) : (
    <div className={styles.showTime_container}>
      <div className={styles.closeButton_container}>
        <IoCloseSharp
          className={styles.closeButton}
          onClick={handleCloseClick}
        />
      </div>
      <div className={styles.showTime_box}>
        <span>Show Date {lastShowDateTimeIndex + 1}</span>
        <div className={styles.inputDate}>
          <label htmlFor="date">Date: </label>
          <input
            type="date"
            name="date"
            value={lastShowDateTime.date}
            onChange={(e) => {
              const newShowDateTimes = showDateTimes.map(
                (showDateTime, index) =>
                  index === lastShowDateTimeIndex
                    ? { ...showDateTime, date: e.target.value }
                    : showDateTime
              );
              setShowDateTimes(newShowDateTimes);
            }}
          />
        </div>
        {lastShowDateTime.times.map((time, timeIndex) => (
          <div key={timeIndex} className={styles.inputTimes}>
            <div>
              <label htmlFor="startTime">Start Time: </label>
              <input
                type="time"
                name="startTime"
                value={time.startTime}
                onChange={(e) => {
                  const newTimes = lastShowDateTime.times.map((t, index) =>
                    index === timeIndex
                      ? { ...t, startTime: e.target.value }
                      : t
                  );
                  const newShowDateTimes = showDateTimes.map(
                    (showDateTime, index) =>
                      index === lastShowDateTimeIndex
                        ? { ...showDateTime, times: newTimes }
                        : showDateTime
                  );
                  setShowDateTimes(newShowDateTimes);
                }}
              />
            </div>
            <div className={styles.inputt}>
              <label htmlFor="endTime">End Time: </label>
              <input
                type="time"
                name="endTime"
                className={styles.input}
                value={time.endTime}
                onChange={(e) => {
                  const newTimes = lastShowDateTime.times.map((t, index) =>
                    index === timeIndex ? { ...t, endTime: e.target.value } : t
                  );
                  const newShowDateTimes = showDateTimes.map(
                    (showDateTime, index) =>
                      index === lastShowDateTimeIndex
                        ? { ...showDateTime, times: newTimes }
                        : showDateTime
                  );
                  setShowDateTimes(newShowDateTimes);
                }}
              />
            </div>
            <div className={styles.inputt}>
              <label htmlFor="ticketPrice">Ticket Price: </label>
              <input
                type="number"
                name="ticketPrice"
                className={styles.prices}
                value={time.ticketPrice}
                onChange={(e) => {
                  const newTimes = lastShowDateTime.times.map((t, index) =>
                    index === timeIndex
                      ? { ...t, ticketPrice: e.target.value }
                      : t
                  );

                  const newShowDateTimes = showDateTimes.map(
                    (showDateTime, index) =>
                      index === lastShowDateTimeIndex
                        ? { ...showDateTime, times: newTimes }
                        : showDateTime
                  );

                  setShowDateTimes(newShowDateTimes);
                }}
              />
            </div>
            <button
              className={styles.btn}
              onClick={() => removeTime(timeIndex)}
            >
              Remove Time
            </button>
          </div>
        ))}
        <div className={styles.actions}>
          <button className={styles.btn} onClick={addTime}>
            Add Time
          </button>
          <button className={styles.btn} onClick={addDate}>
            Add Date
          </button>
          <button className={styles.btn} onClick={removeDate}>
            Remove Date
          </button>
        </div>
        <button className={styles.submit_btn} onClick={addShow}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ShowTime;
