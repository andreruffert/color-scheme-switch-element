import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ColorSchemeSwitchElement } from '../src/color-scheme-switch-element.js';
import {
  createElement,
  createMatchMediaController,
  mountElement,
  setPersistedValue,
} from './utils.js';

const TAG_NAME = 'test-color-scheme-switch';
const STORAGE_KEY = 'color-scheme';

let matchMediaController;

beforeEach(() => {
  document.body.replaceChildren();
  localStorage.clear();

  matchMediaController = createMatchMediaController();

  vi.spyOn(window, 'matchMedia').mockReturnValue(matchMediaController.mediaQueryList);

  ColorSchemeSwitchElement.define(TAG_NAME);
});

afterEach(() => {
  document.body.replaceChildren();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('ColorSchemeSwitchElement', () => {
  describe('define()', () => {
    test('defines the element in the provided registry', () => {
      const registry = new CustomElementRegistry();
      const tagName = 'another-color-scheme-switch';

      const result = ColorSchemeSwitchElement.define(tagName, registry);

      expect(result).toBe(ColorSchemeSwitchElement);
      expect(registry.get(tagName)).toBe(ColorSchemeSwitchElement);
    });
  });

  describe('value', () => {
    test.each(['light', 'dark'])('accepts %s', (value) => {
      const element = mountElement();

      element.value = value;

      expect(element.value).toBe(value);
    });

    test('rejects an invalid value', () => {
      const element = mountElement();

      element.value = 'light';

      expect(() => {
        element.value = 'system';
      }).toThrow(new TypeError('Invalid color scheme "system". Expected "light" or "dark".'));

      expect(element.value).toBe('light');
    });

    test('does not dispatch when the value does not change', () => {
      const element = mountElement({ value: 'light' });
      const handler = vi.fn();

      element.addEventListener('color-scheme-switch', handler);

      element.value = 'dark';
      element.value = 'dark';

      expect(handler).toHaveBeenCalledTimes(1);
    });

    test('dispatches a bubbling CustomEvent when the value changes', () => {
      const parent = document.createElement('div');
      const element = createElement();

      parent.append(element);
      document.body.append(parent);

      const handler = vi.fn();

      parent.addEventListener('color-scheme-switch', handler);

      element.value = 'dark';

      expect(handler).toHaveBeenCalledTimes(1);

      const [event] = handler.mock.calls[0];

      expect(event).toBeInstanceOf(CustomEvent);
      expect(event.bubbles).toBe(true);
      expect(event.target).toBe(element);
    });
  });

  describe('initial value', () => {
    test('follows the light system preference by default', () => {
      matchMediaController.setMatches(false);

      const element = mountElement();

      expect(element.value).toBe('light');
    });

    test('follows the dark system preference by default', () => {
      matchMediaController.setMatches(true);

      const element = mountElement();

      expect(element.value).toBe('dark');
    });

    test('prefers persisted value over the system preference', () => {
      setPersistedValue('light');
      matchMediaController.setMatches(true);

      const element = mountElement();

      expect(element.value).toBe('light');
    });

    test('prefers persisted value over the value attribute', () => {
      setPersistedValue('dark');

      const element = mountElement({
        value: 'light',
      });

      expect(element.value).toBe('dark');
    });

    test('uses the value attribute when no valid persisted value exists', () => {
      const element = mountElement({
        value: 'dark',
      });

      expect(element.value).toBe('dark');
    });

    test('falls back to the system preference for an invalid value attribute', () => {
      matchMediaController.setMatches(true);

      const element = mountElement({
        value: 'invalid',
      });

      expect(element.value).toBe('dark');
    });

    test('falls back to the system preference for an invalid persisted value', () => {
      setPersistedValue('invalid');
      matchMediaController.setMatches(true);

      const element = mountElement();

      expect(element.value).toBe('dark');
    });
  });

  describe('accessibility', () => {
    test('defaults role to button', () => {
      const element = mountElement();

      expect(element).toHaveAttribute('role', 'button');
    });

    test('preserves an explicit role', () => {
      const element = mountElement({
        role: 'switch',
      });

      expect(element).toHaveAttribute('role', 'switch');
    });

    test('defaults tabindex to 0', () => {
      const element = mountElement();

      expect(element).toHaveAttribute('tabindex', '0');
    });

    test('preserves an explicit tabindex', () => {
      const element = mountElement({
        tabindex: '-1',
      });

      expect(element).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('getSystemColorScheme()', () => {
    test.each([
      [false, 'light'],
      [true, 'dark'],
    ])('returns %s for a %s system preference', (matches, expected) => {
      matchMediaController.setMatches(matches);

      const element = mountElement();

      expect(element.getSystemColorScheme()).toBe(expected);
    });
  });

  describe('toggle()', () => {
    test.each([
      ['light', 'dark'],
      ['dark', 'light'],
    ])('toggles %s to %s', (current, expected) => {
      const element = mountElement({
        value: current,
      });

      element.toggle();

      expect(element.value).toBe(expected);
    });

    test('persists a value different from the system preference', () => {
      matchMediaController.setMatches(false);

      const element = mountElement({
        value: 'light',
      });

      element.toggle();

      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });

    test('removes persistence when the selected value matches the system preference', () => {
      matchMediaController.setMatches(false);
      setPersistedValue('dark');

      const element = mountElement();

      element.toggle();

      expect(element.value).toBe('light');
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    test('dispatches a change event', () => {
      const element = mountElement({
        value: 'light',
      });
      const handler = vi.fn();

      element.addEventListener('color-scheme-switch', handler);

      element.toggle();

      expect(handler).toHaveBeenCalledTimes(1);
    });

    test('does nothing when disabled', () => {
      const element = mountElement({
        value: 'light',
        disabled: '',
      });
      const handler = vi.fn();

      element.addEventListener('color-scheme-switch', handler);

      element.toggle();

      expect(element.value).toBe('light');
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('click', () => {
    test('toggles the value', () => {
      const element = mountElement({
        value: 'light',
      });

      element.click();

      expect(element.value).toBe('dark');
    });

    test('does not toggle when disabled', () => {
      const element = mountElement({
        value: 'light',
        disabled: '',
      });

      element.click();

      expect(element.value).toBe('light');
    });
  });

  describe('keyboard', () => {
    test.each([
      ['Enter', 'Enter'],
      ['Space', ' '],
    ])('toggles on %s and prevents the default action', (_name, key) => {
      const element = mountElement({
        value: 'light',
      });

      const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
      });

      element.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(element.value).toBe('dark');
    });

    test('ignores unrelated keys', () => {
      const element = mountElement({
        value: 'light',
      });

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      });

      element.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
      expect(element.value).toBe('light');
    });

    test('does not toggle when disabled', () => {
      const element = mountElement({
        value: 'light',
        disabled: '',
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });

      element.dispatchEvent(event);

      expect(element.value).toBe('light');
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('system preference changes', () => {
    test('updates when the system preference changes without a persisted preference', () => {
      matchMediaController.setMatches(false);

      const element = mountElement();

      expect(element.value).toBe('light');

      matchMediaController.setMatches(true);

      expect(element.value).toBe('dark');
    });

    test('updates in both directions', () => {
      matchMediaController.setMatches(true);

      const element = mountElement();

      expect(element.value).toBe('dark');

      matchMediaController.setMatches(false);

      expect(element.value).toBe('light');
    });

    test('ignores system changes when a valid preference is persisted', () => {
      setPersistedValue('light');
      matchMediaController.setMatches(false);

      const element = mountElement();

      matchMediaController.setMatches(true);

      expect(element.value).toBe('light');
    });

    test('continues following the system when persisted value is invalid', () => {
      setPersistedValue('invalid');
      matchMediaController.setMatches(false);

      const element = mountElement();

      expect(element.value).toBe('light');

      matchMediaController.setMatches(true);

      expect(element.value).toBe('dark');
    });
  });

  describe('lifecycle', () => {
    test('removes interaction listeners when disconnected', () => {
      const element = mountElement({
        value: 'light',
      });

      element.remove();

      element.click();

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
        }),
      );

      expect(element.value).toBe('light');
    });

    test('removes the system preference listener when disconnected', () => {
      const removeEventListener = vi.spyOn(
        matchMediaController.mediaQueryList,
        'removeEventListener',
      );

      const element = mountElement();

      element.remove();

      expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    test('stops following system changes while disconnected', () => {
      const element = mountElement({
        value: 'light',
      });

      element.remove();

      matchMediaController.setMatches(true);

      expect(element.value).toBe('light');
    });

    test('resumes following system changes after reconnecting', () => {
      matchMediaController.setMatches(false);

      const element = mountElement();

      element.remove();

      matchMediaController.setMatches(true);

      expect(element.value).toBe('light');

      document.body.append(element);

      expect(element.value).toBe('dark');
    });
  });
});
