const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;

const homeRoute = require('./routes/homeRoute');
const postingRoute = require('./routes/postingRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute')
const statusRoute = require('./routes/statusRoute')

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });


app.use('/', homeRoute)
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/posting', postingRoute);
app.use('/status', statusRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})