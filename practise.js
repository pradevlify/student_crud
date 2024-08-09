const express = require("express");
const mysql = require("mysql");
const app = express();

function connection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "study",
  });
}

app.use(express.json());

app.get("/student/list", (req, res) => {
  const conn = connection();
  conn.connect((err) => {
    if (err) {
      console.log("Database connection error:", err.message);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
    console.log("Database connected");

    const query =
      "SELECT student.*,city.cityName FROM student inner join city on student.city=city.id";
    conn.query(query, (err, result) => {
      conn.end((endErr) => {
        if (endErr) {
          console.error("Failed to close connection:", endErr.message);
        } else {
          console.log("Connection closed");
        }
      });

      if (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({
          status: "error",
          message: err.message,
        });
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    });
  });
});

app.post("/student/list", (req, res) => {
  const { name, age, gender, city } = req.body;
  const conn = connection();
  conn.connect((err) => {
    if (err) {
      conn.end();
      return res.status(500).json({
        status: "error",
        message: err.sqlMessage,
      });
    }
    const query = "insert into student(name,age,gender,city)values(?,?,?,?)";
    conn.query(query, [name, age, gender, city], (err, result) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "query execution failed",
        });
      }
      res.status(201).json({
        status: "success",
        message: "data inserted successfully",
      });
    });
  });
});

app.put("/student/:id", (req, res) => {
  const conn = connection();
  const id = req.params.id;
  const { name, age, gender, city } = req.body;
  conn.connect((err) => {
    if (err) {
      conn.end();
      return res.json({ message: "connection db failed" });
    }
    const query = "update student set name=?, age=?,gender=?,city=? where id=?";
    conn.query(query, [name, age, gender, city, id], (err, result) => {
      if (err) {
        conn.end();
        return res.json({
          message: "query execution failed",
        });
      }
      if (result.affectedRows === 0) {
        conn.end();
        return res.status(404).json({
          status: "error",
          message: "no record found",
        });
      }
      res.status(200).json({
        status: "success",
        data: `${result.affectedRows}`,
      });
      conn.end();
    });
  });
});

app.listen(4000, () => console.log("server connected"));
