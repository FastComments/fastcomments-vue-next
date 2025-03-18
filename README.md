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

Replace "demo" below with your "tenantId" - available [here](https://fastcomments.com/auth/my-account/api) in the FastComments admin area.

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
<FastComments v-bind:config="{tenantId: 'demo', url: 'https://example.com/somepage', urlId: 'some-page-id'}" />
```

### Account Region (ATTENTION: EU Customers)

If your account is located in the EU, set `region = 'eu'` in the widget configuration, for example:

```vue
<FastComments v-bind:config="{tenantId: 'demo', url: 'https://example.com/somepage', urlId: 'some-page-id', region: 'eu'}" />
```

Otherwise, you do not have to define `region`.

## In Production

You probably don't want to define the config inline if you're passing callbacks etc. Instead, you'll want to define
the config via `computed()`, otherwise each time your callback etc is invoked the entire widget will re-render.

## All Widgets and Documentation

Run the local documentation:

```bash
npm run serve
```

## Contributing
Please check out our [contribution guidelines](CONTRIBUTING.md) before starting on a change. Remember to communicate first!

## License

MIT © [winrid](https://github.com/winrid)
