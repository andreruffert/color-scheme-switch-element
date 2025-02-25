const DEFAULT_TAG_NAME = 'color-scheme-switch';
const DEFAULT_STORAGE_KEY = 'color-scheme';

export class ColorSchemeSwitchElement extends HTMLElement {
  static define(tagName = DEFAULT_TAG_NAME, registry = customElements) {
    if (!registry.get(tagName)) {
      registry.define(tagName, ColorSchemeSwitchElement);
    }
    return ColorSchemeSwitchElement;
  }

  #value;

  get value() {
    return this.#value;
  }

  set value(newPreference) {
    this.setAttribute('value', newPreference);
    this.#value = newPreference;
    localStorage.setItem(DEFAULT_STORAGE_KEY, newPreference);
    this.dispatchEvent(new CustomEvent('color-scheme-switch', { bubbles: true }));
  }

  constructor() {
    super();
    const systemColorScheme = this.getSystemColorScheme();
    const pageColorScheme = this.getPageColorScheme();
    const isSystem = pageColorScheme === 'light dark';
    const defaultValue = isSystem ? systemColorScheme : pageColorScheme;
    const persistedValue = localStorage.getItem(DEFAULT_STORAGE_KEY);
    this.value = this.getAttribute('value') || persistedValue || defaultValue;
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    this.addEventListener('click', this.toggle);
    this.addEventListener('focus', this.#focusHandler);
    this.addEventListener('blur', this.#blurHandler);
  }

  #focusHandler = () => {
    this.addEventListener('keydown', this.#keyboardHandler);
  };

  #blurHandler = () => {
    this.removeEventListener('keydown', this.#keyboardHandler);
  };

  #keyboardHandler = (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  };

  getPageColorScheme() {
    const computedStyle = window.getComputedStyle(document.documentElement);
    const pageColorScheme = computedStyle.getPropertyValue('color-scheme');
    return pageColorScheme;
  }

  getSystemColorScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggle() {
    if (this.disabled) return;

    const currentPreference = this.#value;
    const newPreference = currentPreference === 'dark' ? 'light' : 'dark';
    this.value = newPreference;
  }
}
