// Extend expect with jest-dom matchers
import '@testing-library/jest-dom';

// Mock Next.js router
const mockRouter = {
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isReady: true,
  isLocaleDomain: false,
  isPreview: false,
  isFallback: false,
  locale: 'en',
  locales: ['en'],
  defaultLocale: 'en',
  domainLocales: [],
  push: jest.fn().mockResolvedValue(true),
  replace: jest.fn().mockResolvedValue(true),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
  __esModule: true,
  default: {
    __esModule: true,
    useRouter: () => mockRouter,
  },
}));

// Mock next/head
jest.mock('next/head', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: function Head({ children }: { children: React.ReactNode }) {
      return <>{children}</>;
    },
  };
});

// Mock next/image
jest.mock('next/image', () => {
  const React = require('react');
  // eslint-disable-next-line react/display-name
  return function NextImage({
    src,
    alt,
    width,
    height,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    [key: string]: any;
  }) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };
});

// Mock window.matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}

// Mock ResizeObserver
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
}

// Mock IntersectionObserver
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  class IntersectionObserver {
    root: Element | null = null;
    rootMargin = '';
    thresholds: number[] = [];
    
    constructor() {}
    
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  
  window.IntersectionObserver = IntersectionObserver;
}

// Mock window.scrollTo
if (typeof window !== 'undefined') {
  window.scrollTo = jest.fn();
}
