
import { WasteCategory, Recycler } from './types';

export const MOCK_RECYCLERS: Recycler[] = [
  {
    id: '1',
    name: 'GreenEarth Recycling Hub',
    distance: '0.8 miles',
    acceptedTypes: [WasteCategory.PLASTIC, WasteCategory.METAL, WasteCategory.GLASS],
    hours: '9:00 AM - 6:00 PM',
    phone: '+1 (555) 123-4567',
    rating: 4.8,
    lat: 40.7128,
    lng: -74.0060,
    address: '123 Sustainability Ave, New York'
  },
  {
    id: '2',
    name: 'Eco-Stream Collection',
    distance: '1.2 miles',
    acceptedTypes: [WasteCategory.PAPER, WasteCategory.ORGANIC],
    hours: '8:00 AM - 5:00 PM',
    phone: '+1 (555) 987-6543',
    rating: 4.5,
    lat: 40.7306,
    lng: -73.9352,
    address: '456 Greenway Blvd, Brooklyn'
  },
  {
    id: '3',
    name: 'ByteRecycle Electronics',
    distance: '2.5 miles',
    acceptedTypes: [WasteCategory.ELECTRONIC],
    hours: '10:00 AM - 7:00 PM',
    phone: '+1 (555) 246-8135',
    rating: 4.9,
    lat: 40.7580,
    lng: -73.9855,
    address: '789 Circuit Lane, Manhattan'
  }
];

export const EDUCATIONAL_ARTICLES = [
  {
    id: '1',
    title: 'The Plastic Problem',
    category: 'Environment',
    readTime: '5 min',
    summary: 'Understanding the impact of single-use plastics on our oceans.',
    icon: 'fa-droplet'
  },
  {
    id: '2',
    title: 'Home Composting 101',
    category: 'Tips',
    readTime: '8 min',
    summary: 'Start your zero-waste journey by composting food scraps.',
    icon: 'fa-seedling'
  },
  {
    id: '3',
    title: 'E-Waste: A Hidden Crisis',
    category: 'Awareness',
    readTime: '6 min',
    summary: 'Why your old smartphones shouldn\'t end up in the bin.',
    icon: 'fa-microchip'
  }
];

export const BADGES = [
  { id: 'b1', name: 'Eco Starter', icon: 'fa-leaf', description: 'Completed first scan' },
  { id: 'b2', name: 'Waste Warrior', icon: 'fa-shield-halved', description: 'Scanned 10 items' },
  { id: 'b3', name: 'Planet Protector', icon: 'fa-earth-americas', description: 'Achieved 100 Eco Score' }
];
