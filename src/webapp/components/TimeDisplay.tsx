import * as React from 'react';
import { secondToDisplayTime } from '../util';

interface Props {
  sec: number;
}

function TimeDisplay(props: Props) {
  return (
    <div style={{ fontSize: 'xx-large', margin: '0.67em 0' }}>
      {secondToDisplayTime(props.sec)}
    </div>
  );
}

export default TimeDisplay;
