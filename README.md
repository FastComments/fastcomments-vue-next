# fastcomments-vue-next

> A Vue 3.0 library for FastComments, a fast and developer friendly comment system.

[![NPM](https://img.shields.io/npm/v/fastcomments-vue-next.svg)](https://www.npmjs.com/package/fastcomments-vue-next) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

### NPM

```bash
npm install --save fastcomments-vue-next
```

### Yarn

```bash
yarn add fastcomments-vue-next
```

## Usage

### The Comment Widget

The FastCommentsVueNext component contains the live FastComments comment widget.

Replace "demo" below with your "tenantId" - available [here](https://fastcomments.com/auth/my-account/get-acct-code) in the FastComments admin area.

The widget supports a lot of options - see FastCommentsConfig [here](https://github.com/FastComments/fastcomments-typescript/blob/eae973fb7885de4df58b21b7a22a3e40c89feefa/src/fastcomments-config.ts#L14).

```vue
<template>
  <FastComments v-bind:config="{tenantId: 'demo'}" />
</template>
<script>
import { FastComments } from 'fastcomments-vue-next'
export default {
  name: 'FastCommentsExample',
  components: {
    FastComments
  }
}
</script>
```

## Updating The Current Page (SPA Example)

In FastComments we call the article id, or page the comments get tied to, the URL ID as it can be a url or an ID.
Define the URL ID in the following manner. The component watches for changes in config object, and will reload, so you can update the URL ID.

```vue
<FastComments v-bind:config="{tenantId: 'demo', urlId: 'some-page-id'}" />
```

## All Widgets and Documentation

Run the local documentation:

```bash
npm run serve
```

## Contributing
Please checkout our [contribution guidelines](CONTRIBUTING.md) before starting on a change. Remember to communicate first!

## License

MIT © [winrid](https://github.com/winrid)
