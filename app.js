const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const indexRouter = require("./routes/indexRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Members Only App - Listening on port ${PORT}`);
});
// ^^ dev -- deploy >>
// app.listen(PORT, () =>
//     console.log(`Inventory Application - Listening on port ${PORT}`)
//   );
