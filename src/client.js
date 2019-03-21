const net = require('net')
const { EventEmitter } = require('events')
const RPCPacket = require('./utils/packet')


module.exports = class RPCClient extends EventEmitter {
  constructor({ port = 1337, host = '127.0.0.1' }) {
    super()
    this.options = {
      port,
      host
    }
    this.packet = new RPCPacket({
      headLength: 10
    })
  }

  handleResponse(buf, resolve) {
    if (!buf.length) return
    const res = this.packet.decode(buf)
    resolve(res)
  }

  handleError(err, reject) {
    console.log(JSON.stringify(err))
    reject(err)
  }

  invoke({ service, method, args = [] }) {
    return new Promise((resolve, reject) => {
      const packet = this.packet.encode({
        type: 0,
        reqId: 1,
        codec: 1,
        payload: {
          service,
          method,
          args
        }
      })
      this.client.write(packet)
      this.client.on('data', data => this.handleResponse(data, resolve))
      this.client.on('error', err => this.handleError(err, reject))
    })
  }

  run() {
    const { host, port } = this.options
    this.client = net.connect(port, host)
    this.client.on('connect', () => {
      this.emit('ready')
    })
    return this
  }
}