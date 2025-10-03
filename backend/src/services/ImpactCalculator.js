class ImpactCalculator {
  constructor() {
    this.comparisons = {
      co2: [
        { threshold: 0.5, message: 'charging your phone for 2 months' },
        { threshold: 1, message: 'one hour of streaming Netflix' },
        { threshold: 2, message: 'making 2 cups of coffee' },
        { threshold: 5, message: 'driving 10 miles in a car' },
        { threshold: 10, message: 'a day of home electricity use' },
        { threshold: 20, message: 'planting 1 tree for a year' }
      ],
      water: [
        { threshold: 1, message: 'filling a large water bottle' },
        { threshold: 5, message: 'a 5-minute shower' },
        { threshold: 10, message: 'flushing a toilet 5 times' },
        { threshold: 50, message: 'running a dishwasher once' },
        { threshold: 100, message: 'doing 2 loads of laundry' }
      ],
      waste: [
        { threshold: 0.1, message: 'one plastic water bottle' },
        { threshold: 0.5, message: 'a day\'s worth of food packaging' },
        { threshold: 1, message: 'a week of plastic bags' },
        { threshold: 5, message: 'a month of coffee cups' }
      ]
    };
  }

  getComparison(value, type) {
    const comparisons = this.comparisons[type] || [];
    for (let i = comparisons.length - 1; i >= 0; i--) {
      if (value >= comparisons[i].threshold) {
        return comparisons[i].message;
      }
    }
    return comparisons[0]?.message || 'a small impact';
  }

  calculateTotalImpact(actions) {
    return actions.reduce((total, action) => {
      total.co2 += action.co2SavedTotal || 0;
      total.water += action.waterSavedTotal || 0;
      total.waste += action.wasteSavedTotal || 0;
      return total;
    }, { co2: 0, water: 0, waste: 0 });
  }

  generateInsight(impact) {
    const insights = [];

    if (impact.co2 > 0) {
      insights.push(`You saved ${impact.co2.toFixed(2)} kg CO₂ = the same as ${this.getComparison(impact.co2, 'co2')}`);
    }

    if (impact.water > 0) {
      insights.push(`You saved ${impact.water.toFixed(1)} liters of water = ${this.getComparison(impact.water, 'water')}`);
    }

    if (impact.waste > 0) {
      insights.push(`You reduced ${impact.waste.toFixed(2)} kg of waste = ${this.getComparison(impact.waste, 'waste')}`);
    }

    return insights;
  }
}

module.exports = new ImpactCalculator();
