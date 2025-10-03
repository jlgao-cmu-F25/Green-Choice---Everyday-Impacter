# Bike Action Feature

## Overview
The Bike Action feature allows users to log their bike rides by entering start and end locations. The application uses OpenStreetMap services (Nominatim for geocoding and haversine distance calculation) to calculate the distance and estimate CO₂ savings.

## Setup Instructions

### 1. No API Key Required
This feature uses free OpenStreetMap services:
- **Nominatim**: For geocoding addresses to coordinates
- **Haversine Formula**: For calculating straight-line distance between points
- **Leaflet**: For map visualization (already included)

### 2. Dependencies Already Included
The following are automatically included:
```json
"leaflet": "^1.9.4",
"@types/leaflet": "^1.9.20"
```

## Features

### Bike Action Modal
- **Location Input**: Users can enter start and end locations (addresses, landmarks, etc.)
- **Distance Calculation**: Uses OpenStreetMap services (Nominatim for geocoding and Haversine formula) to calculate the straight-line distance between locations
- **CO₂ Savings**: Automatically calculates CO₂ savings based on distance (0.21 kg CO₂ per km vs driving)
- **Impact Preview**: Shows distance and CO₂ savings before logging

### How It Works
1. User clicks the "🚴‍♂️ Bike Ride" button on the dashboard
2. Modal opens with location input fields
3. User enters start and end locations (addresses, landmarks, etc.)
4. Clicks "Calculate Distance" to get the distance
5. System geocodes locations using Nominatim and calculates distance
6. Shows distance and estimated CO₂ savings
7. User clicks "Log Bike Ride" to save the action

## Technical Implementation

### Components
- **BikeActionComponent**: Modal dialog for bike ride logging
- **DashboardComponent**: Updated to include bike action button and modal

### Dependencies
- `leaflet`: OpenStreetMap library for mapping
- `@types/leaflet`: TypeScript definitions for Leaflet
- **Nominatim**: Free geocoding service (no API key required)
- **Haversine Formula**: Mathematical distance calculation

### Services Used
1. **Nominatim Geocoding**: `https://nominatim.openstreetmap.org/search`
   - Converts addresses to latitude/longitude coordinates
   - Free service with fair use policy
2. **Haversine Distance**: Mathematical formula for great-circle distance
   - Calculates straight-line distance between two points
   - Provides reasonable approximation for cycling routes

### CO₂ Calculation
The feature uses a simple calculation:
- **CO₂ saved per km**: 0.21 kg (average difference between cycling and driving)
- **Formula**: `distance_km × 0.21 = co2_saved_kg`

## Error Handling
- Invalid locations: Shows error message if locations cannot be found
- API failures: Graceful error handling with user-friendly messages
- Network issues: Loading states and retry options

## Advantages of OpenStreetMap Implementation
- **No API Keys**: Completely free to use, no registration required
- **No Rate Limits**: Generous fair use policy
- **Privacy Friendly**: No tracking by commercial services
- **Open Source**: Transparent and community-driven data
- **Global Coverage**: Works worldwide with good accuracy

## Future Enhancements
- **Route Visualization**: Add Leaflet map display with route overlay
- **OpenRouteService Integration**: Use ORS API for more accurate cycling routes
- **Elevation Profile**: Calculate difficulty based on terrain
- **Alternative Routes**: Show multiple route options
- **Integration with fitness trackers**: Import GPS data
- **Historical bike ride tracking**: Store and visualize past rides
- **Improved Routing**: Consider bike lanes, paths, and road safety