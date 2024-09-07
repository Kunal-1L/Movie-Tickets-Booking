import React, { useRef, useState } from "react";
import styles from "./Theater.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Theater = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const handleAddRow = () => {
    setRows([...rows, 0]);
  };

  const handleRemoveRow = (rowIndex) => {
    const updatedRows = [...rows];
    updatedRows.splice(rowIndex, 1);
    setRows(updatedRows);
  };

  const handleSeatsChange = (rowIndex, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = parseInt(value, 10);
    setRows(updatedRows);
  };

  const managerNameRef = useRef(null);
  const managerContactRef = useRef(null);
  const theaterNameRef = useRef(null);
  const theaterLocationRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const managerName = managerNameRef.current.value;
    const managerContact = managerContactRef.current.value;
    const theaterName = theaterNameRef.current.value;
    const theaterLocation = theaterLocationRef.current.value;
    const user = sessionStorage.getItem('user');
    const theater_info = {
      managerName,
      managerContact,
      theaterName,
      theaterLocation,
      rows,
      user
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/add_theatre_details",
        theater_info
      );

      alert(response.data.message);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Error while adding theater details. Please try again.");
    }

    managerNameRef.current.value = "";
    managerContactRef.current.value = "";
    theaterNameRef.current.value = "";
    theaterLocationRef.current.value = "";
    setRows([]);
  };

  return (
    <div className={styles.theater_container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.theater_manager_container}>
          <fieldset>
            <legend>Manager Information</legend>
            <label htmlFor="managerName">Name:</label>
            <input
              ref={managerNameRef}
              type="text"
              id="managerName"
              name="managerName"
              required
            />

            <label htmlFor="managerContact">Contact Number:</label>
            <input
              type="text"
              id="managerContact"
              name="managerContact"
              ref={managerContactRef}
              required
            />
          </fieldset>
        </div>

        <div className={styles.theater_information}>
          <fieldset>
            <legend>Theater Information</legend>
            <label htmlFor="theaterName">Theater Name:</label>
            <input
              ref={theaterNameRef}
              type="text"
              id="theaterName"
              name="theaterName"
              required
            />

            <label htmlFor="theaterLocation">Location:</label>
            <input
              type="text"
              id="theaterLocation"
              name="theaterLocation"
              ref={theaterLocationRef}
              required
            />
          </fieldset>
        </div>

        <div className={styles.screen_information}>
          <fieldset>
            <legend>Screen Information</legend>
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.row_information}>
                <fieldset>
                  <legend>Row {rowIndex + 1}</legend>
                  <label htmlFor={`seats-${rowIndex}`}>
                    Number of Seats:
                  </label>
                  <input
                    type="number"
                    id={`seats-${rowIndex}`}
                    name={`seats-${rowIndex}`}
                    value={row}
                    onChange={(e) =>
                      handleSeatsChange(rowIndex, e.target.value)
                    }
                    required
                  />
                  <div className={styles.theater_button}>
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(rowIndex)}
                      style={{ color: "red", fontSize: "1.2rem" }}
                    >
                      Remove Row
                    </button>
                  </div>
                </fieldset>
              </div>
            ))}
            <div className={styles.theater_button}>
              <button type="button" onClick={handleAddRow}>
                Add Row
              </button>
            </div>
          </fieldset>
        </div>

        <div className={styles.theater_button}>
          <button type="submit">Register Theatre</button>
        </div>
      </form>
    </div>
  );
};

export default Theater;
