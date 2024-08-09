const mysql = require("mysql");
const express = require("express");
const app = express();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "study",
});

app.use(express.json());

app.get("/students", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
      });
    }

    console.log("Database connected");

    const query = "SELECT * FROM student";
    connection.query(query, (err, result) => {
      // Release the connection after the query execution
      connection.release();

      if (err) {
        console.error("Query execution failed:", err.message);
        return res.status(500).json({
          status: "error",
          message: "Query execution failed",
        });
      }

      res.json({
        status: "success",
        data: result,
      });
    });
  });
});

app.post("/students", (req, res) => {
  const { name, age, gender, city } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
      });
    }

    console.log("Database connected");

    const query =
      "INSERT INTO student (name, age, gender, city) VALUES (?, ?, ?, ?)";
    connection.query(query, [name, age, gender, city], (err, result) => {
      // Release the connection after the query execution
      connection.release();

      if (err) {
        console.error("Query execution failed:", err.message);
        return res.status(500).json({
          status: "error",
          message: "Query execution failed",
        });
      }

      res.status(201).json({
        status: "success",
        message: "Student record inserted successfully",
        data: {
          id: result.insertId,
          name,
          age,
          gender,
          city,
        },
      });
    });
  });
});

app.put("/students/:id", (req, res) => {
  const id = req.params.id;
  const { name, age, gender, city } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
      });
    }

    console.log("Database connected");

    const query =
      "UPDATE student SET name = ?, age = ?, gender = ?, city = ? WHERE id = ?";
    connection.query(query, [name, age, gender, city, id], (err, result) => {
      // Release the connection after the query execution
      connection.release();

      if (err) {
        console.error("Query execution failed:", err.message);
        return res.status(500).json({
          status: "error",
          message: "Query execution failed",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: "error",
          message: "Student not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Student record updated successfully",
      });
    });
  });
});

app.delete("/students/:id", (req, res) => {
  const id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
      });
    }

    console.log("Database connected");

    const query = "DELETE FROM student WHERE id = ?";
    connection.query(query, [id], (err, result) => {
      // Release the connection after the query execution
      connection.release();

      if (err) {
        console.error("Query execution failed:", err.message);
        return res.status(500).json({
          status: "error",
          message: "Query execution failed",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Student record deleted successfully",
      });
    });
  });
});

function rte() {
  return "ojok";
}
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
