import { ColorSchemeSwitchElement } from './color-scheme-switch-element';

export { ColorSchemeSwitchElement };
export default ColorSchemeSwitchElement;

if (!new URL(import.meta.url).searchParams.has('define', 'false')) {
  window.ColorSchemeSwitchElement = ColorSchemeSwitchElement.define();
}
