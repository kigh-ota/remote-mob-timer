export function secondToDisplayTime(sec: number): string {
  return (
    `${Math.floor(sec / 60)}`.padStart(2, '0') +
    ':' +
    `${sec % 60}`.padStart(2, '0')
  );
}

export function assert(expr: boolean): void {
  if (!expr) {
    throw new Error('assert');
  }
}
