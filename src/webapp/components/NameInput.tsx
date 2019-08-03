import * as React from 'react';
import { secondToDisplayTime } from '../util';
import animals from '../animals';

const NameInput = () => {
  const savedName = window.localStorage.getItem('name');
  const initialName = savedName || randomName();
  const [name, setName] = React.useState(initialName);
  window.localStorage.setItem('name', name);

  return (
    <div style={{ marginTop: 20 }}>
      <label htmlFor="name-input">NAME:</label>
      <input
        type="text"
        id="name-input"
        onChange={e => {
          setName(e.target.value);
          window.localStorage.setItem(
            'name',
            (e.target as HTMLInputElement).value
          );
        }}
        value={name}
      ></input>
    </div>
  );
};

function randomName() {
  const i = Math.floor(Math.random() * Math.floor(animals.length));
  return animals[i];
}

export default NameInput;
