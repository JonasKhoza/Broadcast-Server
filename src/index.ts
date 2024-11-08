#!/usr/bin/env node
import { Command } from "commander";
import startServer from "./server/server";
import connectToServer from "./client/client";

const program = new Command();

program
  .version("1.0.0")
  .description(
    "broadcast-server: A global command-line tool(CLI) allow clients to connect to it, send messages that will be broadcasted to all connected clients."
  );

program
  .command("start")
  .description("Start the server")
  .option("-p,--port <port>", "Server port")
  .action(startServer);

program
  .command("connect")
  .description("Connect to a websocket server")
  .option("-p, --port <port>", "Server port")
  .action(connectToServer);

program.parse(process.argv);
