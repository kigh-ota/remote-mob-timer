import IEvent from '../../common/IEvent';
import ExpressClientPool from './ExpressClientPool';
import log from '../Logger';

export default class ExpressServerEvent {
  public static send(event: IEvent, clientPool: ExpressClientPool) {
    const dataString = JSON.stringify(event.data);
    const payload = `event: ${event.type}\ndata: ${dataString}\n\n`;
    log.info(
      `sendServerEvent(): ${payload.replace(/\n/g, ' ')} (id=${event.id})`
    );
    clientPool.forEach((id, res) => {
      res.write(payload);
    });
  }
}
