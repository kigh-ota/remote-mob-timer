import * as React from 'react';
import animals from '../animals';

interface Props {
  name: string;
  setName: (name: string) => void;
}

const NameInput: React.SFC<Props> = props => {
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
};

export default NameInput;
