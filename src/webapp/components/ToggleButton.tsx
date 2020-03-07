import * as React from 'react';
import { makeV1TimerUrl } from '../UrlUtil';

interface Props {
  getName: () => string;
  setSec: (sec: number) => void;
}

const ToggleButton: React.SFC<Props> = props => {
  return (
    <button
      style={{ marginTop: 10 }}
      onClick={e => {
        fetch(makeV1TimerUrl(`toggle?name=${props.getName()}`), {
          method: 'POST'
        })
          .then(res => res.json())
          .then(json => {
            props.setSec(json.time);
          });
      }}
    >
      TOGGLE start/stop
    </button>
  );
};

export default ToggleButton;
