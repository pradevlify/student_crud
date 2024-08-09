const mysql = require("mysql2/promise");
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

app.get("/students", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const query = "select * from student";
    const [result] = await connection.execute(query);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  } finally {
    if (connection) connection.release(); // Ensure connection is released back to the pool
  }
});

app.post("/students", async (req, res) => {
  const { name, age, gender, city } = req.body;
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Database connected");
    const query =
      "INSERT INTO student (name, age, gender, city) VALUES (?, ?, ?, ?)";
    const [result] = await connection.execute(query, [name, age, gender, city]);

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
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({
      status: "error",
      message: "Database query failed",
    });
  } finally {
    if (connection) connection.release(); // Ensure connection is released back to the pool
  }
});

app.put("/students/:id", async (req, res) => {
  const id = req.params.id;
  const { name, age, gender, city } = req.body;

  try {
    const connection = await pool.getConnection();
    console.log("Database connected");

    const [result] = await connection.execute(
      "UPDATE student SET name = ?, age = ?, gender = ?, city = ? WHERE id = ?",
      [name, age, gender, city, id]
    );
    connection.release();

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
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({
      status: "error",
      message: "Database query failed",
    });
  }
});

app.delete("/students/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const connection = await pool.getConnection();
    console.log("Database connected");

    const [result] = await connection.execute(
      "DELETE FROM student WHERE id = ?",
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Student record deleted successfully",
    });
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({
      status: "error",
      message: "Database query failed",
    });
  }
});

app.listen(4000, () => {
  console.log(" async Server running on port 4000");
});
