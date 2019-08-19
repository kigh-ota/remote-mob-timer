import ClientInfo from '../common/ClientInfo';
import EventHistoryStore from './EventHistoryStore';
import { Request, Response } from 'express';
import EventFactory from './EventFactory';

export default class ClientPool {
  private id = 0;
  private clients: {
    [clientId: number]: ClientInfo & { response: Response };
  } = {};

  constructor(private readonly eventHistoryStore: EventHistoryStore) {}

  public add(request: Request, response: Response) {
    (id => {
      const ip = request.ip;
      const userAgent = request.header('User-Agent');
      const clientInfo = { ip, userAgent };
      this.clients[id] = {
        response,
        ip,
        userAgent
      };
      console.log(`Registered client: id=${id}`);
      this.eventHistoryStore.add(EventFactory.clientRegistered(clientInfo));
      request.on('close', () => {
        delete this.clients[id];
        console.log(`Unregistered client: id=${id}`);
        this.eventHistoryStore.add(EventFactory.clientUnregistered(clientInfo));
      });
    })(++this.id);
  }

  public forEach(
    fn: (
      id: number,
      reponse?: Response,
      ip?: string,
      userAgent?: string
    ) => void
  ) {
    for (let id in this.clients) {
      const c = this.clients[id];
      fn(Number(id), c.response, c.ip, c.userAgent);
    }
  }

  public count() {
    return Object.keys(this.clients).length;
  }
}
