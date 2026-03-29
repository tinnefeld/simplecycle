import { getFtp, setFtp } from '../src/settings.js';

// Mock localStorage
let store = {};
const localStorageMock = {
  getItem: (key) => (key in store ? store[key] : null),
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { store = {}; },
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  store = {};
});

describe('getFtp', () => {
  test('returns 200 when nothing is stored', () => {
    expect(getFtp()).toBe(200);
  });

  test('returns stored value after setFtp', () => {
    setFtp(250);
    expect(getFtp()).toBe(250);
  });

  test('returns 200 if stored value is non-numeric garbage', () => {
    localStorage.setItem('ftp', 'abc');
    expect(getFtp()).toBe(200);
  });

  test('returns 200 if stored value is zero', () => {
    localStorage.setItem('ftp', '0');
    expect(getFtp()).toBe(200);
  });

  test('returns 200 if stored value is negative', () => {
    localStorage.setItem('ftp', '-50');
    expect(getFtp()).toBe(200);
  });
});

describe('setFtp', () => {
  test('saves a valid positive integer', () => {
    setFtp(300);
    expect(getFtp()).toBe(300);
  });

  test('accepts string representation of a valid integer', () => {
    setFtp('180');
    expect(getFtp()).toBe(180);
  });

  test('accepts boundary value 1', () => {
    setFtp(1);
    expect(getFtp()).toBe(1);
  });

  test('accepts boundary value 9999', () => {
    setFtp(9999);
    expect(getFtp()).toBe(9999);
  });

  test('throws on zero', () => {
    expect(() => setFtp(0)).toThrow();
  });

  test('throws on negative value', () => {
    expect(() => setFtp(-10)).toThrow();
  });

  test('throws on value above 9999', () => {
    expect(() => setFtp(10000)).toThrow();
  });

  test('throws on non-numeric string', () => {
    expect(() => setFtp('abc')).toThrow();
  });

  test('throws on empty string', () => {
    expect(() => setFtp('')).toThrow();
  });
});
