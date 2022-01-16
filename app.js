//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
// const res = require('express/lib/response');
const https = require('https');
// const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us20.api.mailchimp.com/3.0/lists/d6471ada92';

  const options = {
    method: 'POST',
    auth: 'luthfan12:b55180a0165e585f5a43e60110039eda-us20',
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }

    response.on('data', function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', function (req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server is running on port 3000');
});

// const APIkey
// {"b55180a0165e585f5a43e60110039eda-us20"}

// list ID ;
// d6471ada92

// mailchimp.setConfig({
//   apiKey: 'b55180a0165e585f5a43e60110039eda-us20',
//   server: 'us20',
// });

// app.post('/', function (req, res) {
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const email = req.body.email;

//   const subscribingUser = {
//     firstName: firstName,
//     lastName: lastName,
//     email: email,
//   };

//   async function run() {
//     const response = await mailchimp.lists.addListMember('d6471ada92', {
//       email_address: subscribingUser.email,
//       status: 'subscribed',
//       merge_fields: {
//         FNAME: subscribingUser.firstName,
//         LNAME: subscribingUser.lastName,
//       },
//     });

//     //If all goes well logging the contact's id
//     res.sendFile(__dirname + '/success.html');
//     console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
//   }
// });
