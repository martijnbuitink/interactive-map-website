import { mapPoints } from './data/cities/amsterdam/index.js';

const AMSTERDAM_CENTER = [52.37, 4.89];
const DEFAULT_ZOOM = 13;
const MAP_STATE_KEY = 'map-state-v1';

const categoryMeta = {
  'history-visible': { color: '#e63946', label: 'Historie zichtbaar' },
  'history-lost': { color: '#2f6fed', label: 'Historie niet meer zichtbaar / bijzonder' },
  ww2: { color: '#f4b400', label: 'Tweede Wereldoorlog' },
  bridges: { color: '#2a9d8f', label: 'Bruggen' },
  nature: { color: '#5b9a2f', label: 'Natuur' }
};

const controls = {
  status: document.getElementById('status'),
  locateButton: document.getElementById('locate-me'),
  resetButton: document.getElementById('reset-view'),
  pickStartButton: document.getElementById('pick-start'),
  routeButton: document.getElementById('build-route'),
  clearRouteButton: document.getElementById('clear-route'),
  categoryToggles: Array.from(document.querySelectorAll('.category-toggle')),
  routeCategoryToggles: Array.from(document.querySelectorAll('.route-category-toggle')),
  routeDistanceRadios: Array.from(document.querySelectorAll('input[name="route-distance"]')),
  routeStartRadios: Array.from(document.querySelectorAll('input[name="route-start-mode"]'))
};

function readSavedMapState() {
  try {
    const raw = localStorage.getItem(MAP_STATE_KEY);
    if (!raw) {
      return { center: AMSTERDAM_CENTER, zoom: DEFAULT_ZOOM };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.center) || typeof parsed.zoom !== 'number') {
      return { center: AMSTERDAM_CENTER, zoom: DEFAULT_ZOOM };
    }

    return parsed;
  } catch (error) {
    return { center: AMSTERDAM_CENTER, zoom: DEFAULT_ZOOM };
  }
}

const savedState = readSavedMapState();
const mobileQuery = window.matchMedia('(max-width: 960px)');

const map = L.map('map', {
  scrollWheelZoom: true,
  dragging: true,
  touchZoom: true,
  tap: true
}).setView(savedState.center, savedState.zoom);

const walkingRouter = L.Routing.osrmv1({
  serviceUrl: 'https://router.project-osrm.org/route/v1',
  profile: 'foot'
});

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Humanitarian style'
}).addTo(map);

let routeControl = null;
let userLocationMarker = null;
let pickedStartLatLng = null;
let pickedStartMarker = null;
let isPickingStart = false;

const markerLayer = L.layerGroup().addTo(map);

function setStatus(message) {
  controls.status.textContent = message;
}

function setMobileInteractionMode(isMobile) {
  if (isMobile) {
    map.dragging.disable();
    map.touchZoom.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    return;
  }

  map.dragging.enable();
  map.touchZoom.enable();
  map.scrollWheelZoom.enable();
  map.doubleClickZoom.enable();
  map.boxZoom.enable();
}

function getActiveCategories() {
  return new Set(
    controls.categoryToggles
      .filter((toggle) => toggle.checked)
      .map((toggle) => toggle.value)
  );
}

function getSelectedRouteCategories() {
  return controls.routeCategoryToggles
    .filter((toggle) => toggle.checked)
    .map((toggle) => toggle.value);
}

function getSelectedRouteDistance() {
  const selected = controls.routeDistanceRadios.find((radio) => radio.checked);
  return selected ? Number(selected.value) : 5;
}

function getSelectedStartMode() {
  const selected = controls.routeStartRadios.find((radio) => radio.checked);
  return selected ? selected.value : 'nearest';
}

