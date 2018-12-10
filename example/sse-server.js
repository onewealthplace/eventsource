const express = require('express')
const serveStatic = require('serve-static')
const SseStream = require('ssestream')

const {ConsumerGroup, KafkaClient} = require("kafka-node");
let kafkaUri = process.env["KAFKA_URI"] ? process.env["KAFKA_URI"] : 'localhost:9092';


let consumer = new ConsumerGroup({kafkaHost: kafkaUri, groupId: "sse-pull"}, ["server.events"]);
const app = express()
app.use(serveStatic(__dirname))
app.get('/sse', (req, res) => {
  console.log('new connection')

  const sseStream = new SseStream(req)
  sseStream.pipe(res)

  consumer.on('message', function (message) {
    console.log("WHAT" ,message);
    sseStream.write({
      event: 'server-time',
      data: message
    })
  });

  const pusher = setInterval(() => {
    sseStream.write({
      event: 'server-time',
      data: new Date().toTimeString()
    })
  }, 1000)

  res.on('close', () => {
    console.log('lost connection')
    clearInterval(pusher)
    sseStream.unpipe(res)
  })
})

app.listen(1234, (err) => {
  if (err) throw err
  console.log('server ready on http://localhost:8080')
})
