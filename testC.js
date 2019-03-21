const RPCClient = require('./src/client')

const client = new RPCClient({
  port: 1337,
  host: '127.0.0.1'
})

client.run()

client.on('ready', async () => {
  let l = await client.invoke({
    service: 'NodeTest',
    method: 'test',
    args: [1]
  })

  // let l = await client.invoke({
  //   service: 'NodeTest',
  //   method: 'add',
  //   args: [1,3]
  // })
  console.log('result', l)
})