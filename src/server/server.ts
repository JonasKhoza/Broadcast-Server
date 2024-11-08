import express from "express";
import http from "http";
import {
  server as WebSocketServer,
  connection as WebSocketConnection,
} from "websocket";
import { OptionValues } from "commander";

interface ChatMessage {
  type: "message" | "notification";
  message: string;
}

function startServer(commandOptions: OptionValues) {
  const port: number = Number(commandOptions.port);
  const PORT = port || 5000;
  const app = express();

  //Craete an http server
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  //Create a websocket server from the http server
  const webSocketSever = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
  });

  //Store current connections
  const clients: WebSocketConnection[] = [];
  //On a connection request
  webSocketSever.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    console.log("A new user connected");
    //store connection
    clients.push(connection);

    //Broadcast the new connection to other clients
    broadcastMessage(
      clients,
      { type: "message", message: "A new user joined the chat!" },
      connection
    );

    //Receive a message from client
    // connection.on("message", (message) => {
    //   if (message.type === "utf8" && message.utf8Data) {
    //     const receivedMessage: ChatMessage = JSON.parse(message.utf8Data);
    //     console.log("Received message:", receivedMessage);

    //     // Broadcast the message to other clients
    //     broadcastMessage(
    //       clients,
    //       { type: "message", message: receivedMessage.message },
    //       connection
    //     );
    //   }
    // });

    //On client disconnection, send a message and remove the client
    connection.on("close", () => {
      console.log("A client has left the connection!");
    });
  });
}

function broadcastMessage(
  clients: WebSocketConnection[],
  message: ChatMessage,
  sender?: WebSocketConnection
) {
  console.log(message);
  clients.forEach((client) => {
    if (client !== sender) {
      client.sendUTF(JSON.stringify(message));
    }
  });
}

export default startServer;
