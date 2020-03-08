import EventHistoryStore from '../event/EventHistoryStore';
import { Request, Response } from 'express';
import EventFactory from '../event/EventFactory';
import log from '../Logger';
import { TimerId } from '../../common/TimerId';
import SseClientPool from '../sse/SseClientPool';
import { SseClientId } from '../../common/SseClient';
import ExpressSseClient from './ExpressSseClient';

export default class ExpressSseClientPool implements SseClientPool {
  private id = 0;
  private clients: {
    [clientId: number]: ExpressSseClient;
  } = {};

  constructor(private readonly eventHistoryStore: EventHistoryStore) {}

  public add(data: { req: Request; res: Response }, timerId: TimerId) {
    (clientId => {
      const ip = data.req.ip;
      const userAgent = data.req.header('User-Agent');
      const client = {
        id: clientId as SseClientId,
        ip,
        userAgent,
        response: data.res,
      };
      this.clients[clientId] = client;
      log.info(`Registered client: clientId=${client.id}, timerId=${timerId}`);
      this.eventHistoryStore.add(
        EventFactory.clientRegistered(client, timerId)
      );
      data.req.on('close', () => {
        delete this.clients[clientId];
        log.info(`Unregistered client: id=${client.id}, timerId=${timerId}`);
        this.eventHistoryStore.add(
          EventFactory.clientUnregistered(client, timerId)
        );
      });
    })(++this.id);
  }

  public forEach(fn: (client: ExpressSseClient) => void) {
    for (const id in this.clients) {
      fn(this.clients[id]);
    }
  }

  public count() {
    return Object.keys(this.clients).length;
  }
}
