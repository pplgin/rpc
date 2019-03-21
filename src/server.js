const net = require('net')
const { EventEmitter } = require('events')
const RPCPacket = require('./utils/packet')


module.exports = class RPCServer extends EventEmitter {
  constructor({ port }) {
    super()
    this.options = {
      port,
    }
    this.services = {} // 支持方法
    this.clients = new Map()
    this.packet = new RPCPacket({
      headLength: 10
    })
  }

  /**
   * 注册方法
   * @param {方法名} serviceName 
   */
  register(serviceName, body) {
    if (this.services[serviceName]) {
      throw new Error('服务已存在!')
    }
    this.services[serviceName] = body
  }

  handleSocket(socket) {
    let guid = Math.random().toString(36).substring(2)
    this.clients.set(guid, socket)
    console.log(`client-${guid} connection success!`)
    socket.on('data', data => this.handleRequest(data, guid))
    socket.on('end', () => {
      console.log(`client-${guid} disconnection!`)
      this.clients.delete(guid)
    })
  }

  async handleRequest(buf, clientsId) {
    if (!buf.length) return
    const req = this.packet.decode(buf)
    const { requestId, payload } = req
    const { service, method, args } = payload
    if (this.services[service] && this.services[service][method]) {
      let buf = this.packet.encode({
        type: 1,
        reqId: requestId,
        codec: 1,
        payload: await this.services[service][method](...args)
      })
      this.clients.get(clientsId).write(buf)
    }
  }

  handleError(err) {
    console.log(JSON.stringify(err))
  }

  start() {
    const { port = 1337 } = this.options
    const server = net.createServer()
    server.on('connection', socket => this.handleSocket(socket))
    server.on('error', err => this.handleError(err))
    server.listen(port, '127.0.0.1', () => {
      this.emit('ready')
    })
    return this
  }
}