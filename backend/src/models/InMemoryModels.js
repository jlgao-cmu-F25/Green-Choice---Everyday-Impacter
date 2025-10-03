const dataStore = require('../config/dataStore');

class EcoActionModel {
  static findAll() {
    return Promise.resolve(dataStore.ecoActions);
  }

  static findById(id) {
    const action = dataStore.ecoActions.find(a => a._id === id);
    return Promise.resolve(action);
  }
}

class UserActionModel {
  static create(data) {
    const userAction = {
      _id: dataStore.generateId('userActions'),
      ...data,
      date: data.date || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dataStore.userActions.push(userAction);
    return Promise.resolve(userAction);
  }

  static findByUserId(userId, options = {}) {
    let actions = dataStore.userActions.filter(a => a.userId === userId);

    if (options.startDate) {
      actions = actions.filter(a => new Date(a.date) >= options.startDate);
    }

    if (options.sort === 'date-desc') {
      actions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Populate actionId with actual eco action data
    const populated = actions.map(action => ({
      ...action,
      actionId: action.actionId === 'bike-ride-custom' 
        ? {
            _id: 'bike-ride-custom',
            name: action.actionName || 'Custom Bike Ride',
            category: 'transportation',
            co2Saved: action.co2SavedTotal,
            waterSaved: 0,
            wasteSaved: 0,
            icon: '🚴‍♂️'
          }
        : dataStore.ecoActions.find(ea => ea._id === action.actionId)
    }));

    return Promise.resolve(populated);
  }
}

class UserModel {
  static findByUserId(userId) {
    const user = dataStore.users.find(u => u.userId === userId);
    return Promise.resolve(user);
  }

  static create(data) {
    const user = {
      _id: dataStore.generateId('users'),
      ...data,
      currentStreak: 0,
      longestStreak: 0,
      totalCO2Saved: 0,
      totalWaterSaved: 0,
      totalWasteSaved: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dataStore.users.push(user);
    return Promise.resolve(user);
  }

  static update(userId, updates) {
    const index = dataStore.users.findIndex(u => u.userId === userId);
    if (index !== -1) {
      dataStore.users[index] = {
        ...dataStore.users[index],
        ...updates,
        updatedAt: new Date()
      };
      return Promise.resolve(dataStore.users[index]);
    }
    return Promise.resolve(null);
  }
}

module.exports = {
  EcoAction: EcoActionModel,
  UserAction: UserActionModel,
  User: UserModel
};
