import * as React from 'react';

interface Props {
  name: string;
  setName: (name: string) => void;
}

export default function NameInput(props: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <label htmlFor="name-input">NAME:</label>
      <input
        type="text"
        id="name-input"
        style={{ fontSize: 'medium' }}
        onChange={e => props.setName(e.target.value)}
        value={props.name}
      />
    </div>
  );
}
