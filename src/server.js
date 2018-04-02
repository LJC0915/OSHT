const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(express.static('dist'));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./dist/index.html'));
});
server.listen(PORT, () => {
  console.log('Server Started. http://localhost:' + PORT);
});
