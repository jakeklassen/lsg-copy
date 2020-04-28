const clipboardy = require('clipboardy');
const execa = require('execa');
const ms = require('ms');
const { messages } = require('./lib/messages');

jest.setTimeout(ms('60s'));

const BIN = './cli.js';

describe('lsg-copy', () => {
  beforeAll(async () => {
    await clipboardy.write('');
    await execa('npm', ['i', '-g', 'noop3@1000.0.0']);
  });

  afterAll(async () => {
    await execa('npm', ['uninstall', '-g', 'noop3']);
    await execa('npm', ['unlink']);
    await clipboardy.write('');
  });

  beforeEach(async () => {
    await clipboardy.write('');

    expect(await clipboardy.read()).toBe('');
  });

  it('should exit with no error if `--mgr=yarn`', async () => {
    const { failed, stdout } = await execa(BIN, ['--mgr', 'yarn']);

    expect(failed).toBe(false);
    expect(stdout).toMatch(messages.NO_YARN_SUPPORT);
  });

  it('should copy packages to clipboard', async () => {
    await execa(BIN);

    const clipboard = await clipboardy.read();

    expect(clipboard).toMatch(/noop3@1000\.0\.0/);
  });

  it('should not copy linked packages to clipboard', async () => {
    // link self
    await execa('npm', ['--no-package-lock', 'link']);
    await execa(BIN);
    await execa('npm', ['unlink']);

    const clipboard = await clipboardy.read();

    expect(clipboard).not.toMatch(/lsg-copy/gi);
  });

  it('should support --pipe', async () => {
    const { stdout } = await execa(BIN, ['--pipe']);

    expect(stdout).toMatch(/noop3@1000\.0\.0/);
    expect(await clipboardy.read()).toBe('');
  });
});
