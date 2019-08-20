export function makeUrl(endpoint: string) {
  return makeUrlInternal(endpoint, window.location.href);
}

// export for testing
export function makeUrlInternal(endpoint: string, href: string) {
  const url = new URL(href);
  const arr = url.pathname.split('/');
  const id =
    url.pathname.slice(-1) === '/' ? arr[arr.length - 2] : arr[arr.length - 1];
  return `${url.origin}/${id}/${endpoint}`;
}