function markerIcon(color) {
  return L.divIcon({
    className: 'custom-icon',
    html: `<span class="marker-dot" style="--dot-color:${color}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

function isMobileLayout() {
  return mobileQuery.matches;
}

function renderMarkers() {
  markerLayer.clearLayers();
  const activeCategories = getActiveCategories();

  mapPoints.forEach((point, index) => {
    if (!activeCategories.has(point.category)) {
      return;
    }

    const color = categoryMeta[point.category]?.color || '#555';
    const marker = L.marker([point.lat, point.lng], { icon: markerIcon(color) });
    if (!isMobileLayout()) {
      marker.bindTooltip(point.title, { direction: 'top', sticky: true, opacity: 0.95 });
    }
    marker.on('click', () => {
      const detailUrl = `detail.html?id=${index}`;
      if (isMobileLayout()) {
        window.location.href = detailUrl;
        return;
      }

      window.open(detailUrl, '_blank', 'noopener,noreferrer');
    });
    marker.addTo(markerLayer);
  });
}

function saveMapState() {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const state = { center: [center.lat, center.lng], zoom };
  localStorage.setItem(MAP_STATE_KEY, JSON.stringify(state));
}

function clearRoute() {
  if (routeControl) {
    map.removeControl(routeControl);
    routeControl = null;
    setStatus('Route gewist.');
  }
}

function clearPickedStart() {
  pickedStartLatLng = null;
  if (pickedStartMarker) {
    map.removeLayer(pickedStartMarker);
    pickedStartMarker = null;
  }
  setPickingMode(false);
}

function distanceInKm(a, b) {
  return map.distance([a.lat, a.lng], [b.lat, b.lng]) / 1000;
}

function nearestPoint(origin, points) {
  let nearest = null;
  let minDistance = Number.POSITIVE_INFINITY;

  points.forEach((point) => {
    const dist = distanceInKm({ lat: origin[0], lng: origin[1] }, point);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = point;
    }
  });

  return nearest;
}

function nearestNPoints(origin, points, maxCount) {
  const originPoint = { lat: origin[0], lng: origin[1] };
  return [...points]
    .sort((a, b) => distanceInKm(originPoint, a) - distanceInKm(originPoint, b))
    .slice(0, maxCount);
}

function routeCoordinates(waypoints) {
  return waypoints.map((waypoint) => `${waypoint.lng},${waypoint.lat}`).join(';');
}

async function routeDistanceMeters(waypoints) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/foot/${routeCoordinates(waypoints)}?overview=false&steps=false&alternatives=false&annotations=false`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      return Number.POSITIVE_INFINITY;
    }

    const data = await response.json();
    return Array.isArray(data.routes) && data.routes[0] ? data.routes[0].distance : Number.POSITIVE_INFINITY;
  } catch (error) {
    return Number.POSITIVE_INFINITY;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function setPickingMode(active) {
  isPickingStart = active;
  if (active) {
    map.getContainer().classList.add('is-picking-start');
    setStatus('Klik nu op de kaart om je route-startpunt te kiezen.');
  } else {
    map.getContainer().classList.remove('is-picking-start');
  }
}

async function buildRouteSuggestion() {
  const kmTarget = getSelectedRouteDistance();
  const selectedCategories = getSelectedRouteCategories();
  const startMode = getSelectedStartMode();

  if (selectedCategories.length === 0) {
    setStatus('Selecteer minstens een routecategorie.');
    return;
  }

  const candidatePoints = mapPoints.filter((point) => selectedCategories.includes(point.category));
  if (candidatePoints.length < 1) {
    setStatus('Geen punten beschikbaar voor de geselecteerde categorieen.');
    return;
  }

  let startLatLng = null;
  const center = map.getCenter();

  if (startMode === 'map-click') {
    if (!pickedStartLatLng) {
      setStatus('Kies eerst een startpunt op de kaart.');
      return;
    }
    startLatLng = { lat: pickedStartLatLng.lat, lng: pickedStartLatLng.lng };
  } else if (startMode === 'my-location') {
    if (!userLocationMarker) {
      setStatus('Gebruik eerst Toon mijn locatie of kies een ander starttype.');
      return;
    }
    const user = userLocationMarker.getLatLng();
    startLatLng = { lat: user.lat, lng: user.lng };
  } else {
    startLatLng = { lat: center.lat, lng: center.lng };
  }

  const targetMeters = kmTarget * 1000;
  const nearbyCandidates = nearestNPoints([startLatLng.lat, startLatLng.lng], candidatePoints, 6);
  if (nearbyCandidates.length === 0) {
    setStatus('Kon geen geschikt rondje bouwen. Probeer andere categorieen of afstand.');
    return;
  }

  setStatus('Route aan het berekenen...');

  const candidateSets = [];
  nearbyCandidates.forEach((point) => {
    candidateSets.push([point]);
  });

  for (let i = 0; i < nearbyCandidates.length; i += 1) {
    for (let j = i + 1; j < nearbyCandidates.length; j += 1) {
      candidateSets.push([nearbyCandidates[i], nearbyCandidates[j]]);
      candidateSets.push([nearbyCandidates[j], nearbyCandidates[i]]);
    }
  }

  let bestUnderTarget = null;
  let bestOverTarget = null;

  for (const stopSet of candidateSets) {
    const waypoints = [
      L.latLng(startLatLng.lat, startLatLng.lng),
      ...stopSet.map((point) => L.latLng(point.lat, point.lng)),
      L.latLng(startLatLng.lat, startLatLng.lng)
    ];

    const routeMeters = await routeDistanceMeters(waypoints);
    if (!Number.isFinite(routeMeters)) {
      continue;
    }

    const candidate = { waypoints, routeMeters, stopCount: stopSet.length };

    if (routeMeters <= targetMeters) {
      if (!bestUnderTarget || routeMeters > bestUnderTarget.routeMeters) {
        bestUnderTarget = candidate;
      }
    } else if (!bestOverTarget || routeMeters < bestOverTarget.routeMeters) {
      bestOverTarget = candidate;
    }
  }

  const selectedRoute = bestUnderTarget || bestOverTarget;
  if (!selectedRoute) {
    setStatus('Kon geen geschikt rondje bouwen. Probeer andere categorieen of afstand.');
    return;
  }

  clearRoute();

  routeControl = L.Routing.control({
    router: walkingRouter,
    waypoints: selectedRoute.waypoints,
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    lineOptions: {
      styles: [{ color: '#111827', opacity: 0.85, weight: 5 }]
    },
    show: false,
    createMarker: () => null
  }).addTo(map);

  const shownKm = (selectedRoute.routeMeters / 1000).toFixed(1);
  setStatus(`Rondje gemaakt: ${shownKm} km, zo dicht mogelijk bij ${kmTarget} km.`);
}

controls.categoryToggles.forEach((toggle) => {
  toggle.addEventListener('change', () => {
    renderMarkers();
    setStatus('Filters bijgewerkt.');
  });
});

controls.routeButton.addEventListener('click', () => {
  buildRouteSuggestion();
});
controls.clearRouteButton.addEventListener('click', clearRoute);
controls.pickStartButton.addEventListener('click', () => {
  const mode = getSelectedStartMode();
  if (mode !== 'map-click') {
    setStatus('Selecteer eerst starttype: Kies startpunt op de kaart.');
    return;
  }
  setPickingMode(true);
});

controls.routeStartRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.value !== 'map-click' && radio.checked) {
      setPickingMode(false);
    }
  });
});

