import * as React from 'react';
import { secondToDisplayTime } from '../util';

interface Props {
  sec: number;
}

const TimeDisplay: React.SFC<Props> = props => {
  return (
    <div style={{ fontSize: 'xx-large' }}>{secondToDisplayTime(props.sec)}</div>
  );
};

export default TimeDisplay;
