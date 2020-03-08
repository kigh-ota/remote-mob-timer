import * as React from 'react';

interface Props {
  connected: boolean;
}

export default function ConnectionStatusReact(props: Props) {
  return (
    <div className="connection" style={{ marginTop: 20 }}>
      <span>
        {props.connected ? '' : 'Disconnected. Trying to reconnect...'}
      </span>
    </div>
  );
}
