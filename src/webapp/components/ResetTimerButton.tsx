import * as React from 'react';
import { makeV1TimerUrl } from '../UrlUtil';

interface Props {
  min: number;
  getName: () => string;
}

export default function ResetButton(props: Props) {
  return (
    <button
      style={{ marginRight: 6 }}
      onClick={() => {
        fetch(
          makeV1TimerUrl(`reset?sec=${props.min * 60}&name=${props.getName()}`),
          {
            method: 'POST',
          }
        );
      }}
    >{`${props.min}-min`}</button>
  );
}
