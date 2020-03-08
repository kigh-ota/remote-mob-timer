import IEvent from '../../common/IEvent';
import ClientPool from './ClientPool';
import log from '../Logger';

export default class ServerEvent {
  public static send(event: IEvent, clientPool: ClientPool) {
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
