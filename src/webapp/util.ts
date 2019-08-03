export function secondToDisplayTime(sec: number) {
  return (
    `${Math.floor(sec / 60)}`.padStart(2, '0') +
    ':' +
    `${sec % 60}`.padStart(2, '0')
  );
}
