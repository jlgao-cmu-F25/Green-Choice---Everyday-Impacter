# Everyday Impact Calculator - Setup Guide

## Project Structure

```
Green-Choice---Everyday-Impacter/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose models (EcoAction, UserAction, User)
│   │   ├── controllers/     # Business logic (ActionController)
│   │   ├── services/        # Helper services (ImpactCalculator, StreakService)
│   │   ├── routes/          # API routes
│   │   ├── config/          # Database configuration
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    └── src/
        └── app/
            ├── models/      # TypeScript interfaces
            ├── services/    # Angular services (ApiService)
            └── components/  # Angular components
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The API will run on `http://localhost:3000`.

**Note:** The backend uses **in-memory storage** - no database setup required! Perfect for hackathons. Data persists only while the server is running.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The Angular app will run on `http://localhost:4200`.

## API Endpoints

### Get all eco actions
```
GET /api/actions
```

### Log an action
```
POST /api/actions/log
Body: { userId: string, actionId: string, quantity: number }
```

### Get user's actions
```
GET /api/users/:userId/actions?period=week
```

### Get user statistics
```
GET /api/users/:userId/stats
```

## Pre-defined Eco Actions

The database will be seeded with 5 default actions:
1. **Biked 1 mile** - 0.4 kg CO₂ saved
2. **Skipped plastic bag** - 0.01 kg CO₂, 0.1 kg waste saved
3. **Recycled bottle** - 0.05 kg CO₂, 0.5 L water, 0.05 kg waste saved
4. **Used reusable mug** - 0.11 kg CO₂, 1 L water, 0.02 kg waste saved
5. **Ate vegetarian meal** - 2.5 kg CO₂, 100 L water, 0.2 kg waste saved

## Next Steps for MVP

1. **Create Angular Components:**
   - Dashboard component (show today's impact, weekly streak)
   - Action logger component (buttons for each eco action)
   - Stats component (total impact, comparisons)

2. **Add HttpClient to Angular:**
   - Update `app.config.ts` to include `provideHttpClient()`

3. **Build UI:**
   - Simple, mobile-friendly design
   - Quick action buttons with icons
   - Impact visualization

4. **Optional AI Integration:**
   - Add OpenAI service for custom analogies
   - Generate personalized suggestions

## Testing

Test the API with curl:
```bash
# Get all actions
curl http://localhost:3000/api/actions

# Log an action
curl -X POST http://localhost:3000/api/actions/log \
  -H "Content-Type: application/json" \
  -d '{"userId":"demo-user","actionId":"ACTION_ID_HERE","quantity":1}'

# Get user stats
curl http://localhost:3000/api/users/demo-user/stats
```
