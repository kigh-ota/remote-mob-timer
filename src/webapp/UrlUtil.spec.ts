import { makeUrlInternal } from './UrlUtil';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('makeUrlInternal', () => {
  it('works with trailing slash', () => {
    expect(
      makeUrlInternal('hoge.json', 'https://example.com:3000/123/')
    ).to.equal('https://example.com:3000/123/hoge.json');
  });

  it('works without trailing slash', () => {
    expect(
      makeUrlInternal('hoge.json', 'https://example.com:3000/123')
    ).to.equal('https://example.com:3000/123/hoge.json');
  });
});
