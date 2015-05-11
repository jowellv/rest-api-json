'use strict';

require('../server');

var mocha = require('mocha');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);
var Song = require('../models/Song');
var fs = require('fs');

describe('song REST api', function() {
  after(function(done) {
    fs.readdir("data", function(err, list) {
      if(err) throw err;
      var result = [];
      var filesAdded = 0;
      list.forEach(function(file) {
        fs.unlink('data/' + file, function(err) {
          if(err) throw err;
        });
      });
    });
    done();
  });
  it('should create a new song', function(done) {
    chai.request('localhost:3000')
      .post('/api/songs')
      .send({title:'No no no', artist:'A pink'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.artist).to.eql('A pink');

        done();
      });
  });

  it('should return an array of songs yo', function(done) {
    chai.request('localhost:3000')
      .get('/api/songs')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);

        done();
      });
  });
  describe('it requires a file to work with', function() {
    beforeEach(function(done){
        var testSong = {title:'Mr. Chu', artist:'A pink'};
        fs.writeFile("data/song999.json", JSON.stringify(testSong), function(err) {
        if(err) throw err;
        this.testSong = testSong;
        done();
      }.bind(this));
    });

      it('should update a song', function() {
        chai.request('localhost:3000')
          .put('/api/songs/999')
          .send({title:'new title', artist:'new artist'})
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('success');
          });
      });

      it('should patch a song', function() {
        chai.request('localhost:3000')
          .patch('/api/songs/999')
          .send({title:'new title', artist:'new artist'})
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('success');
          });
      });

    it('should delete a song', function(done) {
      chai.request('localhost:3000')
        .del('/api/songs/999')
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');

          done();
        });
    });
  });
});
