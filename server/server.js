
const express = require('express');


const app = express();
const connectDB=require("./config/db.config");
connectDB();
app.use(express.json())
app.use('/api/users', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth',require('./routes/auth'));
app.get('/', (req, res) => {
  res.status(200).json('Hello World!');
});

app.listen(8080, () => {
  console.log('Example app listening on port 8080');
});