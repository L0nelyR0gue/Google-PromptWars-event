/**
 * Shared PropTypes definitions for Travi! components.
 * Centralises type contracts so every component import from here.
 */

import PropTypes from 'prop-types';

/** Firebase Auth user object shape */
export const UserShape = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  displayName: PropTypes.string,
  photoURL: PropTypes.string,
});

/** A single activity within a day plan */
export const ActivityShape = PropTypes.shape({
  time: PropTypes.string,
  name: PropTypes.string.isRequired,
  location: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  description: PropTypes.string,
  category: PropTypes.string,
  estimated_cost_usd: PropTypes.number,
  duration_hours: PropTypes.number,
  indoor: PropTypes.bool,
});

/** A single meal suggestion */
export const MealShape = PropTypes.shape({
  meal_type: PropTypes.string.isRequired,
  suggestion: PropTypes.string.isRequired,
  location: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  cuisine: PropTypes.string,
  estimated_cost_usd: PropTypes.number,
});

/** A single day in the itinerary */
export const DayShape = PropTypes.shape({
  day: PropTypes.number.isRequired,
  date: PropTypes.string,
  theme: PropTypes.string,
  weather_note: PropTypes.string,
  activities: PropTypes.arrayOf(ActivityShape),
  meals: PropTypes.arrayOf(MealShape),
  daily_budget_estimate_usd: PropTypes.number,
});

/** Full itinerary response from the AI */
export const ItineraryShape = PropTypes.shape({
  destination: PropTypes.string,
  summary: PropTypes.string,
  itinerary: PropTypes.arrayOf(DayShape),
  total_estimated_cost_usd: PropTypes.number,
  packing_tips: PropTypes.arrayOf(PropTypes.string),
  local_tips: PropTypes.arrayOf(PropTypes.string),
  weather_overview: PropTypes.string,
});
