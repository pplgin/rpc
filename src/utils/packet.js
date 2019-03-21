/**
 *  协议包编码
 */
module.exports = class RPCPacket {
  constructor({ headLength }) {
    this.options = {
      headLength: 10
    }
  }

  decode(buf) {
    const { headLength } = this.options
    const bodyLength = buf.readInt32BE(6)
    const body = buf.slice(headLength, headLength + bodyLength);
    return {
      type: buf[0],
      requestId: buf.readInt32BE(1),
      codec: buf.readInt32BE(5),
      bodyLength: buf.readInt32BE(6),
      payload: JSON.parse(body)
    }
  }

  encode({ type = 0, codec = 1, reqId, payload}) {
    const { headLength } = this.options
    let buf = Buffer.alloc(1024*1024)
    let offset = 0
    buf[0] = type// type =>  0 req 1 res
    buf.writeInt32BE(reqId, 1)
    buf[5] = codec; // codec => 1 JSON or  2 pb
    offset += headLength;
    const bodyLength = buf.write(JSON.stringify(payload), offset);
    buf.writeInt32BE(bodyLength, 6);
    offset += bodyLength;
    return buf.slice(0, offset); // 返回
  }
}