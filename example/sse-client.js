var EventSource = require('..')
var es = new EventSource('http://localhost:1234/sse')
es.addEventListener('server-time', function (e) {
  console.log(e.data)
})
