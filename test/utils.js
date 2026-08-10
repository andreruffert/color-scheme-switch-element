const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export function createMatchMediaController(initialMatches = false) {
  let matches = initialMatches;
  const listeners = new Set();

  const mediaQueryList = {
    get matches() {
      return matches;
    },

    media: DARK_MEDIA_QUERY,

    addEventListener(type, listener) {
      if (type === 'change' && listener) {
        listeners.add(listener);
      }
    },

    removeEventListener(type, listener) {
      if (type === 'change') {
        listeners.delete(listener);
      }
    },

    addListener() {},
    removeListener() {},
  };

  return {
    mediaQueryList,

    setMatches(nextMatches) {
      matches = nextMatches;

      const event = {
        matches: nextMatches,
        media: DARK_MEDIA_QUERY,
      };

      for (const listener of [...listeners]) {
        listener(event);
      }
    },
  };
}

export function createElement(attributes = {}) {
  const element = document.createElement(TAG_NAME);

  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      element.setAttribute(name, value);
    }
  }

  return element;
}

export function mountElement(attributes = {}) {
  const element = createElement(attributes);

  document.body.append(element);

  return element;
}

export function setPersistedValue(value) {
  localStorage.setItem(STORAGE_KEY, value);
}
