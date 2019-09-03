import * as React from 'react';
import { makeUrl } from '../UrlUtil';

interface Props {
  min: number;
  getName: () => string;
}

const ResetButton: React.SFC<Props> = props => {
  return (
    <button
      style={{ marginRight: 6 }}
      onClick={e => {
        fetch(makeUrl(`reset?sec=${props.min * 60}&name=${props.getName()}`), {
          method: 'POST'
        });
      }}
    >{`${props.min}-min`}</button>
  );
};

export default ResetButton;
