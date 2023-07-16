var nodemailer = require('nodemailer');

//'UnknownCryptoMiningBot@outlook.com'
//'UnknownCryptoMining@outlook.com'
//
//'Winter2020'

class bot_emailer{
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
              user: 'dk7988@live.com',
              pass: 'iforget'
            }
            // user: 'UnknownCryptoMiningBot@outlook.com',
            // pass: 'Winter2020'
          });
    }


    send_notif(notif_strg){
        var mailOptions = {
            from: 'dk7988@live.com',
            to: 'dk7988@live.com',
            subject: 'NOTIF - UnknownCryptoMiningBot',
            text: notif_strg
        };
        //from: 'UnknownCryptoMiningBot@outlook.com',
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
        //from: 'UnknownCryptoMiningBot@outlook.com',
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
        //from: 'UnknownCryptoMiningBot@outlook.com',
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
