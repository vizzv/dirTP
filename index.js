const dirTpSocket = require("./client");

const client = dirTpSocket.createClient();

client.sendDiscovery();
// console.log(client.getPeers());
 client.sendFile("test.txt",IP OF RECIEVER WITH PORT );


// setTimeout(() => {
//     client.closeConnection();
// }, 5000);

