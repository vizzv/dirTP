const { packet, packetStore, PACKET_TYPE } = require('./utils/packet')
const dgram = require('dgram');
const crypto = require('crypto');
const { error } = require('console');
const { get } = require('http');

const socket = dgram.createSocket('udp4');
const BASE_PORT = 12345;
const BROADCAST_ADDR = '255.255.255.255';
const store = new packetStore();
const peers = new Set();
const PACKET_SIZE = 1024;

  
  

const createClient = () => {
  const SESSION_ID = generateId();
  console.log("sessionId",SESSION_ID)
  socket.on('message', (msg, rinfo) => {
    try {
      const packet = JSON.parse(msg.toString());
      console.log('Received packet:', packet);
      switch (packet.type) {
        case PACKET_TYPE.DISCOVERY:
          handleDiscovery(packet, rinfo);
          break;
        case PACKET_TYPE.DISCOVERY_ACK:
          if (packet.receiverId === SESSION_ID) {
            addPeerId(rinfo);
          }
          break;
	  case PACKET_TYPE.META:
          if(packet.isInstruction) {
	    
          switch(packet.instructionType) {
		case("SEND_FILE"):
			const data = {fileName:packet.data.fileName,senderId:packet.data.senderId};
			console.log("rcv meta file sending packet",data);
			//TODO : support for storing this info and send METS acknoledge.
		  break;
		deafault:
		  console.log("Invalid 	Instuction Type in meta packet");
		  break;
		}
		  
	    }


          break;
        default:
          console.log(`${packet.type} is not implemented`)
          console.log('Received fraud packet:', packet);
          //socket.close();
          break;
      }
    }
    catch (e) {
      console.log('Invalid packet received', e.message);
    }
  })

  socket.bind(BASE_PORT, () => {
    socket.setBroadcast(true);
    sendDiscovery();
    socket.setBroadcast(false);
  })



  return {
    socket,
    SESSION_ID,
    sendDiscovery,
    sendFile,
    closeConnection:()=>{
      console.log("closing connection")
      socket.close();
    },
    getPeers: () => {
      return Array.from(peers);
    }
  };

    function sendDiscovery() {
    const pkt = new packet(generateId(), 0, 'DISCOVERY', 1, PACKET_TYPE.DISCOVERY);
    pkt.senderId = SESSION_ID;
    const msg = Buffer.from(JSON.stringify(pkt));
    socket.send(msg, 0, msg.length, BASE_PORT, BROADCAST_ADDR);
  }

  function generateId() {
    return crypto.randomUUID();
  }

  function handleDiscovery(pkt, rinfo) {

    if (pkt.senderId === SESSION_ID) {
      return;
    }
    const peerId = `${rinfo.address}:${rinfo.port}`;
    addPeerId(rinfo)

    const ackPacket = new packet(generateId(), 0, 'DISCOVERY_ACK', 1, PACKET_TYPE.DISCOVERY_ACK);
    ackPacket.senderId = SESSION_ID;
    ackPacket.receiverId = pkt.senderId;
    const msg = Buffer.from(JSON.stringify(ackPacket));
    socket.send(msg, 0, msg.length, rinfo.port, rinfo.address);

  }

  function addPeerId(rinfo) {
    const peerId = `${rinfo.address}:${rinfo.port}`;
    if (!peers.has(peerId)) {
      peers.add(peerId);
    }
  }

  function sendFile(filePath,peerIp) {
    const fs = require('fs');
    const fileSize = fs.statSync(filePath).size;
    const fileStream = fs.createReadStream(filePath);

    const fileName = filePath.split('/').pop();
    const data = {fileName:fileName,senderId:SESSION_ID};
    const metaPacket = new packet(generateId(), 0, data, 1, PACKET_TYPE.META);
    metaPacket.isInstruction = true;
    metaPacket.instructionType = "SEND_FILE"
    const msg = Buffer.from(JSON.stringify(metaPacket));
    console.log('Sending file:', fileName);
    const [receiverIp,receiverPort] = peerIp.split(":");
    socket.send(msg,0,msg.length,receiverPort,receiverIp);
  }

}

module.exports.createClient = createClient;
