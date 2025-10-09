const express = require('express')
const amqp = require('amqplib')
const logger = require('./logger')
const requestId = require('./middleware/requestId')

const app = express()


app.use(requestId)


let connection
let channel
const queue = 'messages'

async function initRabbitMQ() {
  connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672')
  channel = await connection.createChannel()
  await channel.assertQueue(queue, { durable: false })
  console.log('RabbitMQ initialized')
}

async function sendMessage(msg) {
  if (!channel) {
    console.error('Channel not initialized!')
    return
  }

  channel.sendToQueue(queue, Buffer.from(msg))
  console.log(`Sent: ${msg}`)
}

async function consumeMessages() {
  console.log('Waiting for messages... (server1)')

  channel.consume(queue, msg => {
    if (msg !== null) {
      console.log(`Received: ${msg.content.toString()}`)
      channel.ack(msg)
    }
  })
}

app.get('/', async (req, res) => {
  logger.info({
    requestId: req.requestId,
    service: 'service1',
    message: 'Received GET / request'
  })
  await sendMessage('Message from service 1')
  res.send('Res from service 1')
})

initRabbitMQ().then(() => {
  consumeMessages()
  app.listen(3000, '0.0.0.0', () => {
    console.log('Server1 running on http://localhost:3000')
  })
})
