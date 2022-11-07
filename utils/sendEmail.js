import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
  try {
    
    const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "noreplydemomail2022@gmail.com",
				pass: "yztlnrcdxbpjcvfa",
			},
		});
    let details = {
      from:"noreplydemomail2022@gmail.com",
      to:email,
      subject: subject,
      html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Marketing Management App.</h2>
      <p>Congratulations! You're almost set to start using Marketing Management App.
          Just click the below link to validate your email address.
      </p>
      ${text}<br/>
  `  
    }
   


    await transporter.sendMail(details,(err)=>{
      if(err){
        console.log("email not sent")
      }else{
        console.log("email has sent")
      }
    })

	
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};