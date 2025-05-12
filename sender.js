const {packet,packetStore} = require('./utils/packet')
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

console.log("serevre started");
const p0 = new packet("pk0",0,"mydata");
const ps0 = new packetStore();
ps0.push(p0);

server.send(JSON.stringify(p0), 12345,"192.168.2.231",()=>{
	server.close();
});
//server.bind(12345);