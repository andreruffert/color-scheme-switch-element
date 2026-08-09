const DEFAULT_TAG_NAME = 'color-scheme-switch';
const DEFAULT_STORAGE_KEY = 'color-scheme';
const DARK_COLOR_SCHEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const KEY_CODES = new Set([' ', 'Enter']);

const isColorScheme = (value) => value === 'light' || value === 'dark';

export class ColorSchemeSwitchElement extends HTMLElement {
  /**
   * Defines the custom element if it hasn't already been defined.
   *
   * @param {string} [tagName='color-scheme-switch']
   * @param {CustomElementRegistry} [registry=customElements]
   * @returns {typeof ColorSchemeSwitchElement}
   */
  static define(tagName = DEFAULT_TAG_NAME, registry = customElements) {
    if (!registry.get(tagName)) {
      registry.define(tagName, ColorSchemeSwitchElement);
    }

    return ColorSchemeSwitchElement;
  }

  #value;
  #systemPreference;

  /**
   * The currently active color scheme.
   *
   * @returns {'light'|'dark'}
   */
  get value() {
    return this.#value;
  }

  /**
   * Sets the currently active color scheme.
   *
   * @param {'light'|'dark'} value
   * @throws {TypeError} If the value is not a supported color scheme.
   */
  set value(value) {
    if (!isColorScheme(value)) {
      throw new TypeError(`Invalid color scheme "${value}". Expected "light" or "dark".`);
    }

    if (this.#value === value) return;

    this.#value = value;
    this.dispatchEvent(new CustomEvent('color-scheme-switch', { bubbles: true }));
  }

  connectedCallback() {
    this.#systemPreference = window.matchMedia(DARK_COLOR_SCHEME_MEDIA_QUERY);
    this.#systemPreference.addEventListener('change', this.#systemColorSchemeHandler);

    this.addEventListener('click', this.toggle);
    this.addEventListener('keydown', this.#keyboardHandler);

    this.value = this.#getInitialValue();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.toggle);
    this.removeEventListener('keydown', this.#keyboardHandler);

    this.#systemPreference?.removeEventListener('change', this.#systemColorSchemeHandler);
    this.#systemPreference = undefined;
  }

  /**
   * Toggles between the light and dark color schemes.
   */
  toggle = () => {
    if (this.hasAttribute('disabled')) return;

    const value = this.#value === 'dark' ? 'light' : 'dark';
    this.value = value;
    this.#persistValue(value);
  };

  /**
   * Returns the user's current system color scheme preference.
   *
   * @returns {'light'|'dark'}
   */
  getSystemColorScheme() {
    return this.#systemPreference.matches ? 'dark' : 'light';
  }

  /**
   * Determines the initial color scheme.
   *
   * A persisted user preference takes precedence over the declarative
   * `value` attribute, which falls back to the system preference.
   *
   * @returns {'light'|'dark'}
   */
  #getInitialValue() {
    const persistedValue = localStorage.getItem(DEFAULT_STORAGE_KEY);

    if (isColorScheme(persistedValue)) {
      return persistedValue;
    }

    const defaultValue = this.getAttribute('value');

    if (isColorScheme(defaultValue)) {
      return defaultValue;
    }

    return this.getSystemColorScheme();
  }

  /**
   * Persists a user-selected color scheme.
   *
   * Preferences matching the system scheme are removed so that
   * future system changes continue to be followed automatically.
   *
   * @param {'light'|'dark'} value
   */
  #persistValue(value) {
    if (value === this.getSystemColorScheme()) {
      localStorage.removeItem(DEFAULT_STORAGE_KEY);
    } else {
      localStorage.setItem(DEFAULT_STORAGE_KEY, value);
    }
  }

  #keyboardHandler = (event) => {
    if (!KEY_CODES.has(event.key)) return;

    event.preventDefault();
    this.toggle();
  };

  #systemColorSchemeHandler = (event) => {
    const persistedValue = localStorage.getItem(DEFAULT_STORAGE_KEY);

    if (isColorScheme(persistedValue)) return;

    this.value = event.matches ? 'dark' : 'light';
  };
}
