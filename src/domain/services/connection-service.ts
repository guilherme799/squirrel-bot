import "reflect-metadata";
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  WASocket,
  isJidBroadcast,
  isJidStatusBroadcast,
  isJidNewsletter,
  ConnectionState,
} from "baileys";
import path from "path";
import fs from "fs";
import { pino, destination } from "pino";
import { Service } from "typedi";
import NodeCache from "node-cache";
import { Boom, Output } from "@hapi/boom";
import { LoaderEventsService } from "./loader-events-service";
import { ConnectionStatus } from "../enums/connection-status-enum";
import { ConfigService } from "./config-service";
import { ConsoleService } from "./console-service";

@Service()
export class ConnectionService {
  private msgRetryCounterCache!: NodeCache;

  constructor(private loaderEvetnsServie: LoaderEventsService) {
    this.msgRetryCounterCache = new NodeCache();
  }

  public async connect(): Promise<void> {
    let { socket, saveCreds } = await this.buildSocket();
    this.registerEvents(socket, saveCreds);
  }

  private async buildSocket(): Promise<{
    socket: WASocket;
    saveCreds: () => Promise<void>;
  }> {
    let baileysFolder = path.resolve("./assets/baileys-auth");
    let { state, saveCreds } = await useMultiFileAuthState(baileysFolder);
    let { version } = await fetchLatestBaileysVersion();
    let logger = pino(
      { timestamp: () => `,"time":"${new Date().toJSON()}"` },
      destination({
        fd: fs.openSync(`${ConfigService.tempDir}/wa-logs.txt`, "a"),
      })
    );

    let socket: WASocket = makeWASocket({
      version,
      logger,
      defaultQueryTimeoutMs: undefined,
      retryRequestDelayMs: 5000,
      auth: state,
      shouldIgnoreJid: (jid) =>
        isJidBroadcast(jid) ||
        isJidStatusBroadcast(jid) ||
        isJidNewsletter(jid),
      keepAliveIntervalMs: 30000,
      maxMsgRetryCount: 5,
      markOnlineOnConnect: true,
      syncFullHistory: false,
      msgRetryCounterCache: this.msgRetryCounterCache,
      shouldSyncHistoryMessage: () => false,
    });

    await this.getPairingCode(socket);
    return { socket, saveCreds };
  }

  private async getPairingCode(socket: WASocket): Promise<void> {
    let { creds } = socket.authState;
    if (creds.registered && creds.pairingCode) {
      ConsoleService.logInfo(`Paring code: ${creds.pairingCode}`);
      return;
    }

    let phoneNumber = await ConsoleService.question(
      "Informe o número de telefone do bot: "
    );
    ConsoleService.logInfo(`Get paring code to phone number: ${phoneNumber}`);

    let paringCode = await socket.requestPairingCode(phoneNumber);
    ConsoleService.logInfo(`Paring code: ${paringCode}`);
  }

  private registerEvents(socket: WASocket, saveCreds: () => Promise<void>) {
    socket.ev.on("connection.update", async (updatedConnection) => {
      await this.onUpdateConnection(updatedConnection, socket);
    });

    socket.ev.on("creds.update", saveCreds);
  }

  private async onUpdateConnection(
    updatedConnection: Partial<ConnectionState>,
    socket: WASocket
  ) {
    let { connection, lastDisconnect } = updatedConnection;
    switch (connection) {
      case ConnectionStatus.open:
        ConsoleService.logSuccess("Bot succesfully connected");
        this.loaderEvetnsServie.load(socket);
        break;
      case ConnectionStatus.close:
        let error: Output = (lastDisconnect?.error as Boom<any>)?.output;
        ConsoleService.logError(
          `Socket disconnected. status code: ${error?.statusCode}, reason: ${error?.payload?.message}`
        );
        break;
    }
  }
}
