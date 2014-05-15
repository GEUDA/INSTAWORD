var nodemailer = require('nodemailer');
var smtp_transport
  ;

smtp_transport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: 'pickmemo001@gmail.com',
    pass: 'G7xk4Ffu'
  }
});



exports.sendRegistrationUrl = function(email_address, token) {
  var option = {
    from: 'AGASTYA <info@mail.pickmemo.net>',
    to: email_address,
    subject: 'AGASTYA: USER REGISTRATION',
    html: '<h1>REGISTRATION URL</h1>'
      + '<p>User registration is not yet complete.<br>'
      + 'Please complete the registration by visiting the following URL.</p>'
      + '<p><a href="https://agastya.pw/sessions/register/' + token + '">https://agastya.pw/sessions/register/' + token + '</a></p>'
      + '<p>This address is valid for 3 hour from your application.</p>'
      + '<hr/>'
      + '<p>INSTAWORD: <a href="https://agastya.pw/">http://agastya.pw/</a></p>'
  };

  smtp_transport.sendMail(option, function(error, response) {
    if(error) {
      console.log(error);
    }
  });
};



exports.sendGroupRegistrationUrl = function(email_address, token, group_name, message) {
  var option = {
    from: 'Instaword <info@mail.pickmemo.net>',
    to: email_address,
    subject: 'Instaword: YOU WERE INVITED TO THE GROUP',
    html: '<h1>YOU WERE INVITED TO THE GROUP</h1>'
      + '<h2>MESSAGE</h2>'
      + '<p>' + message + '</p>'
      + '<h2>JOINING URL</h2>'
      + '<p>If you want to join the group, '
      + 'please complete the registration by visiting the following URL.</p>'
      + '<p><a href="http://pickmemo.net/instaword/groups/register/' + token + '">http://pickmemo.net/instaword/groups/register/' + token + '</a></p>'
      + '<p>This address is valid for 3 days from invitation.</p>'
      + '<h2>IF YOU ARE NOT REGISTRATION USER</h2>'
      + '<p>If you want to join the group, you need registration of INSTAWORD.</p>'
      + '<p><a href="http://pickmemo.net/instaword/">INSTAWORD</a></p>'
      + '<hr/>'
      + '<p>INSTAWORD: <a href="http://pickmemo.net/instaword/">http://pickmemo.net/instaword/</a></p>'
  };

  smtp_transport.sendMail(option, function(error, response) {
    if(error) {
      console.log(error);
    }
  });
};
