import * as React from 'react';
import IEvent, {
  StartEvent,
  StopEvent,
  GoodEvent,
} from '../../../common/IEvent';
import { EventType } from '../../../common/IEvent';
import { secondToDisplayTime } from '../util';

interface Props {
  events: IEvent[];
}

const eventTypeString: { [eventType in EventType]?: string } = {
  start: 'Start',
  stop: 'Stop',
  over: 'Over',
  good: 'Good!',
};

export default function EventHistory(props: Props) {
  const items = props.events
    .filter(e => Object.keys(eventTypeString).includes(e.type))
    .map((e, i) => <Row key={i} event={e} />);
  return <table>{items}</table>;
}

function UTCtoJSTDateString(utcDateString: string): string {
  const jstValue = new Date(utcDateString).getTime() + 9 * 60 * 60 * 1000;
  return new Date(jstValue).toISOString();
}

interface RowProps {
  event: IEvent;
}

function Row(props: RowProps) {
  const cellStyle = { padding: '0 5px' };
  let aux = '';
  switch (props.event.type) {
    case EventType.START: {
      const e = props.event as StartEvent;
      aux = `(${secondToDisplayTime(e.data.sec)}; ${e.data.userName})`;
      break;
    }
    case EventType.STOP: {
      const e = props.event as StopEvent;
      aux = `(${secondToDisplayTime(e.data.sec)}; ${e.data.userName})`;
      break;
    }
    case EventType.GOOD: {
      const e = props.event as GoodEvent;
      aux = `(${e.data.userName})`;
      break;
    }
  }
  return (
    <tr>
      <td style={cellStyle}>
        {UTCtoJSTDateString(props.event.date)
          .substr(0, 19)
          .replace('T', ' ')}
      </td>
      <td style={cellStyle}>{eventTypeString[props.event.type]}</td>
      <td style={cellStyle}>{aux}</td>
    </tr>
  );
}
