const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose
  .connect(
    "mongodb+srv://kumar180kunal:Kunal@cluster0.jlade.mongodb.net/MovieTickets?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MovieTickets Database :)"))
  .catch((err) => console.error("Error connecting to MongoDB: :(", err));

// Defining the data structure of the loginRecord collection
const loginSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_role: {
    type: String,
    required: true,
  },
  user_password: {
    type: String,
    required: true,
  },
});

// Defining the data structure of the moviesRecord Collection
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  release_date: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  language: {
    type: [String],
    required: true,
  },
  poster_url: {
    type: String,
    required: true,
  },
  trailer_url: {
    type: String,
  },
  cast: [
    {
      name: String,
      role: String, // Actor, Director, etc.
    },
  ],
  director: {
    type: [String],
    required: true,
  },
  producer: {
    type: [String],
  },
  production_company: {
    type: String,
  },
  average_rating: {
    type: Number,
    min: 0,
    max: 10,
  },
});

const SeatSchema = new mongoose.Schema({
  row: {
    type: String,
    required: true,
  },
  seat_number: {
    type: String,
    required: true,
  },
  availability: {
    type: Number,
    default: 1,
  },
});

const TheaterSchema = new mongoose.Schema({
  theater_id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },

  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  manager_name: {
    type: String,
    required: true,
  },
  manager_contact_number: {
    type: String,
    required: true,
  },
  seats: [[SeatSchema]],
});

// Sub-schema for Time
const TimeSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    bookingSeats: [[SeatSchema]],
    ticketPrice: { type: Number, required: true },
  },
  { _id: false }
);

// Sub-schema for Date
const DateSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    times: [TimeSchema], // Array of time sub-documents
  },
  { _id: false }
);

// Sub-schema for Movies
const showsMovieSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Movie collection
      required: true,
    },
    dates: [DateSchema], // Array of date sub-documents
  },
  { _id: false }
);

// Main schema for Shows
const ShowSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  shows: [showsMovieSchema], // Array of movie sub-documents
});

// Defining the model of the collection LoginRecords (collection creation)
const LoginRecords = mongoose.model("LoginRecords", loginSchema);

// Defining the model of the collection MovieRecords (collection creation)
const MovieRecords = mongoose.model("MovieRecords", movieSchema);

// Defining the model of the collection TheaterRecords (collection creation)
const Theater = mongoose.model("Theater", TheaterSchema);

const Shows = mongoose.model("Shows", ShowSchema);

const passWordHashing = async (user_password) => {
  try {
    const hashPassword = await bcrypt.hash(user_password, 5);
    return hashPassword;
  } catch (error) {
    throw error;
  }
};

const createLoginRecordDocument = async (user_id, user_role, user_password) => {
  try {
    user_password = await passWordHashing(user_password);
    const user = new LoginRecords({ user_id, user_role, user_password });
    console.log(user);
    await user.save();
  } catch (error) {
    throw error;
  }
};

const checkUser = async (userId) => {
  try {
    const res = await LoginRecords.findOne({ user_id: userId });
    return res;
  } catch (error) {
    throw error;
  }
};

const verifyPassword = async (user_password, user_hash_password) => {
  try {
    const match = await bcrypt.compare(user_password, user_hash_password);
    return match;
  } catch (error) {
    throw error;
  }
};

const fetchLatestMovies = async (skipCnt, limitCnt) => {
  try {
    const latestMovies = await MovieRecords.find(
      {},
      { title: 1, poster_url: 1, average_rating: 1 }
    )
      .skip(skipCnt)
      .limit(limitCnt);
    return latestMovies;
  } catch (error) {
    throw error;
  }
};

const getMovieDetails = async (movieId, flag) => {
  try {
    let movie;
    if (parseInt(flag, 10) === 1)
      // Convert to number for comparison
      movie = await MovieRecords.findOne(
        { _id: movieId },
        { title: 1, release_date: 1, description: 1, poster_url: 1, _id: 0 }
      );
    else movie = await MovieRecords.findOne({ _id: movieId });
    return movie;
  } catch (error) {
    throw error;
  }
};

