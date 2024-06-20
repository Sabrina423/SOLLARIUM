const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");

// Express.js middleware to use JSON objects
app.use(express.json());

app.post(
  "/signup",
  // using validation to verify valid inputs (MIDDLEWARE)
  [
    [
      body("name").notEmpty(),
      body("email").isEmail(),
      body("password").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

    res.status(200).json({success:'Successful Sign Up!'})
  }
);

// Server Listening at port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});