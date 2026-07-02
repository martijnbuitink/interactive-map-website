import { points as historyVisiblePoints } from './historisch-zichtbaar/points.js';
import { points as historyLostPoints } from './historisch-niet-zichtbaar/points.js';
import { points as ww2Points } from './tweede-wereldoorlog/points.js';
import { points as bridgePoints } from './bruggen/points.js';
import { points as naturePoints } from './natuur/points.js';

export const mapPoints = [
  ...naturePoints,
  ...historyLostPoints,
  ...bridgePoints,
  ...historyVisiblePoints,
  ...ww2Points
];
