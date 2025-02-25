import { ColorSchemeSwitchElement } from './color-scheme-switch-element';

export { ColorSchemeSwitchElement };
export default ColorSchemeSwitchElement;

window.ColorSchemeSwitchElement = ColorSchemeSwitchElement;

if (!new URL(import.meta.url).searchParams.has('define', 'false')) {
  ColorSchemeSwitchElement.define();
}
