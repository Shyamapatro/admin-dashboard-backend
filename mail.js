const nodemailer = require('nodemailer');
const env = require("./config/env")();



const emailsender= async (email,link,path)=>{
let mailTransporter = nodemailer.createTransport({
    service: env.EMAIL.MAIL_SERVICE,
	auth: {
		user: env.EMAIL.SMTP_CREDENTIALS.email,
		pass: env.EMAIL.SMTP_CREDENTIALS.password
	}
    //  service: "GMAIL",
	// auth: {
	// 	user: "techgeekco20to25@gmail.com",
	// 	pass:"altplnhgtoltpcqb"
	// }
});
 
let mailDetails = {
    from:"techgeekco20to25@gmail.com", 
    to: email,
    subject: 'reset-password',
    html:`<p>  This is your Genterate Token<br/> <h3>${link} </h3> <br/>Please Click the button to reset your password</p>
    <a href="${path}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: white; text-decoration: none; color: black; text-decoration: none; padding: 15px 25px; display: inline-block;">Reset Password</a>
    `
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error Occurs',err);
    } else {
        console.log('Email sent successfully');
    }
});
}


module.exports =emailsender;