var nodemailer = require('nodemailer');

class bot_emailer{
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
              user: 'email-address_2_send_notf.eamil from',
              pass: 'password for above email'
            }
          });
    }


    send_notif(notif_strg){
        var mailOptions = {
            from: 'dk7988@live.com',
            to: 'dk7988@live.com',
            subject: 'NOTIF - UnknownCryptoMiningBot',
            text: notif_strg
        };
        this.transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }

    _send_notif(notif_strg,sub){
        var mailOptions = {
            from: 'dk7988@live.com',
            to: 'dk7988@live.com',
            subject: 'NOTIF - '+sub+' - UnknownCryptoMiningBot',
            text: notif_strg
        };
        this.transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }

    test_notif(){
        var mailOptions = {
            from: 'dk7988@live.com',
            to: 'dk7988@live.com',
            subject: 'NOTIF - BOT SITR started - UnknownCryptoMiningBot',
            text: "this is a test email also BOT_SITR as started... the kids are being watched now -_-"
        };
        this.transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }

}

module.exports = bot_emailer;
