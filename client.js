const { packet, packetStore, PACKET_TYPE } = require('./utils/packet')
const dgram = require('dgram');
const crypto = require('crypto');
const { error } = require('console');

const socket = dgram.createSocket('udp4');
const BASE_PORT = 12345;
const BROADCAST_ADDR = '255.255.255.255';
const store = new packetStore();
const peers = new Set();
const PACKET_SIZE = 1024;

const SESSION_ID = generateId();

socket.on('message', (msg, rinfo) => {
  try {
    const packet = JSON.parse(msg.toString());
    switch (packet.type) {
      case PACKET_TYPE.DISCOVERY:
        handleDiscovery(packet, rinfo);
        break;
      case PACKET_TYPE.DISCOVERY_ACK:
        addPeerId(rinfo);
        break;
      default:
        console.log(`${packet.type} is not implemented`)
        break;
    }
  }
  catch (e) {
    console.log('Invalid packet received', e.message);
  }
})

socket.bind(BASE_PORT, () => {
  console.log(`Client started on port ${BASE_PORT}`);
  sendDiscovery();
})

function sendDiscovery() {
  const pkt = new packet(generateId(), 0, 'DISCOVERY', 1, PACKET_TYPE.DISCOVERY);
  pkt.senderId = SESSION_ID;
  const msg = Buffer.from(JSON.stringify(pkt));
  socket.setBroadcast(true);
  socket.send(msg, 0, msg.length, BASE_PORT, BROADCAST_ADDR);
  console.log('Sent discovery');
}

function generateId() {
  return crypto.randomUUID();
}

function handleDiscovery(pkt, rinfo) {

  if (pkt.senderId === SESSION_ID) {
    console.log("in  session")
    //return;
  }
  const peerId = `${rinfo.address}:${rinfo.port}`;
  addPeerId(rinfo)



  const ackPacket = new packet(generateId(), 0, 'DISCOVERY_ACK', 1, PACKET_TYPE.DISCOVERY_ACK);
  ackPacket.senderId = SESSION_ID;


  //const ackPacket = new packet(generateId(), 0, 'DISCOVERY_ACK', 1, PACKET_TYPE.DISCOVERY_ACK);
  console.log("hmm")
  //ackPacket.senderId = SESSION_ID;

  const msg = Buffer.from(JSON.stringify(ackPacket));
  socket.send(msg, 0, msg.length, rinfo.port, rinfo.aaddress);

}

function addPeerId(rinfo) {
  const peerId = `${rinfo.address}:${rinfo.port}`;
  if (!peers.has(peerId)) {
    peers.add(peerId);
    console.log(`Discovered new Peer`);
  }
}
