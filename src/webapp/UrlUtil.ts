export function makeV1TimerUrl(endpoint: string) {
  return makeV1TimerUrlInternal(endpoint, window.location.href);
}

// export for testing
export function makeV1TimerUrlInternal(endpoint: string, href: string) {
  const url = new URL(href);
  const arr = url.pathname.split('/');
  const id =
    url.pathname.slice(-1) === '/' ? arr[arr.length - 2] : arr[arr.length - 1];
  return `${url.origin}/v1/timer/${id}/${endpoint}`;
}

export function makeTimerUrl(endpoint: string) {
  const url = new URL(window.location.href);
  const arr = url.pathname.split('/');
  const id =
    url.pathname.slice(-1) === '/' ? arr[arr.length - 2] : arr[arr.length - 1];
  return `${url.origin}/timer/${id}/${endpoint}`;
}
