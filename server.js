const mysql = require("mysql");
const express = require("express");
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

app.get("/students", (req, res) => {
  const conn = connection();
  conn.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
      });
    }

    console.log("Database connected");

    const query = "SELECT * FROM student";
    conn.query(query, (err, result) => {
      if (err) {
        console.error("Query execution failed:", err.message);
        conn.end();
        return res.status(500).json({
          status: "error",
          message: "Query execution failed",
        });
      }
      res.json({
        status: "success",
        data: result,
      });

      conn.end((err) => {
        if (err) {
          console.error("Failed to close connection:", err.message);
        } else {
          console.log("Connection closed");
        }
      });
    });
  });
});

app.post("/students", (req, res) => {
  const { name, age, gender, city } = req.body;
  const conn = connection();

  conn.connect((err) => {
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
    conn.query(query, [name, age, gender, city], (err, result) => {
      if (err) {
        console.error("Query execution failed:", err.message);
        conn.end();
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

      conn.end((err) => {
        if (err) {
          console.error("Failed to close connection:", err.message);
        } else {
          console.log("Connection closed");
        }
      });
    });
  });
});

app.put("/students/:id", (req, res) => {
  const id = req.params.id;
  const { name, age, gender, city } = req.body;
  const conn = connection();

  conn.connect((err) => {
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
    conn.query(query, [name, age, gender, city, id], (err, result) => {
      if (err) {
        console.error("Query execution failed:", err.message);
        conn.end();
        return res.status(500).json({
          status: "error",
          message: "Query execution failed",
        });
      }

      if (result.affectedRows === 0) {
        conn.end();
        return res.status(404).json({
          status: "error",
          message: "Student not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Student record updated successfully",
      });

      conn.end((err) => {
        if (err) {
          console.error("Failed to close connection:", err.message);
        } else {
          console.log("Connection closed");
        }
      });
    });
  });
});

app.patch("/students/:id", (req, res) => {
  const id = req.params.id;
  const { name, age, gender, city } = req.body;
  const conn = connection();

  conn.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
      });
    }

    console.log("Database connected");

    // Build the dynamic query and parameters based on provided fields
    let query = "UPDATE student SET";
    const updates = [];
    const params = [];

    if (name) {
      updates.push("name = ?");
      params.push(name);
    }
    if (age) {
      updates.push("age = ?");
      params.push(age);
    }
    if (gender) {
      updates.push("gender = ?");
      params.push(gender);
    }
    if (city) {
      updates.push("city = ?");
      params.push(city);
    }

    if (updates.length === 0) {
      conn.end();
      return res.status(400).json({
        status: "error",
        message: "No fields to update",
      });
    }

    query += ` ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    conn.query(query, params, (err, result) => {
      if (err) {
        console.error("Query execution failed:", err.message);
        conn.end();
        return res.status(500).json({
          status: "error",
          message: "Query execution failed",
        });
      }

      if (result.affectedRows === 0) {
        conn.end();
        return res.status(404).json({
          status: "error",
          message: "Student not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Student record updated successfully",
      });

      conn.end((err) => {
        if (err) {
          console.error("Failed to close connection:", err.message);
        } else {
          console.log("Connection closed");
        }
      });
    });
  });
});

app.delete("/students/:id", (req, res) => {
  const id = req.params.id;
  const conn = connection();

  conn.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
      });
    }

    console.log("Database connected");

    const query = "DELETE FROM student WHERE id = ?";
    conn.query(query, [id], (err, result) => {
      if (err) {
        console.error("Query execution failed:", err.message);
        conn.end();
        return res.status(500).json({
          status: "error",
          message: "Query execution failed",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Student record deleted successfully",
      });

      conn.end((err) => {
        if (err) {
          console.error("Failed to close connection:", err.message);
        } else {
          console.log("Connection closed");
        }
      });
    });
  });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
