import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "trioxtrade.com",
      port: 465,
      secure: true,
      // service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // the 16-char app password
      },
    });

    await transporter.sendMail({
      from: `"TRIOXTRADE" <${process.env.EMAIL_USER}>`, // name + email
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

export default sendEmail;
