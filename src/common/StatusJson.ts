import ClientInfo from './ClientInfo';
import IEvent from './IEvent';

export default interface StatusJson {
  timer: {
    time: number;
    nClient: number;
    isRunning: boolean;
  };
  clients: { [clientId: number]: ClientInfo };
  eventHistory: IEvent[];
}
