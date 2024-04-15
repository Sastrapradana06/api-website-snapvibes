var admin = require("firebase-admin");
// require('dotenv').config();

var serviceAccount = require("../insatagram-app-firebase-adminsdk-codqg-1fac91efa5.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://insatagram-app.appspot.com',
});


module.exports = {admin};
