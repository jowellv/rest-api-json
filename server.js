'use strict';

var express = require('express');
var app = express();

var songsRoutes = express.Router();

require('./routes/songs_routes')(songsRoutes);

app.use('/api', songsRoutes);

app.listen(process.env.PORT || 3000, function() {
  console.log('server up on port ' + (process.env.PORT || 3000));
});
