import { WebSocket } from "ws";
import { OptionValues } from "commander";

interface ChatMessage {
  type: "message" | "notification";
  message: string;
}

function connectToServer(commandOptions: OptionValues) {
  const port: number = Number(commandOptions.port);
  const PORT = port || 5000;
  const socket = new WebSocket(`ws://localhost:${PORT}`);

  //Check whether the connection happened
  socket.on("open", () => {
    console.log("Connected to the server!");

    socket.send(JSON.stringify("I am sending this message to the server"));
  });

  socket.on("message", (data: string) => {
    const message: ChatMessage = JSON.parse(data);
    if (message.type === "notification") {
      console.log(`[Notification]: ${message.message}`);
    } else if (message.type === "message") {
      console.log(`[User]: ${message.message}`);
    }
  });

  socket.on("onerror", (error) => {
    console.log(`Error: ${error}`);
  });
}

export default connectToServer;
