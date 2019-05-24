# lsg-copy

`lsg-copy` will copy your globally installed packages with version pinning.

Developed with node@12

## Usage

```
lsg-copy v0.3.0

Usage:
  $ lsg-copy

Commands:
    Copy global packages to clipboard

For more info, run any command with the `--help` flag:
  $ lsg-copy --help

Options:
  --mgr <mgr>    Choose your package manager (npm | yarn) (default: npm)
  --pipe         Write contents to stdout instead of clipboard (default: false)
  -v, --version  Display version number
  -h, --help     Display this message
```

Check your clipboard :smiley:

## Tests

**Requirements:**

- `npm` is installed - I haven't tested aggressively against specific versions

Tests assume you have `npm` installed. The [noop3](https://www.npmjs.com/package/noop3) package is installed globally in case no packages are installed.
