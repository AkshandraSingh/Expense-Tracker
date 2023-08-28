const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASS,
    }
});

const htmlContentForAccount = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {
                    text-align: center;
                }

                h1 {
                    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                }

                p {
                    width: 488px;
                    margin-top: 22px;
                    margin: auto;
                    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                    font-weight: bold;
                }
            </style>
        </head>

        <body>
            <h1>Welcome to Expense Tracker</h1>
            <p>Thanks For Creating Account</p>
            <br>
            <p>Thanks for creating account in our application ! We will try to provide best experience ⭐</p>
        </body>

        </html>
`

const setNewPasswordContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @import url("https://fonts.googleapis.com/css2?family=Public+Sans:wght@200&display=swap");
                .mainContent {
                    width: 700px;
                    margin: auto;
                    text-align: center;
                }
                img {
                    width: 195px;
                    height: 119px;
                    border-radius: 21px;
                }
                p {
                    font-family: "Public Sans", sans-serif;
                }
                button {
                    width: 138px;
                    height: 38px;
                    border-radius: 22px;
                    background-color: dodgerblue;
                }
                button:hover {
                    background-color: crimson;
                    cursor: pointer;
                }
            </style>
            <title>setNewPassword</title>
        </head>
        <body>
            <div class="mainContent">
                <img src="https://c4.wallpaperflare.com/wallpaper/619/468/16/node-js-javascript-wallpaper-thumb.jpg"
                    alt="NodeJs Image">
                <p>Hello! user someone or you change your expense tracking application password</p>
                <button>For more details</button>
            </div>
        </body>
        </html>
`
const mailOptions = async (userEmail, hashData = 0, link = 0) => {
    if ((hashData, link)) {
        await transporter.sendMail({
            from: `"Expense Tracker" <${process.env.SENDER_EMAIL}>`,
            to: userEmail,
            subject: "Reset password",
            html: `<a href=${link}>Click for rest your password`
        });
    }
    else if (hashData === 2) {
        await transporter.sendMail({
            from: `"Expense Tracker" <${process.env.SENDER_EMAIL}>`,
            to: userEmail,
            subject: "Your Password is Changed",
            html: setNewPasswordContent
        });
    }
    else {
        await transporter.sendMail({
            from: `"Expense Tracker" <${process.env.SENDER_EMAIL}>`,
            to: userEmail,
            subject: "Thanks For Creating Account",
            html: htmlContentForAccount
        });
    }
}

const expenseReminder = async (userEmail, expenseName, message, expenseAmount) => {
    await transporter.sendMail({
        from: `"Expense Tracker" <${process.env.SENDER_EMAIL}>`,
        to: userEmail,
        subject: "Expense Reminder",
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="/CSS/reminder.css">
                    <style>
                        @import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap");
                        * {
                            margin: 0px;
                            padding: 0px;
                            text-align: center;
                        }
                        h1 {
                            color: rgb(255, 114, 21);
                            font-family: "Cascadia Code";
                            margin: 12px;
                        }
                        p {
                            font-family: "Ubuntu", sans-serif;
                        }
                    </style>
                </head>
                <body>
                    <h1>Welcome To Expense Tracker</h1>
                    <p>Hey! you set reminder to pay your ${expenseName}</p>
                    <p>Your message: ${message}</p>
                    <p>you have to pay ${expenseAmount}</p>
                </body>
                </html>`})
}

module.exports = {
    mailOptions,
    expenseReminder
}
