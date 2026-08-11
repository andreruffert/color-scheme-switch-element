# &lt;color-scheme-switch&gt; element

> A simple custom element to toggle between a light and dark page color scheme.

[![Test status](https://img.shields.io/github/actions/workflow/status/andreruffert/color-scheme-switch-element/test.yml?label=Test&logo=github&color=lightyellow&labelColor=212121)](https://github.com/andreruffert/color-scheme-switch-element/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/color-scheme-switch-element?color=lightyellow&labelColor=212121)](https://www.npmjs.com/package/color-scheme-switch-element)
[![gzip size](https://img.shields.io/badge/gzip-846B-lightyellow?labelColor=212121)](https://pkg-size.dev/color-scheme-switch-element@latest)
[![npm downloads](https://img.shields.io/npm/dm/color-scheme-switch-element?logo=npm&color=lightyellow&labelColor=212121)](https://www.npmjs.com/package/color-scheme-switch-element)
[![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/color-scheme-switch-element?color=lightyellow&labelColor=212121)](https://www.jsdelivr.com/package/npm/color-scheme-switch-element)

## Features

* Toggle between light and dark color schemes
* Respects the user's system color-scheme preference
* Automatically follows system preference changes
* Persists explicit user choices
* Keyboard accessible with <kbd>Enter</kbd> and <kbd>Space</kbd>
* No dependencies

**[Demo](https://andreruffert.github.io/color-scheme-switch-element)**

## Installation

Install the package from your command line.

```shell
npm install color-scheme-switch-element
```

## Usage

Add the custom element to your page and listen for the `color-scheme-switch` event. The event provides the currently active color scheme, which you can use to update your page accordingly.

### Setup

Register the event listener before the custom element is defined. This ensures the initial `color-scheme-switch` event is not missed when the element is registered.

```html
<script>
  document.addEventListener('color-scheme-switch', event => {
    // The currently active color scheme.
    const colorScheme = event.target.value;

    // Apply the active color scheme.
    document.documentElement.style.setProperty('color-scheme', colorScheme);

    // Update the accessible label to describe the action.
    event.target.setAttribute('aria-label', `Switch to ${colorScheme === 'light' ? 'dark' : 'light'} color scheme`)

    // ...
  });
</script>
```

Then load the custom element using a render-blocking module script.

```html
<script type="module" async blocking="render" src="https://cdn.jsdelivr.net/npm/color-scheme-switch-element/+esm"></script>
```

The [blocking="render"](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#blocking_rendering_till_a_script_is_fetched_and_executed) attribute prevents the page from rendering until the custom element has been registered. This helps prevent a flash of the wrong color scheme during page load.

### Markup

Add the custom element wherever you want the color-scheme switcher to appear.

```html
<color-scheme-switch title="Toggle light & dark color scheme">
  <!-- ... -->
</color-scheme-switch>
```

The element supports `light` and `dark` color schemes.

You can also provide an initial value declaratively:

```html
<color-scheme-switch value="dark">
  <!-- ... -->
</color-scheme-switch>
```

### Color scheme preference

The initial value is determined in the following order:

1. A valid persisted user preference from `localStorage`
2. The `value` attribute
3. The user's system preference (`prefers-color-scheme`)

The persisted preference is stored under the `color-scheme` localStorage key.

When the user toggles the element, their preference is persisted. If the selected scheme matches the current system preference, the persisted preference is removed so the component can continue following future system preference changes.

If there is no persisted user preference, changes to the system color scheme are automatically reflected by the element.

### Value

The current color scheme is available through the `value` property:

```js
const colorScheme = element.value;

element.value = 'dark';
```

Only `light` and `dark` are supported. Assigning any other value throws a `TypeError`.

Changing `value` updates the component state and dispatches a `color-scheme-switch` event. Programmatically assigning `value` does **not** persist the preference; persistence only occurs when the user toggles the element.

### Events

A `color-scheme-switch` event is dispatched when the element is initialized and whenever its value changes.

```js
document.addEventListener('color-scheme-switch', event => {
  const element = event.target;
  const colorScheme = element.value;

  // Set page color scheme, update aria-label, icon, etc.
});
```

The event bubbles, so it can be listened for on `document` or another ancestor.

Assigning the current value does not dispatch an event:

```js
element.value = element.value;
```

### Disabled

The element can be disabled using the `disabled` attribute:

```html
<color-scheme-switch disabled>
  <!-- ... -->
</color-scheme-switch>
```

When disabled, user-triggered toggles are ignored.

### Keyboard interaction

When focused, the element responds to:

* <kbd>Enter</kbd>
* <kbd>Space</kbd>

The element uses `role="button"` and `tabindex="0"` by default.

## License

Distributed under the MIT license. See LICENSE for details. 

© [André Ruffert](https://andreruffert.com)
