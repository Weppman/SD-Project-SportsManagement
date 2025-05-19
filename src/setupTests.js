import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};