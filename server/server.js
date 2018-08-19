const express = require('express');
const path = require('path');
const app = express();

const clientPath = __dirname + '/client';

app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath + '/index.html'));
});

app.use('/css', express.static(clientPath + '/css'));
app.use('/js', express.static(clientPath + '/js'));
app.use('/res', express.static(clientPath + '/res'));

app.listen(8888, () => {
  console.log('Server listening on port 8888!')
});
