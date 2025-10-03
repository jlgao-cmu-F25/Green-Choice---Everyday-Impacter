class StreakService {
  calculateStreak(lastActionDate) {
    if (!lastActionDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = new Date(lastActionDate);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If last action was today or yesterday, streak continues
    return diffDays <= 1 ? 1 : 0;
  }

  updateStreak(user, actionDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const actionDateOnly = new Date(actionDate);
    actionDateOnly.setHours(0, 0, 0, 0);

    if (!user.lastActionDate) {
      user.currentStreak = 1;
      user.longestStreak = 1;
    } else {
      const lastDate = new Date(user.lastActionDate);
      lastDate.setHours(0, 0, 0, 0);

      const diffTime = actionDateOnly - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, no change to streak
      } else if (diffDays === 1) {
        // Consecutive day
        user.currentStreak += 1;
      } else {
        // Streak broken
        user.currentStreak = 1;
      }

      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    }

    user.lastActionDate = actionDate;
    return user;
  }
}

module.exports = new StreakService();
