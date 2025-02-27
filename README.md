# &lt;color-scheme-switch&gt; element

> A custom element to toggle between a light and dark color scheme.

[![Test status](https://img.shields.io/github/actions/workflow/status/andreruffert/color-scheme-switch-element/test.yml?label=Test&logo=github&color=lightyellow&labelColor=212121)](https://github.com/andreruffert/color-scheme-switch-element/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/color-scheme-switch-element?color=lightyellow&labelColor=212121)](https://www.npmjs.com/package/color-scheme-switch-element)
[![gzip size](https://img.shields.io/badge/gzip-846B-lightyellow?labelColor=212121)](https://pkg-size.dev/color-scheme-switch-element@latest)
[![npm downloads](https://img.shields.io/npm/dm/color-scheme-switch-element?logo=npm&color=lightyellow&labelColor=212121)](https://www.npmjs.com/package/color-scheme-switch-element)

## Features

- Toggle between a light and dark color scheme
- Considers system preference
- Persist user preference

**[Demo](https://andreruffert.github.io/syntax-highlight-element)**

## Installation

```shell
npm install color-scheme-switch-element
```

## Usage

### JavaScript

```html
<script>
  // Ensure the event listener is setup before the initial `color-scheme-switch` event gets dispatched.
  document.addEventListener('color-scheme-switch', event => {
    const colorScheme = event.target.value;

    // Set the page color scheme e.g
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    // ...
  });
</script>
<script type="module" async blocking="render" src="https://unpkg.com/color-scheme-switch-element@latest/dist/color-scheme-switch-element.js"></script>
```

<!--
Import as ES module:

```js
import ColorSchemeSwitchElement from 'color-scheme-switch-element?define=false'

// Ensure the event listener is setup before the initial `color-scheme-switch` event gets dispatched.
document.addEventListener('color-scheme-switch', event => {
  const colorScheme = event.target.value;

  // Set the page color scheme e.g
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  // ...
});

ColorSchemeSwitchElement.define();
```
-->

### Markup

```html
<color-scheme-switch title="Toggle light & dark color scheme">
  <!-- ... -->
</color-scheme-switch>
```

### Events

When initially loaded or after switching the color scheme, a `color-scheme-switch` event is dispatched from the `<color-scheme-switch>` element.

```js
document.addEventListener('color-scheme-switch', event => {
  const button = event.target;
  const colorScheme = event.target.value;

  // Set page color scheme, update aria-label, icon, etc.
})
```

## License

Distributed under the MIT license. See LICENSE for details. 

© [André Ruffert](https://andreruffert.com)
