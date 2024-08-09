const express = require("express");
const mysql = require("mysql");
const app = express();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "study",
});

app.get("/student", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "db connection failed",
      });
    }
    const query = "select * from student";
    connection.query(query, (err, result) => {
      connection.release();
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "db connection failed",
        });
      }
      res.status(200).json({
        status: "success",
        db: result,
      });
    });
  });
});
app.listen(4000, () => console.log("pool server connected"));
