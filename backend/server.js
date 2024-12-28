const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
 // Replace with your frontend URL
app.use(bodyParser.json());


// Mailtrap Configuration
const TOKEN = process.env.MAILTRAP_TOKEN; 

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

//middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { product, quantity, companyName, pincode, email, mobile } = req.body;

  if (!product || !quantity || !companyName || !pincode || !email || !mobile) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sender = {
    email: "sales@mehtasteels.com",
    name: "Product Enquiry"
  };

  const recipients = [
    {
      email: "sales@mehtasteels.com",
    },
  ];

  console.log("Received request:", { product, quantity, companyName, pincode, email, mobile });

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: `New Product Enqiry from ${companyName}`,
      text: `
      Product: ${product}
      Quantity: ${quantity}
      Company: ${companyName}
      Pincode: ${pincode}
      Email: ${email}
      Mobile: ${mobile}
      `,
    });

    res.status(200).json({ message: "Email sent successsfully!" });
  } catch (error) {
    console.error("Mailtrap Error:", error.response || error.message || error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
