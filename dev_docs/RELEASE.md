# Release Process

These are the steps take should be taken before releasing a new version.

> Valid for **nform** family libraries (i.e. not for utils)

- Run Tests

```bash
npm run test

npm run e2e
```

- Bump version & create changelog:

```bash
npm run stage-release
```

- Build Libraries

```bash
npm run build-lib
```

- Release to NPM

Run any of the relevant commands:

```bash
npm publish dist/@pebula/utils
npm publish dist/@pebula/metap
npm publish dist/@pebula/nform
npm publish dist/@pebula/nform-material
```

- Commit, Create Tag & Push

```bash
git tag -a -m "Version [VERSION]" [VERSION] master

git push origin master --tags
```

> Replace [VERSION] with version number

- Push documentation site build to **gh-pages**

```bash
npm run gh-pages
```

## Updating Related Repositories

Along with this repo, there are 2 more related repositories that require
adjustments after every new release.

1. There is a [StackBlitz](https://stackblitz.com/edit/pebula-nform-starter?file=app%2Fapp.component.ts)  demo is used to open GitHub tickets and to live demo the library by allowing users to play with the code easily.  
**On every new release, the dependencies in [package.json](https://stackblitz.com/edit/pebula-nform-starter?file=package.json) must be updated to reflect the new version**

2. There is a [GitHub Starter Repo](https://github.com/shlomiassaf/nform-material-starter) for `@pebula/nform` together with `@pebula/nform-material` which is used as a starter but also as a testing ground to see that the library compiles and works well with angular.  
**On every new release, the start repo should:**
  - Update the `package.json` and install the updated libraries
```bash
yarn add `@pebula/nform` `pebula/nform-material`
```

  - Initiate a `gh-pages` build and verify it works

```bash
# In root, for OSX and Linux
./gh-pages
```

## TODOs

The process is semi-automatic and can improve.

- Include other libraries in the process (i.e. `@pebula/utils`)
- Integrate in CI?
- Automate the production script
  - Auto-tag version
  - Auto push to remote
  - Auto build & publish
  - Before publish, build and test example github repo `nform-material-starter`?
