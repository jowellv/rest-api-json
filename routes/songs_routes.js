'use strict';

var Song = require('../models/Song');
var bodyparser = require('body-parser');
var fs = require('fs');

module.exports = function(router) {
  router.use(bodyparser.json()); // req.body will become a json object; acts on every request

  //create Song
  router.post('/songs', function(req, res) {
    var newSong = new Song(req.body.title, req.body.artist);
    fs.readdir("data", function(err, list) {
      if (err) {
        console.log(err);
        return res.status(500).json('server dun messed up');
      }
      var id = list.length + 1;
      // newSong._id = id;
      fs.writeFile("data/song" + id + ".json", JSON.stringify(newSong), function(err) {
        if (err) {
          console.log(err);
          return res.status(500).json('server dun messed up');
        }
        return res.json(newSong);
      });
    });
  });

  router.get('/songs', function(req, res) {
    fs.readdir("data", function(err, list) {
      if(err) {
        console.log(err);
        return res.status(500).json('server dun messed up');
      }
      var result = [];
      var filesAdded = 0;
      list.forEach(function(file) {
        if(file !== '.DS_Store')  {
          fs.readFile('data/' + file, function(err, data) {
            if(err) {
              console.log(err);
              return res.status(500).json('server dun messed up');
            }
            filesAdded++;
            result.push(data.toString());
            if(filesAdded === list.length) {
              res.json(result);
            }
          });
        } else {
          if(filesAdded === list.length) {
            res.json(result);
          }
          filesAdded++;
        }
      });
    });
  });

  router.put('/songs/:id', function(req, res) {
    var updatedSong = req.body;
    fs.writeFile('data/song' + req.params.id + '.json', JSON.stringify(updatedSong), function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json('server dun messed up');
      }
      res.json({msg:'success'});
    });
  });

  router.delete('/songs/:id', function(req, res) {
    fs.unlink('data/song' + req.params.id + '.json', function(err) {
      if(err) {
        console.log(err);
        return res.status(500).json('server dun messed up');
      }
      res.json({msg:'success'});
    });
  });

};
