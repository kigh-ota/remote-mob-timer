import * as React from 'react';
import { secondToDisplayTime } from '../util';
import IEvent from '../../common/IEvent';

interface Props {
  events: IEvent[];
}

const EventHistory: React.SFC<Props> = props => {
  const items = props.events.map(e => <li>{JSON.stringify(e)}</li>);
  return <ul style={{ color: '#fff' }}>{items}</ul>;
};

export default EventHistory;
