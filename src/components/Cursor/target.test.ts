import { afterEach, describe, expect, it } from 'vitest';
import { cursorStateFor } from './target';

const mount = (html: string) => {
  document.body.innerHTML = html;
  return document.getElementById('target');
};

describe('cursorStateFor', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is the default blob over plain content', () => {
    expect(cursorStateFor(mount('<p id="target">Text</p>'))).toEqual({ kind: 'default' });
  });

  it('grows over links and buttons, including their children', () => {
    expect(cursorStateFor(mount('<a href="#x"><span id="target">Go</span></a>'))).toEqual({
      kind: 'hover',
    });
    expect(cursorStateFor(mount('<button id="target">Go</button>'))).toEqual({ kind: 'hover' });
  });

  it('shows the label an ancestor declares with data-cursor', () => {
    expect(
      cursorStateFor(mount('<a href="#x" data-cursor="View"><img id="target" alt="" /></a>')),
    ).toEqual({ kind: 'label', label: 'View' });
  });

  it('ignores an empty data-cursor', () => {
    expect(cursorStateFor(mount('<a href="#x" data-cursor=" " id="target">Go</a>'))).toEqual({
      kind: 'hover',
    });
  });

  it('hands text inputs back to the native cursor', () => {
    expect(cursorStateFor(mount('<input id="target" />'))).toEqual({ kind: 'native' });
    expect(cursorStateFor(mount('<textarea id="target"></textarea>'))).toEqual({
      kind: 'native',
    });
    expect(cursorStateFor(mount('<input type="submit" id="target" />'))).toEqual({
      kind: 'hover',
    });
  });
});
