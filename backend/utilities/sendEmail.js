import nodemailer from "nodemailer";


const sendEmail = async (options) => {
 
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_ID,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `Hivvy <${process.env.SMTP_ID}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);

}

export default sendEmail;
