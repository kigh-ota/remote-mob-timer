import * as React from 'react';
import { makeV1TimerUrl } from '../UrlUtil';

interface Props {
  getName: () => string;
}

export default function GoodButton(props: Props) {
  return (
    <button
      style={{ marginTop: 10 }}
      onClick={() => {
        fetch(makeV1TimerUrl(`good?name=${props.getName()}`), {
          method: 'POST',
        });
      }}
    >
      GOOD!
    </button>
  );
}
