const RPCServer = require('./src/server')

const server = new RPCServer({
  port: 1337
})

server.start()


server.register('NodeTest', require('./services/test'))


server.on('ready', () => {
  console.log('server is running!')
})