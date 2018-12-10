var EventSource = require('..')
var es = new EventSource('http://localhost:1234/sse')


var NATS = require('nats');

var servers = ['nats://localhost:4222'];

// Randomly connect to a server in the cluster group.
// var nats = nats.connect({'servers': servers});

// currentServer is the URL of the connected server.
var nats = NATS.connect();
console.log("Connected to " + nats.currentServer.url.host);

// Simple Publisher


// Simple Subscriber
nats.subscribe('foo', function(msg) {
  console.log('Received a message: ' + msg);
});

es.addEventListener('server-time', function (e) {


  nats.publish('foo', e.data);

  console.log(e.data)
})
