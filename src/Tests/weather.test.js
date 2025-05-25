import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherWidget from '../HomePage/weather';

beforeEach(() => {
  global.fetch = jest.fn();
});

const mockWeatherData = {
  main: { temp: 25, humidity: 60 },
  weather: [{ main: 'Clear', icon: '01d' }],
  wind: { speed: 3.4 },
};

const mockForecastData = {
  list: Array(40).fill(null).map((_, index) => ({
    dt: 1716220800 + index * 10800,
    main: { temp: 22 + index % 5 },
    weather: [{ main: 'Clouds', icon: '03d' }],
  })),
};

test('shows loading state initially', () => {
  render(<WeatherWidget />);
  expect(screen.getByText(/checking sherwood’s weather/i)).toBeInTheDocument();
});

test('renders weather and forecast data', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockForecastData,
    });

  render(<WeatherWidget />);

  await waitFor(() => {
    expect(screen.getByText(/weather – sherwood, durban/i)).toBeInTheDocument();
  });

  expect(screen.queryAllByText(/25°C/).length).toBeGreaterThan(0);
  expect(screen.getByText((content) => content.includes('Humidity: 60%'))).toBeInTheDocument();
  expect(screen.getByText((content) => content.includes('Wind: 3.4'))).toBeInTheDocument();
  const items = screen.getAllByRole('listitem');
  expect([4, 5]).toContain(items.length);
});

test('handles fetch errors gracefully', async () => {
  fetch.mockRejectedValueOnce(new Error('API error'));

  render(<WeatherWidget />);

  await waitFor(() => {
    expect(screen.getByText(/checking sherwood’s weather/i)).toBeInTheDocument();
  });
});
