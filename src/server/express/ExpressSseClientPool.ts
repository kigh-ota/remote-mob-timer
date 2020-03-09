import EventHistoryStore from '../event/EventHistoryStore';
import { Request, Response } from 'express';
import EventFactory from '../event/EventFactory';
import log from '../Logger';
import { TimerId } from '../../common/TimerId';
import SseClientPool from '../sse/SseClientPool';
import SseClient from '../../common/SseClient';
import ExpressSseClient from './ExpressSseClient';

export default class ExpressSseClientPool implements SseClientPool {
  private id = 0;
  private clients: {
    [clientId: number]: SseClient;
  } = {};

  constructor(private readonly eventHistoryStore: EventHistoryStore) {}

  public add(data: { req: Request; res: Response }, timerId: TimerId) {
    (clientId => {
      const client = new ExpressSseClient(data.req, data.res);
      this.clients[clientId] = client;
      log.info(`Registered client: clientId=${clientId}, timerId=${timerId}`);
      this.eventHistoryStore.add(
        EventFactory.clientRegistered(client.getInfo(), timerId)
      );
      data.req.on('close', () => {
        delete this.clients[clientId];
        log.info(`Unregistered client: id=${clientId}, timerId=${timerId}`);
        this.eventHistoryStore.add(
          EventFactory.clientUnregistered(client.getInfo(), timerId)
        );
      });
    })(++this.id);
  }

  public forEach(fn: (client: SseClient) => void) {
    for (const id in this.clients) {
      fn(this.clients[id]);
    }
  }

  public count() {
    return Object.keys(this.clients).length;
  }
}
