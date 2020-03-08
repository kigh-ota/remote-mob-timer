import React from 'react';
import Notifier from './Notifier';

interface AppContextInterface {
  notifier: Notifier;
  bellSound: HTMLAudioElement;
  clickSound: HTMLAudioElement;
  chimeSound: HTMLAudioElement;
}

const AppContext = React.createContext<AppContextInterface>(
  {} as AppContextInterface
);

export default AppContext;
