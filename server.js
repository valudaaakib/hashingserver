import express from "express";
import crypto from "crypto";
import ngrok from "ngrok";
import db from "./db_con.js";

const app = express();
app.use(express.json());

// 16-character secret key (same as Flutter)
const secretKey = "1234567890123456"; // 16 chars = 128-bit key
const iv = Buffer.from(secretKey, "utf8"); // using same as IV (for demo only)

// Encrypt function (AES-128-CBC, PKCS7 padding)
function encryptText(text) {
  const cipher = crypto.createCipheriv(
    "aes-128-cbc",
    Buffer.from(secretKey, "utf8"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

// Decrypt function
function decryptText(encryptedBase64) {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(secretKey, "utf8"),
    iv
  );
  let decrypted = decipher.update(encryptedBase64, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// API to test
app.post("/encrypt", (req, res) => {
  const { text } = req.body;
  const encrypted = encryptText(text);
  res.json({ encrypted });
});

app.post("/decrypt", (req, res) => {
  const { encrypted } = req.body;
  const decrypted = decryptText(encrypted);
  res.json({ decrypted });
});

app.post("/register", (req, res) => {
  const {
    restro_name,
    email,
    contact,
    alt_contact,
    address,
    gst_no,
    tin_no,
    pin_code,
    dealer_id,
    license_key,
    installation_code,
  } = req.body;

  const query =
    "INSERT INTO restro_reg (restro_name, email, contact, alt_contact, address, gst_no, tin_no, pin_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    restro_name,
    email,
    contact,
    alt_contact,
    address,
    gst_no,
    tin_no,
    pin_code,
  ];

  // db.query(query, values, (err, result) => {
  //   if (err) {
  //     console.error("Error registering restro:", err);
  //     res.status(500).json({ error: "Error registering restro" });
  //   } else {
  //     console.log("Restro registered successfully", result);
  //     res.status(200).json({ message: "Restro registered successfully" });
  //   }
  // });
});

db.query("select * from restro_reg", (err, result) => {
  if (err) {
    console.error("Error executing query:", err);
  } else {
    console.log("Query result:", result);
  }
});

app.listen(4000, () => {
  const url = ngrok.connect(4040);
  console.log("Server started on ");
  if (db) {
    console.log("Server started on port 3000");
  }
});