map.on('click', (event) => {
  if (!isPickingStart) {
    return;
  }

  clearPickedStart();
  pickedStartLatLng = event.latlng;
  pickedStartMarker = L.circleMarker(event.latlng, {
    radius: 9,
    color: '#ffffff',
    fillColor: '#2563eb',
    fillOpacity: 1,
    weight: 2
  }).addTo(map);
  pickedStartMarker.bindTooltip('Gekozen startpunt').openTooltip();
  setPickingMode(false);
  setStatus('Startpunt op kaart is opgeslagen.');
});

controls.locateButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    setStatus('Geolocatie wordt niet ondersteund door je browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = [position.coords.latitude, position.coords.longitude];

      if (userLocationMarker) {
        map.removeLayer(userLocationMarker);
      }

      userLocationMarker = L.circleMarker(coords, {
        radius: 10,
        color: '#ffffff',
        fillColor: '#111827',
        fillOpacity: 1,
        weight: 2
      }).addTo(map);

      userLocationMarker.bindTooltip('Jij bent hier').openTooltip();
      map.setView(coords, Math.max(map.getZoom(), 14));
      map.invalidateSize();
      setStatus('Je locatie is toegevoegd aan de kaart.');
    },
    () => {
      setStatus('Locatie ophalen is niet gelukt. Controleer je browserrechten.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

controls.resetButton.addEventListener('click', () => {
  clearRoute();
  clearPickedStart();
  if (userLocationMarker) {
    map.removeLayer(userLocationMarker);
    userLocationMarker = null;
  }
  map.setView(AMSTERDAM_CENTER, DEFAULT_ZOOM);
  map.invalidateSize();
  setStatus('Kaartweergave is gereset naar Amsterdam centrum.');
});

map.on('moveend zoomend', saveMapState);

setMobileInteractionMode(isMobileLayout());
mobileQuery.addEventListener?.('change', (event) => {
  setMobileInteractionMode(event.matches);
  renderMarkers();
});

renderMarkers();
setStatus('Klaar! Kies een categorie of laat een route samenstellen.');
