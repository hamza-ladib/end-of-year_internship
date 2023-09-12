const nodemailer = require('nodemailer')
module.exports.sendMail=(to,subject,body)=>{
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
    let transporter = nodemailer.createTransport(config)
    let message = {
        from: process.env.EMAIL,
        to:to,
        subject:subject,
        html: `
        <div style="padding: 20px" >
        <h4>Bonjour,</h4>
        <p style="margin-top:15px; padding-left: 12px"><span style="color:blue; font-weight:bold"> ${body}</p>
        <p style="margin-top:20px; padding-left: 12px">>Cordialement </p>
        </div>
    `
    }
    transporter.sendMail(message)
}