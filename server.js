const express = require('express');
const app = express();
const projectName = 'novax';

app.use(express.static(__dirname + '/dist/' + projectName));

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/dist/' + projectName + 'index.html');
});

var port = process.env.PORT || 80;
app.listen(port, function () {
  console.log('Server running on port %s', port);
});
