const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

require("./db/database");

const placesRouter = require("./routes/places");
const searchRouter = require("./routes/search");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Voyaguer backend is running." });
});

app.use("/api/places", placesRouter);
app.use("/api/search", searchRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});