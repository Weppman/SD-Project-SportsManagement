import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Facilities from '../Venues/facilities';
import { useUser } from '../UserContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

beforeEach(() => {
  fetch.resetMocks();
  useUser.mockReturnValue({ userType: 'admin' });
});

afterEach(() => {
  jest.clearAllMocks();
});
const mockFacilityData = [
  {
    id: '1',
    Name: 'Indoor Court',
    Quantity: 2,
    Capacity: { Players: 10, Spectators: 100 },
    Description: 'A nice indoor court',
    indoorOutdoor: 'Indoor',
    imagePath: '/images/indoor-court.png',
  },
  {
    id: '2',
    Name: 'Outdoor Field',
    Quantity: 1,
    Capacity: { Players: 22, Spectators: 500 },
    Description: 'Large outdoor field',
    indoorOutdoor: 'Outdoor',
    imagePath: '/images/outdoor-field.png',
  },
];

test('shows loading indicator', async () => {
  fetch.mockResponseOnce(() => new Promise(() => {}));

  render(
    <MemoryRouter>
      <Facilities />
    </MemoryRouter>
  );
  expect(screen.getByText(/Loading facilities/i)).toBeInTheDocument();
});

test('shows error on fetch fail', async () => {
  fetch.mockRejectOnce(new Error('API is down'));

  render(
    <MemoryRouter>
      <Facilities />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.getByText(/Failed to load facilities/i)).toBeInTheDocument());
  expect(screen.getByText('Failed to load facilities: API is down')).toBeInTheDocument();
});

test('displays indoor and outdoor facilities correctly', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockFacilityData));

  render(
    <MemoryRouter>
      <Facilities />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.queryAllByText('Indoor Court').length).toBe(2));

  const indoorCourtElements = screen.getAllByText('Indoor Court');
  expect(indoorCourtElements.length).toBe(2);
  const outdoorFieldElements = screen.getAllByText('Outdoor Field');
  expect(outdoorFieldElements.length).toBe(2);
  expect(screen.getByText(/Players - 10/i)).toBeInTheDocument();
  expect(screen.getByText(/Players - 22/i)).toBeInTheDocument();
});

test('renders fallbacks for missing values', async () => {
  const incompleteData = [{
    id: '3',
    Name: null,
    Quantity: null,
    Capacity: null,
    Description: null,
    indoorOutdoor: null,
    imagePath: null,
  }];

  fetch.mockResponseOnce(JSON.stringify(incompleteData));
  render(
    <MemoryRouter>
      <Facilities />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.queryAllByText('Unnamed Facility').length).toBe(2));

  expect(screen.getByText(/No description available/)).toBeInTheDocument();
  expect(screen.getByAltText('Unnamed Facility').src).toContain('/images/default-facility.png');
});

test('opens and closes image modal', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockFacilityData));

  render(
    <MemoryRouter>
      <Facilities />
    </MemoryRouter>
  );

  const image = await screen.findByAltText('Indoor Court');
  
  fireEvent.click(image);

  const modal = screen.getByRole('img', { name: 'Enlarged View' });
  expect(modal).toBeInTheDocument();

  expect(modal.src).toContain('/images/indoor-court.png');

  fireEvent.click(screen.getByRole('img', { name: 'Enlarged View' }).closest('section'));

  await waitFor(() => 
    expect(screen.queryByRole('img', { name: 'Enlarged View' })).not.toBeInTheDocument()
  );
});

test('renders summary table correctly', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockFacilityData));

   render(
    <MemoryRouter>
      <Facilities />
    </MemoryRouter>
  );

  await screen.findByText('Facility Summary'); 
  await screen.findAllByText('Indoor Court');
  const indoorCourtElements = screen.getAllByText('Indoor Court');
  expect(indoorCourtElements.length).toBe(2);
  const outdoorFieldElements = screen.getAllByText('Outdoor Field');
  expect(outdoorFieldElements.length).toBe(2);
  expect(screen.getByText('10')).toBeInTheDocument();
  expect(screen.getByText('500')).toBeInTheDocument();
});

test('displays jump links and footer', async () => {
  fetch.mockResponseOnce(JSON.stringify([]));

  render(
    React.createElement(MemoryRouter, null, React.createElement(Facilities))
  );

  const links = screen.getAllByRole('link');
  const linkTexts = links.map(link => link.textContent);

  expect(linkTexts).toEqual(
    expect.arrayContaining([
      'Go to Indoor Facilities',
      'Go to Outdoor Facilities',
      'View Summary Table',
      'Maps'
    ])
  );

  expect(screen.getByText(/©/)).toBeInTheDocument();
});

test('opens and closes image modal on facility image and map image clicks', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockFacilityData));

  render(
    <MemoryRouter>
      <Facilities />
    </MemoryRouter>
  );

  const indoorCourtImage = await screen.findByAltText('Indoor Court');
  const outdoorFieldImage = await screen.findByAltText('Outdoor Field');
  const indoorMapImage = screen.getByAltText('Indoor Facility Map');
  const outdoorMapImage = screen.getByAltText('Outdoor Facility Map');

  fireEvent.click(indoorCourtImage);
  fireEvent.click(outdoorFieldImage);

  const modal = screen.getByRole('img', { name: 'Enlarged View' });
  expect(modal).toBeInTheDocument();

  fireEvent.click(indoorMapImage);
  fireEvent.click(outdoorMapImage);

  expect(modal).toBeInTheDocument();

  fireEvent.click(screen.getByRole('img', { name: 'Enlarged View' }).closest('section'));

  await waitFor(() => 
    expect(screen.queryByRole('img', { name: 'Enlarged View' })).not.toBeInTheDocument()
  );
});
