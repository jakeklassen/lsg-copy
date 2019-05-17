#!/usr/bin/env node

const { cac } = require('cac');
const clipboardy = require('clipboardy');
const execa = require('execa');
const { messages } = require('./lib/messages');
const pkg = require('./package.json');

const cli = cac(pkg.name);

cli.version(pkg.version);

cli
  .command('', 'Copy global packages to clipboard')
  .option('--mgr <mgr>', 'Choose your package manager (npm | yarn)', {
    default: 'npm',
  })
  .option('--json', 'JSON output', { default: false })
  .action(async (/** @type {{ mgr: string }} */ options) => {
    try {
      const mgr = options.mgr.toLowerCase();

      if (mgr !== 'npm') {
        console.info(messages.NO_YARN_SUPPORT);
        process.exit(0);
      }

      // We don't want to copy linked packages
      const linked = await execa('npm', [
        'ls',
        '-g',
        '--json',
        '--link',
        '--depth=0',
      ])
        .then(({ stdout }) => JSON.parse(stdout).dependencies || {})
        .then(dependencies => Object.getOwnPropertyNames(dependencies));

      if (linked.length > 0) {
        console.log(`Ignoring ${linked.length} linked package(s)`);
      }

      const packages = await execa('npm', ['ls', '-g', '--json', '--depth=0'])
        .then(({ stdout }) => JSON.parse(stdout).dependencies || {})
        .then(dependencies =>
          Object.entries(dependencies)
            .filter(([name]) => linked.includes(name) === false)
            .map(([name, metadata]) => `${name}@${metadata.version}`)
            .join(' '),
        );

      await clipboardy.write(packages);

      console.log(
        `${
          packages.split(' ').length
        } package(s) successfully copied to clipboard`,
      );
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  });

cli.help();

cli.parse();
