// In-memory data store
class DataStore {
  constructor() {
    this.ecoActions = [];
    this.userActions = [];
    this.users = [];
    this.seedData();
  }

  seedData() {
    this.ecoActions = [
      {
        _id: '1',
        name: 'Biked 1 mile',
        category: 'transportation',
        co2Saved: 0.4,
        waterSaved: 0,
        wasteSaved: 0,
        icon: '🚴',
        description: 'Chose biking over driving'
      },
      {
        _id: '2',
        name: 'Skipped plastic bag',
        category: 'waste',
        co2Saved: 0.01,
        waterSaved: 0,
        wasteSaved: 0.1,
        icon: '🛍️',
        description: 'Used reusable bag instead'
      },
      {
        _id: '3',
        name: 'Recycled bottle',
        category: 'waste',
        co2Saved: 0.05,
        waterSaved: 0.5,
        wasteSaved: 0.05,
        icon: '♻️',
        description: 'Recycled plastic bottle'
      },
      {
        _id: '4',
        name: 'Used reusable mug',
        category: 'waste',
        co2Saved: 0.11,
        waterSaved: 1,
        wasteSaved: 0.02,
        icon: '☕',
        description: 'Avoided disposable cup'
      },
      {
        _id: '5',
        name: 'Ate vegetarian meal',
        category: 'food',
        co2Saved: 2.5,
        waterSaved: 100,
        wasteSaved: 0.2,
        icon: '🥗',
        description: 'Chose plant-based option'
      }
    ];

    console.log('In-memory data store initialized with 5 eco actions');
  }

  // Helper to generate IDs
  generateId(collection) {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = new DataStore();
