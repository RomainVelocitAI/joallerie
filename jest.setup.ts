// Extend expect with jest-dom matchers
import '@testing-library/jest-dom';

// Mock Next.js router
const mockRouter = {
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
};

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock next/head
jest.mock('next/head', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: function Head({ children }: { children?: any }) {
      return React.createElement(React.Fragment, null, children);
    },
  };
});

// Mock next/image
jest.mock('next/image', () => {
  const React = require('react');
  return function Image(props: any) {
    return React.createElement('img', props);
  };
});

// Mock next/link
jest.mock('next/link', () => {
  const React = require('react');
  return function Link({ href, children, ...props }: any) {
    return React.createElement('a', { ...props, href }, children);
  };
});

// Mock window.matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    }),
  });
}

// Mock window.scrollTo
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.scrollTo = () => {};
}