const app = express();
const PORT = 8000;
const cors = require('cors');
app.use(cors({
  origin: 'https://movie-tickets-project.vercel.app/', // Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());

app.post("/create_account", async (req, res) => {
  try {
    const { user_id_val, user_role, user_password_val } = req.body;
    const result = await checkUser(user_id_val);
    if (result) {
      res.status(409).json({ message: "User already exists. Please Sign In" });
    } else {
      console.log("Creating>>>>>>>");
      await createLoginRecordDocument(
        user_id_val,
        user_role,
        user_password_val
      );
      res.status(201).json({
        message: "Account Created Successfully. Please Continue to Sign In",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while creating account. Try again" });
  }
});

app.post("/sign_in", async (req, res) => {
  try {
    const { user_id_val, user_password_val } = req.body;
    const user = await checkUser(user_id_val);
    if (user) {
      const isMatch = await verifyPassword(
        user_password_val,
        user.user_password
      );
      if (isMatch) {
        res.status(200).json({
          message: "Login Successfully",
          id: user_id_val,
          role: user.user_role,
        });
      } else {
        res.status(401).json({ message: "Incorrect Password" });
      }
    } else {
      res
        .status(404)
        .json({ message: "User Account doesn't exist. Please Create Account" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while signing in. Try again" });
  } finally {
  }
});

app.get("/movies", async (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  const skip = parseInt(req.query.skip) || 0;

  try {
    const result = await fetchLatestMovies(skip, limit);
    res.status(200).json({ message: "Success", latestMovies: result });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching latest movies",
      error: error.message,
    });
  }
});

app.get("/movie_details", async (req, res) => {
  const movieId = req.query.movieId;
  const flag = req.query.flag;
  console.log(flag);
  try {
    const result = await getMovieDetails(movieId, flag);
    res.status(201).json({ message: "Success", movieDetails: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching movie Details", error: error });
  }
});

// New route for searching movies
app.get("/search_movies", async (req, res) => {
  const searchString = req.query.searchString || "";
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;

  try {
    const { body } = await client.search({
      index: "movies",
      from: skip,
      size: limit,
      body: {
        query: {
          multi_match: {
            query: searchString,
            fields: [
              "title^2",
              "description",
              "genre",
              "cast.name",
              "director",
            ],
          },
        },
      },
    });

    res.status(200).json({ message: "Success", searchResults: body.hits.hits });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while searching movies", error: error.message });
  }
});

const addTheaterDetails = async (theater) => {
  try {
    const {
      managerName,
      managerContact,
      theaterName,
      theaterLocation,
      rows,
      user,
    } = theater;
    const manager = await checkUser(user);

    // Function to assign seats
    const assignSeat = () => {
      const seats = [];
      rows.forEach((seatsInRow, rowIndex) => {
        const rowSeats = [];
        for (let i = 0; i < seatsInRow; i++) {
          rowSeats.push({
            row: String.fromCharCode(65 + rowIndex), // Convert rowIndex to letter (A, B, C, ...)
            seat_number: `${String.fromCharCode(65 + rowIndex)}${i + 1}`,
            availability: 1, // Default to true
          });
        }
        seats.push(rowSeats); // Push the array of seats for this row into the main seats array
      });

      return seats;
    };

    // Create the theater document
    const theaterDocument = {
      theater_id: user,
      name: theaterName,
      location: theaterLocation,
      manager_id: manager._id,
      manager_name: managerName,
      manager_contact_number: managerContact,
      seats: assignSeat(), // Call the function to get the seats array
    };

    console.log(theaterDocument); // Debug output
    const record = new Theater(theaterDocument);
    return await record.save(); // Await the save operation
  } catch (error) {
    throw error;
  }
};

app.post("/add_theatre_details", async (req, res) => {
  try {
    console.log(req.body);
    const result = await addTheaterDetails(req.body);
    res.status(200).json({ message: "Thank you for joining our platform..." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while inserting details", error: error.message });
  }
});

const findShow = async ({ userId, movieId }) => {
  try {
    const res = await Shows.findOne({
      userId: userId,
      shows: {
        $elemMatch: {
          movieId: movieId,
        },
      },
    });

    console.log(res);
    console.log(!!res);
    return !!res; // Convert result to a boolean
  } catch (err) {
    console.error("Error finding show:", err);
    return false;
  }
};

app.get("/check_movie", async (req, res) => {
  try {
    const isAvailable = await findShow(req.query);
    res.status(200).json({ message: isAvailable });
  } catch (error) {
    console.error("Error in /check_movie:", error);
    res.status(500).json({ message: "Failed to fetch" });
  }
});

const addShow = async (userId, showToAdd) => {
  try {
    // Fetch the Seats Structure based on the theater ID
    const theaterData = await Theater.findOne(
      { theater_id: userId },
      { seats: 1, _id: 0 }
    );
    console.log("Hello", theaterData);
    if (theaterData) {
      showToAdd.dates.forEach((dateObj) => {
        dateObj.times.forEach((timeObj) => {
          timeObj.bookingSeats = theaterData.seats;
        });
      });
    }
    // Find the document with the given userId and update or insert
    const result = await Shows.findOneAndUpdate(
      { userId: userId },
      {
        $addToSet: {
          shows: showToAdd,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (err) {
    console.error("Error during update:", err);
    throw err;
  }
};

app.post("/add_show", async (req, res) => {
  try {
    console.log(req.body);
    await addShow(req.body.user, req.body.showToAdd);
    res.status(200).json({ message: "Shows Added Successfully..." });
  } catch (error) {
    res.status(500).json({ message: "Fail to Add..." });
  }
});

const checkTheaters = async (movieId) => {
  try {
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

    // Delete show in shows where show date is less than current date
    await Shows.updateMany(
      {},
      {
        $pull: {
          "shows.$[].dates": { date: { $lt: currentDate } },
        },
      }
    );
    // Delete shows whose dates array is empty
    await Shows.updateMany(
      {},
      {
        $pull: {
          shows: { dates: { $size: 0 } },
        },
      }
    );
    // Delete user if all possible shows launched was endend
    await Shows.deleteMany({ shows: { $size: 0 } });

    // Find operation to check the result
    const res = await Shows.find(
      { "shows.movieId": movieId },
      { userId: 1, _id: 0 }
    );

    // Creating array of theater_manager to fetch theater details
    const theater_manager_ids = [];
    res.map((user, index) => theater_manager_ids.push(user.userId));
    const finalAvailableTheatersDetails = await Theater.find(
      { theater_id: { $in: theater_manager_ids } },
      { theater_id: 1, name: 1, location: 1, _id: 0 }
    );
    return finalAvailableTheatersDetails;
  } catch (error) {
    console.error("Error:", error);
  }
};

const checkDates = async ({ theater_id, movieId }) => {
  try {
    console.log(theater_id, movieId);

    const result = await Shows.aggregate([
      // Match the theater ID
      { $match: { userId: theater_id } },

      // Unwind the shows array
      { $unwind: "$shows" },

      // Match the specific movie ID
      { $match: { "shows.movieId": new mongoose.Types.ObjectId(movieId) } },

      // Unwind the dates array within shows
      { $unwind: "$shows.dates" },

      // Project only the necessary fields
      {
        $project: {
          _id: 0,
          "shows.dates.date": 1,
          "shows.dates.times": {
            $map: {
              input: "$shows.dates.times",
              as: "time",
              in: {
                startTime: "$$time.startTime",
                endTime: "$$time.endTime",
                ticketPrice: "$$time.ticketPrice", // Extracting ticketPrice
                bookingSeats: "$$time.bookingSeats", // Extracting bookingSeats
              },
            },
          },
        },
      },

      // Group by date and aggregate times
      {
        $group: {
          _id: { date: "$shows.dates.date" },
          times: { $push: "$shows.dates.times" },
        },
      },

      // Final projection to shape the result
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          times: { $arrayElemAt: ["$times", 0] },
        },
      },
    ]);

    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

app.get("/check_dates", async (req, res) => {
  try {
    const result = await checkDates(req.query);
    res.status(200).json({ message: "Success", result: result });
  } catch (error) {
    res.status(500).json({ message: "Failed To Check..." });
  }
});

const checkSeats = async ({
  theater_id,
  movieId,
  date,
  startTime,
  endTime,
}) => {
  try {
    const result = await Shows.aggregate([
      { $match: { userId: theater_id } }, // Match by userId
      { $unwind: "$shows" }, // Unwind the shows array
      { $match: { "shows.movieId": new mongoose.Types.ObjectId(movieId) } }, // Match by movieId
      { $unwind: "$shows.dates" }, // Unwind the dates array
      { $unwind: "$shows.dates.times" }, // Unwind the times array
      {
        $match: {
          "shows.dates.date": date, // Match by date
          "shows.dates.times.startTime": startTime, // Match by startTime
          "shows.dates.times.endTime": endTime, // Match by endTime
        },
      },
      {
        $project: {
          _id: 0,
          date: "$shows.dates.date",
          startTime: "$shows.dates.times.startTime",
          endTime: "$shows.dates.times.endTime",
          bookingSeats: "$shows.dates.times.bookingSeats",
          ticketPrice: "$shows.dates.times.ticketPrice",
        },
      },
    ]);

    console.log(result);
    return result;
  } catch (error) {
    console.error("Error checking seats:", error);
    throw error;
  }
};

app.get("/check_seats", async (req, res) => {
  try {
    const result = await checkSeats(req.query);
    res.status(200).json({ message: "Success", result: result });
  } catch (error) {
    res.status(500).json({ message: "Failed To Acess Seats..." });
  }
});

app.get("/check_theater", async (req, res) => {
  try {
    const result = await checkTheaters(req.query.movieId);
    res.status(200).json({ message: "Success", result: result });
  } catch (error) {
    res.status(500).json({ message: "Failed To Check..." });
  }
});

const updateSeats = async ({ theater_id, movieId, seats }) => {
  try {
    console.log(
      theater_id,
      movieId,
      seats,
      seats.date,
      seats.startTime,
      seats.endTime
    );
    // Find the specific show and update the bookingSeats
    const result = await Shows.findOneAndUpdate(
      {
        userId: theater_id, // Match by theater_id
        "shows.movieId": new mongoose.Types.ObjectId(movieId), // Match by movieId
        "shows.dates.date": seats.date, // Match by date
        "shows.dates.times.startTime": seats.startTime, // Match by startTime
        "shows.dates.times.endTime": seats.endTime, // Match by endTime
      },
      {
        $set: {
          "shows.$[show].dates.$[date].times.$[time].bookingSeats":
            seats.bookingSeats, // Update bookingSeats
        },
      },
      {
        arrayFilters: [
          { "show.movieId": new mongoose.Types.ObjectId(movieId) },
          { "date.date": seats.date },
          { "time.startTime": seats.startTime, "time.endTime": seats.endTime },
        ],
        new: true,
      }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

app.post("/book_seats", async (req, res) => {
  try {
    console.log("book", req.body);
    const result = await updateSeats(req.body);
    res.status(200).json({ message: "Success", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update seats", error: error.message });
  }
});

const addMovieDetails = async ({
  movieTitle,
  movieDescription,
  movieReleaseDate,
  movieDuration,
  moviePoster,
  movieTrailer,
  movieProductionCompany,
  genres,
  directors,
  producers,
  languages,
  casts,
}) => {
  try {
    const updatedRecord = {
      title: movieTitle,
      description: movieDescription,
      genre: genres,
      release_date: movieReleaseDate,
      duration: movieDuration,
      language: languages,
      poster_url: moviePoster,
      trailer_url: movieTrailer,
      cast: casts,
      director: directors,
      producer: producers,
      production_company: movieProductionCompany,
      average_rating: 0.0,
    };

    const record = new MovieRecords(updatedRecord);
    return await record.save(); 
  } catch (error) {
    throw error;
  }
};



app.post("/add_movie_details", async (req, res) => {
  try {
    console.log(req.body);
    await addMovieDetails(req.body);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add movie", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
