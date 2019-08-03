import * as React from 'react';
import IEvent from '../../common/IEvent';
import { List } from 'antd';

interface Props {
  events: IEvent[];
}

const EventHistory: React.SFC<Props> = props => {
  return (
    <List
      size="small"
      dataSource={props.events}
      renderItem={e => <List.Item>{JSON.stringify(e)}</List.Item>}
      bordered
    />
  );
};

export default EventHistory;
