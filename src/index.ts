import 'reflect-metadata';

import express from 'express';
import * as dotenv from 'dotenv'
import WebSocket from "ws";
import jwt from 'jsonwebtoken';
import {useContainer, useExpressServer} from "routing-controllers";
import cors from 'cors';
import {Container} from "typeorm-typedi-extensions";

import {setupWebsocket} from "./sockets/sockets";
import {createVoice} from "./voice";
import {connectDatabase} from "./database";
import {verifyHeader} from "./auth";

dotenv.config();

const app = express();

app.use(cors());

async function main() {
  useContainer(Container);
  const db = await connectDatabase();

  useExpressServer(app, {
    currentUserChecker: async (action) => {
      return verifyHeader(action.request.headers['authorization']);
    },
    controllers: [__dirname + '/controllers/**/*.js'],
  });

  const wss = new WebSocket.Server({
    noServer: true,
  });
  setupWebsocket(wss);

  // await db.synchronize(true);
  // const { router } = await createVoice();
  // console.log(JSON.stringify(router.rtpCapabilities, null, 2));
  const server = app.listen(5000, () => {
    console.log('listening on port 5000');
  });
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
      wss.emit('connection', socket, request);
    });
  });
}

main().then();
