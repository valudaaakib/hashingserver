import mysql from "mysql2";

const db = mysql.createConnection({
  host: "103.160.106.28",
  user: "gadiyo_restro",
  password: "gadiyo_restro",
  database: "gadiyo_restro",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

export default db;
