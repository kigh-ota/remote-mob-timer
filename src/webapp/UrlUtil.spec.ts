import { makeV1TimerUrlInternal } from './UrlUtil';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('makeUrlInternal', () => {
  it('works with trailing slash', () => {
    expect(
      makeV1TimerUrlInternal('hoge.json', 'https://example.com:3000/123/')
    ).to.equal('https://example.com:3000/v1/timer/123/hoge.json');
  });

  it('works without trailing slash', () => {
    expect(
      makeV1TimerUrlInternal('hoge.json', 'https://example.com:3000/123')
    ).to.equal('https://example.com:3000/v1/timer/123/hoge.json');
  });
});
