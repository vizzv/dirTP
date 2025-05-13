const dirTpSocket = require("./client");

const client = dirTpSocket.createClient();

client.sendDiscovery();
// console.log(client.getPeers());
// client.sendFile("test.txt");


// setTimeout(() => {
//     client.closeConnection();
// }, 5000);

