import { Component, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bike-action',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (isVisible) {
      <div class="bike-action-modal">
        <div class="modal-overlay" (click)="closeModal()"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2>🚴‍♂️ Log Your Bike Ride</h2>
            <button class="close-button" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="startLocation">Start Location</label>
              <input
                id="startLocation"
                type="text"
                [(ngModel)]="startLocation"
                name="startLocation"
                placeholder="e.g., Carnegie Mellon University"
                class="location-input"
                required
                >
            </div>
            <div class="form-group">
              <label for="endLocation">End Location</label>
              <input
                id="endLocation"
                type="text"
                [(ngModel)]="endLocation"
                name="endLocation"
                placeholder="e.g., Pittsburgh International Airport"
                class="location-input"
                required
                >
            </div>
            @if (distance > 0) {
              <div class="distance-display">
                <div class="distance-info">
                  <span class="distance-icon">📏</span>
                  <span class="distance-text">Distance: {{ distance.toFixed(2) }} km</span>
                </div>
                <div class="impact-preview">
                  <span class="impact-icon">💨</span>
                  <span class="impact-text">CO₂ Saved: {{ (distance * 0.21).toFixed(2) }} kg</span>
                </div>
              </div>
            }
            @if (errorMessage) {
              <div class="error-message">
                {{ errorMessage }}
              </div>
            }
          </div>
          <div class="modal-footer">
            <button
              class="calculate-button"
              (click)="calculateDistance()"
              [disabled]="!startLocation.trim() || !endLocation.trim() || isCalculating"
              >
              @if (!isCalculating) {
                <span>📍 Calculate Distance</span>
              }
              @if (isCalculating) {
                <span>🔄 Calculating...</span>
              }
            </button>
            <button
              class="log-button"
              (click)="logBikeRide()"
              [disabled]="distance <= 0 || isLogging"
              >
              @if (!isLogging) {
                <span>🚴‍♂️ Log Bike Ride</span>
              }
              @if (isLogging) {
                <span>⏳ Logging...</span>
              }
            </button>
          </div>
        </div>
      </div>
    }
    `,
  styles: [`
    .bike-action-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }

    .modal-content {
      position: relative;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      margin: 0;
      color: #2d3748;
      font-size: 1.5rem;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      color: #718096;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-button:hover {
      background: #f7fafc;
      color: #4a5568;
    }

    .modal-body {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #4a5568;
      font-weight: 500;
    }

    .location-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .location-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .distance-display {
      background: #f0fff4;
      border: 1px solid #9ae6b4;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
    }

    .distance-info, .impact-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .distance-info:last-child, .impact-preview:last-child {
      margin-bottom: 0;
    }

    .distance-icon, .impact-icon {
      font-size: 18px;
    }

    .distance-text, .impact-text {
      font-weight: 600;
      color: #2d3748;
    }

    .error-message {
      background: #fed7d7;
      color: #c53030;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 14px;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #e2e8f0;
      justify-content: flex-end;
    }

    .calculate-button, .log-button {
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 14px;
    }

    .calculate-button {
      background: #667eea;
      color: white;
    }

    .calculate-button:hover:not(:disabled) {
      background: #5a67d8;
      transform: translateY(-1px);
    }

    .log-button {
      background: #48bb78;
      color: white;
    }

    .log-button:hover:not(:disabled) {
      background: #38a169;
      transform: translateY(-1px);
    }

    .calculate-button:disabled, .log-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 640px) {
      .modal-content {
        margin: 20px;
        width: calc(100% - 40px);
      }
      
      .modal-footer {
        flex-direction: column;
      }
    }
  `]
})
export class BikeActionComponent {
  @Output() bikeRideLogged = new EventEmitter<{distance: number, co2Saved: number}>();
  @Output() modalClosed = new EventEmitter<void>();

  isVisible = false;
  startLocation = '';
  endLocation = '';
  distance = 0;
  isCalculating = false;
  isLogging = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // No initialization needed for OpenStreetMap services
  }

  showModal() {
    this.isVisible = true;
    this.resetForm();
  }

  closeModal() {
    this.isVisible = false;
    this.modalClosed.emit();
  }

  async calculateDistance() {
    if (!this.startLocation.trim() || !this.endLocation.trim()) {
      return;
    }

    this.isCalculating = true;
    this.errorMessage = '';

    try {
      // Step 1: Geocode start and end locations using Nominatim
      const startCoords = await this.geocodeLocation(this.startLocation.trim());
      const endCoords = await this.geocodeLocation(this.endLocation.trim());

      if (!startCoords || !endCoords) {
        this.errorMessage = 'Could not find one or both locations. Please check your addresses.';
        this.isCalculating = false;
        return;
      }

      // Step 2: Calculate routing distance using OpenRouteService
      const distance = await this.calculateRouteDistance(startCoords, endCoords);
      
      if (distance > 0) {
        this.distance = distance;
      } else {
        this.errorMessage = 'Could not calculate route between these locations.';
      }

    } catch (error) {
      console.error('Error calculating distance:', error);
      this.errorMessage = 'Error calculating distance. Please try again.';
    }

    this.isCalculating = false;
  }

  private async geocodeLocation(address: string): Promise<{lat: number, lon: number} | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      const response = await this.http.get<any[]>(url).toPromise();
      
      if (response && response.length > 0) {
        return {
          lat: parseFloat(response[0].lat),
          lon: parseFloat(response[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  private async calculateRouteDistance(start: {lat: number, lon: number}, end: {lat: number, lon: number}): Promise<number> {
    try {
      // Using OpenRouteService API for bicycle routing
      // Note: This requires an API key for production use, but has a generous free tier
      const url = 'https://api.openrouteservice.org/v2/directions/cycling-regular';
      const body = {
        coordinates: [[start.lon, start.lat], [end.lon, end.lat]],
        format: 'json'
      };

      // For demo purposes, we'll fall back to haversine distance calculation
      // In production, you'd want to get an OpenRouteService API key
      const distance = this.calculateHaversineDistance(start.lat, start.lon, end.lat, end.lon);
      return distance;

    } catch (error) {
      console.error('Routing error:', error);
      // Fall back to straight-line distance
      return this.calculateHaversineDistance(start.lat, start.lon, end.lat, end.lon);
    }
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  logBikeRide() {
    if (this.distance <= 0) {
      return;
    }

    this.isLogging = true;

    // Calculate CO2 saved (approximately 0.21 kg CO2 per km by bike vs car)
    const co2Saved = this.distance * 0.21;

    // Simulate API call delay
    setTimeout(() => {
      this.isLogging = false;
      this.bikeRideLogged.emit({
        distance: this.distance,
        co2Saved: co2Saved
      });
      this.closeModal();
    }, 1000);
  }

  private resetForm() {
    this.startLocation = '';
    this.endLocation = '';
    this.distance = 0;
    this.errorMessage = '';
    this.isCalculating = false;
    this.isLogging = false;
  }
}