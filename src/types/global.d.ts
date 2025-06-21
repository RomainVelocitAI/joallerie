// Déclarations globales pour les tests

// Déclaration des types pour Jest
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toHaveClass(...classNames: string[]): R;
    toHaveAttribute(attr: string, value?: any): R;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
    toBeInTheDOM(container?: HTMLElement | SVGElement): R;
    toHaveStyle(css: string): R;
    toHaveFocus(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeEmptyDOMElement(): R;
    toBeInViewport(): R;
    toContainElement(element: HTMLElement | SVGElement | null): R;
    toContainHTML(htmlText: string): R;
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
    toHaveFormValues(expectedValues: Record<string, any>): R;
    toBePartiallyChecked(): R;
    toHaveValue(value?: string | string[] | number): R;
  }
}

// Déclaration des types pour les objets globaux
interface Window {
  ResizeObserver: typeof ResizeObserver;
  IntersectionObserver: typeof IntersectionObserver;
  scrollTo: (x: number, y: number) => void;
  matchMedia: (query: string) => MediaQueryList;
}

// Déclaration pour les modules
// Permet d'importer des fichiers CSS, SVG, etc. dans les tests
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.avif' {
  const content: string;
  export default content;
}

// Déclaration pour les fichiers de test
declare const jest: {
  fn: (implementation?: Function) => jest.Mock;
  mock: (moduleName: string, factory?: any, options?: any) => void;
  clearAllMocks: () => void;
  resetAllMocks: () => void;
  restoreAllMocks: () => void;
  spyOn: (object: any, method: string) => jest.Mock;
  setMock: (moduleName: string, moduleExports: any) => void;
  requireActual: (moduleName: string) => any;
  requireMock: (moduleName: string) => any;
  resetModules: () => void;
  enableAutomock: () => void;
  disableAutomock: () => void;
  deepUnmock: (moduleName: string) => void;
  unmock: (moduleName: string) => void;
  doMock: (moduleName: string, factory?: any, options?: any) => void;
  dontMock: (moduleName: string) => void;
  genMockFromModule: (moduleName: string) => any;
  createMockFromModule: (moduleName: string) => any;
  isMockFunction: (fn: Function) => boolean;
  replaceProperty: (object: object, property: string, value: any) => void;
  retryTimes: (numRetries: number) => void;
  setTimeout: (timeout: number) => void;
  useFakeTimers: (config?: any) => void;
  useRealTimers: () => void;
  advanceTimersByTime: (msToRun: number) => void;
  advanceTimersToNextTimer: (steps?: number) => void;
  clearAllTimers: () => void;
  getTimerCount: () => number;
  runAllTicks: () => void;
  runAllTimers: () => void;
  runOnlyPendingTimers: () => void;
  setSystemTime: (now?: number | Date) => void;
  getRealSystemTime: () => number;
};

// Déclaration des types pour les mocks de Jest
interface Mock<T = any> extends Function, MockInstance<T> {
  new (...args: any[]): T;
  (...args: any[]): any;
}

interface MockInstance<T = any> {
  mock: MockContext<T>;
  mockClear(): void;
  mockReset(): void;
  mockRestore(): void;
  mockImplementation(fn: Function): Mock<T>;
  mockImplementationOnce(fn: Function): Mock<T>;
  mockName(name: string): Mock<T>;
  mockReturnThis(): Mock<T>;
  mockReturnValue(value: any): Mock<T>;
  mockReturnValueOnce(value: any): Mock<T>;
  mockResolvedValue(value: any): Mock<Promise<any>>;
  mockResolvedValueOnce(value: any): Mock<Promise<any>>;
  mockRejectedValue(value: any): Mock<Promise<any>>;
  mockRejectedValueOnce(value: any): Mock<Promise<any>>;
  getMockName(): string;
  mock: {
    calls: any[][];
    instances: T[];
    results: Array<{ type: 'return' | 'throw'; value: any }>;
  };
}

interface MockContext<T> {
  calls: any[][];
  instances: T[];
  invocationCallOrder: number[];
  results: Array<{ type: 'return' | 'throw'; value: any }>;
  lastCall?: any[];
}

// Déclaration pour les tests globaux
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: (done?: jest.DoneCallback) => void, timeout?: number) => void;
declare const test: (name: string, fn: (done?: jest.DoneCallback) => void, timeout?: number) => void;
declare const expect: jest.Expect;
declare const beforeAll: (fn: (done?: jest.DoneCallback) => void | Promise<unknown>, timeout?: number) => void;
declare const afterAll: (fn: (done?: jest.DoneCallback) => void | Promise<unknown>, timeout?: number) => void;
declare const beforeEach: (fn: (done?: jest.DoneCallback) => void | Promise<unknown>, timeout?: number) => void;
declare const afterEach: (fn: (done?: jest.DoneCallback) => void | Promise<unknown>, timeout?: number) => void;
