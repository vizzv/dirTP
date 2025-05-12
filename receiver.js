const {packet,packetStore} = require('./utils/packet')
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

// Bind the server to a specific port and IP address
const PORT = 12345;  // Port to listen on
const HOST = '0.0.0.0';  // Bind to all available network interfaces (or specify an IP like '192.168.1.x')

// Bind the receiver to the port
server.bind(PORT, HOST, () => {
  console.log(`Receiver is listening on ${HOST}:${PORT}`);
});

// Listen for incoming messages

server.on('message', (msg, rinfo) => {
  const data = JSON.parse(msg.toString());
  console.log('Metadata received:', data);

  // Send ACK back
  const ack = Buffer.from(JSON.stringify(new packet("pk1",0,{for:data.packetId},0,3)));
  server.send(ack, rinfo.port, rinfo.address, () => {
    console.log('ACK sent to sender.');
  });
});