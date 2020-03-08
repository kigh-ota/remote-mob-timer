import IEvent from '../../common/IEvent';
import ExpressClientPool from './ExpressSseClientPool';
import log from '../Logger';
import ServerEventSender from '../sse/ServerEventSender';

export default class ExpressServerEventSender implements ServerEventSender {
  public send(event: IEvent, clientPool: ExpressClientPool) {
    const dataString = JSON.stringify(event.data);
    const payload = `event: ${event.type}\ndata: ${dataString}\n\n`;
    log.info(
      `sendServerEvent(): ${payload.replace(/\n/g, ' ')} (id=${event.id})`
    );
    clientPool.forEach(client => {
      client.response.write(payload);
    });
  }
}
