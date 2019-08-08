import * as React from 'react';
import IEvent from '../../common/IEvent';
import { EventType } from '../../common/IEvent';
import { secondToDisplayTime } from '../util';

interface Props {
  events: IEvent[];
}

const EventHistory: React.SFC<Props> = props => {
  const items = props.events
    .filter(e => Object.keys(eventTypeString).includes(e.type))
    .map(e => <Row event={e} />);
  return <table>{items}</table>;
};

const Row: React.SFC<{ event: IEvent }> = props => {
  const cellStyle = { padding: '0 5px' };
  return (
    <tr>
      <td style={cellStyle}>
        {UTCtoJSTDateString(props.event.date)
          .substr(0, 19)
          .replace('T', ' ')}
      </td>
      <td style={cellStyle}>{eventTypeString[props.event.type]}</td>
      <td style={cellStyle}>
        {props.event.type === EventType.TIMER_START ||
        props.event.type === EventType.TIMER_STOP
          ? `(${secondToDisplayTime(props.event.data.sec)}; ${
              props.event.data.name
            })`
          : ''}
      </td>
    </tr>
  );
};

const eventTypeString: { [eventType in EventType]?: string } = {
  start: 'Start',
  stop: 'Stop',
  over: 'Over'
};

function UTCtoJSTDateString(utcDateString: string) {
  const jstValue = new Date(utcDateString).getTime() + 9 * 60 * 60 * 1000;
  return new Date(jstValue).toISOString();
}

export default EventHistory;
