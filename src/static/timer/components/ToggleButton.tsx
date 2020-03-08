import * as React from 'react';
import { makeV1TimerUrl } from '../UrlUtil';

interface Props {
  getName: () => string;
  setSec: (sec: number) => void;
}

export default function ToggleButton(props: Props) {
  return (
    <button
      style={{ marginTop: 10 }}
      onClick={() => {
        fetch(makeV1TimerUrl(`toggle?name=${props.getName()}`), {
          method: 'POST',
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
}
