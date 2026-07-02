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

const map = L.map('map', {
  scrollWheelZoom: true,
  dragging: true,
  touchZoom: true,
  tap: true
}).setView(savedState.center, savedState.zoom);

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

function renderMarkers() {
  markerLayer.clearLayers();
  const activeCategories = getActiveCategories();

  mapPoints.forEach((point, index) => {
    if (!activeCategories.has(point.category)) {
      return;
    }

    const color = categoryMeta[point.category]?.color || '#555';
    const marker = L.marker([point.lat, point.lng], { icon: markerIcon(color) });
    marker.bindTooltip(point.title);
    marker.on('click', () => {
      window.open(`detail.html?id=${index}`, '_blank', 'noopener,noreferrer');
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

function chooseLoopPoints(start, candidates, targetKm) {
  const nearCandidates = nearestNPoints([start.lat, start.lng], candidates, 12);
  if (nearCandidates.length === 0) {
    return [];
  }

  let best = null;
  const startPoint = { lat: start.lat, lng: start.lng };

  for (let i = 0; i < nearCandidates.length; i += 1) {
    const a = nearCandidates[i];
    const loopA = distanceInKm(startPoint, a) + distanceInKm(a, startPoint);
    const scoreA = Math.abs(loopA - targetKm);
    if (!best || scoreA < best.score) {
      best = { score: scoreA, points: [a], loopDistance: loopA };
    }

    for (let j = i + 1; j < nearCandidates.length; j += 1) {
      const b = nearCandidates[j];
      const loopB =
        distanceInKm(startPoint, a) +
        distanceInKm(a, b) +
        distanceInKm(b, startPoint);
      const scoreB = Math.abs(loopB - targetKm);
      if (!best || scoreB < best.score) {
        best = { score: scoreB, points: [a, b], loopDistance: loopB };
      }

      for (let k = j + 1; k < nearCandidates.length; k += 1) {
        const c = nearCandidates[k];
        const loopC =
          distanceInKm(startPoint, a) +
          distanceInKm(a, b) +
          distanceInKm(b, c) +
          distanceInKm(c, startPoint);
        const scoreC = Math.abs(loopC - targetKm);
        if (!best || scoreC < best.score) {
          best = { score: scoreC, points: [a, b, c], loopDistance: loopC };
        }
      }
    }
  }

  return best ? best.points : [];
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

function buildRouteSuggestion() {
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

  const stops = chooseLoopPoints(startLatLng, candidatePoints, kmTarget);
  if (stops.length === 0) {
    setStatus('Kon geen geschikt rondje bouwen. Probeer andere categorieen of afstand.');
    return;
  }

  const waypoints = [
    L.latLng(startLatLng.lat, startLatLng.lng),
    ...stops.map((point) => L.latLng(point.lat, point.lng)),
    L.latLng(startLatLng.lat, startLatLng.lng)
  ];

  clearRoute();

  routeControl = L.Routing.control({
    waypoints,
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

  setStatus(`Rondje gemaakt: ongeveer ${kmTarget} km met ${stops.length} tussenstops.`);
}

controls.categoryToggles.forEach((toggle) => {
  toggle.addEventListener('change', () => {
    renderMarkers();
    setStatus('Filters bijgewerkt.');
  });
});

controls.routeButton.addEventListener('click', buildRouteSuggestion);
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
      setStatus('Je locatie is toegevoegd aan de kaart.');
    },
    () => {
      setStatus('Locatie ophalen is niet gelukt. Controleer je browserrechten.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

controls.resetButton.addEventListener('click', () => {
  map.setView(AMSTERDAM_CENTER, DEFAULT_ZOOM);
  setStatus('Kaartweergave is gereset naar Amsterdam centrum.');
});

map.on('moveend zoomend', saveMapState);

renderMarkers();
setStatus('Klaar! Kies een categorie of laat een route samenstellen.');
