import { AssertionError } from 'assert';

export function secondToDisplayTime(sec: number) {
  return (
    `${Math.floor(sec / 60)}`.padStart(2, '0') +
    ':' +
    `${sec % 60}`.padStart(2, '0')
  );
}

export function assert(expr: boolean) {
  if (!expr) {
    throw new Error('assert');
  }
}
