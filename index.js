import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import nodemailer from "nodemailer"; // Ensure Nodemailer is imported

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({ origin: "https://mrtidy-frontend.vercel.app", credentials: true })
);
app.get("/", (req, res) => {
  res.json("server started successfully");
});
app.post("/send-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com", // Corrected SMTP host for Gmail
      port: 587,
      secure: false, // True for 465, false for other ports including 587
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${req.body.name}" <${req.body.email}>`, // Correctly formatted sender address, use your authenticated email
      to: "mrtidy36@gmail.com", // Your target email address
      subject: req.body.subject,
      text: `Message from ${req.body.name} (${req.body.email}): ${req.body.message}`, // Text version with email
      html: `
          <p><strong>From:</strong> ${req.body.name} (${req.body.email})</p>
          <p><strong>Email:</strong> <a href='mailto:${req.body.email}'>${req.body.email}</a></p>
          <p><strong>Message:</strong> ${req.body.message}</p>
        `, // HTML version to separate the email and message
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email successfully sent!" });
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
