const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from service 1');
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server1 running on http://localhost:3000');
});