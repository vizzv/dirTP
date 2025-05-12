const {packet,packetStore} = require('./utils/packet')
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const fs = require('fs');
const path = require('path');
const PORT = 12345;
//const RC_ADDR = "192.168.2.231";
const RC_ADDR = "192.168.9.21";


const FILE_PATH = path.join(__dirname, 'testImage.png');


const PACKET_SIZE = 1024;

// Read file and send metadata
fs.readFile(FILE_PATH, (err, data) => {
  if (err) return console.error('Read error:', err);

  const totalPackets = Math.ceil(data.length / PACKET_SIZE);
  const metadata = new packet("pk0",0,{filename:'testImage.png',totalPackets:totalPackets},0,1);

  const message = Buffer.from(JSON.stringify(metadata));
  server.send(message, PORT, RC_ADDR , (err) => {
    if (err) console.error('Send error:', err);
    else console.log('Metadata sent, waiting for ACK...');
  });
});

// Listen for ACK
server.on('message', (msg) => {
  const ack = JSON.parse(msg.toString());
console.log(ack);
  if (ack  && ack.type==3) {
    console.log('ACK received. Ready to send file data...');
    server.close();
  }
});