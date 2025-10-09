const express = require('express')
const app = express()
const amqp = require('amqplib')

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
  console.log('Waiting for messages... (server2)')

  channel.consume(queue, msg => {
    if (msg !== null) {
      console.log(`Received: ${msg.content.toString()}`)
      channel.ack(msg)
    }
  })
}

app.get('/', async (req, res) => {
  await sendMessage('Message from service 2')
  res.send('Res from service 2')
})

initRabbitMQ().then(() => {
  consumeMessages()
  app.listen(3000, '0.0.0.0', () => {
    console.log('Server2 running on http://localhost:3000')
  })
})
