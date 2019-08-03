import * as React from 'react';

interface Props {
  min: number;
  getName: () => string;
}

const ResetButton: React.SFC<Props> = props => {
  return (
    <button
      onClick={e => {
        fetch(`/reset?sec=${props.min * 60}&name=${props.getName()}`, {
          method: 'POST'
        });
      }}
    >{`${props.min}-min`}</button>
  );
};

export default ResetButton;
