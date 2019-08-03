import * as React from 'react';
import { secondToDisplayTime } from './util';

interface Props {
  sec: number;
}

const TimeDisplay: React.SFC<Props> = props => {
  return <div className="time-display">{secondToDisplayTime(props.sec)}</div>;
};

export default TimeDisplay;
