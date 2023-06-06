const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});
app.use("/js", express.static(__dirname + "/js/"));
app.use("/img", express.static(__dirname + "/img/"));
app.use(
    "/io",
    express.static(__dirname + "/node_modules/socket.io/client-dist/")
);
server.listen(3000, () => {
    console.log("Server started on port 3000");
});