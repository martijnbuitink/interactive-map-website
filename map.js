const map = L.map('map', {
  scrollWheelZoom: false, // Disable zooming with mouse wheel on mobile
  dragging: true, // Enable dragging for touch devices
  touchZoom: true,  // Enable pinch zoom for touch devices
  tap: true  // Enable tapping for markers and interactions
}).setView([52.37, 4.89], 13); // Amsterdam coordinates

// Custom tile background (optional, simplified design)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Abstract map points with custom markers
const mapPoints = [
  {
    lat: 52.369124,
    lng: 4.889797,
    title: 'Begijnhof 34',
    description: 'Hier is 1 van de 2 huizen te vinden met de oudste gevel van Amsterdam (ca. 1530). Het zijn geheel houten huizen, maar van het latere type: ze zijn hoger en hebben stenen zijmuren.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Begijnhof%2C_Amsterdam.jpg/532px-Begijnhof%2C_Amsterdam.jpg'
  },
  {
    lat: 52.3667,
    lng: 4.8945,
    title: 'Zeedijk 1',
    description: 'Hier is 1 van de 2 huizen te vinden met de oudste gevel van Amsterdam (ca. 1530). Het zijn geheel houten huizen, maar van het latere type: ze zijn hoger en hebben stenen zijmuren.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Aepjen-amsterdam.jpg/520px-Aepjen-amsterdam.jpg'
  },
  {
    lat: 52.366103,
    lng: 4.931851,
    title: 'Dijkdoorbraak',
    description: 'Op 5 maart 1651 werden Amsterdam en omgeving getroffen door een ongekend felle stormvloed. Spectaculair was een dubbele doorbraak van de dijk die we tegenwoordig de Zeeburgerdijk noemen. Het water kwam met zoveel geweld door de zeewering, dat ook de meer landinwaarts gelegen ringdijk van de Watergraafsmeer bezweek. Je ziet nog steeds een lager gebied waar de dijk doorbrak. ',
    image: 'https://onsamsterdam.nl/uploads/headerContent/_1400x787_crop_center-center_82_line/dijkdoorbraak.jpg'
  }
];

// Custom icon style (simple dot icon for markers)
const customIcon = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: #ff6f61; width: 20px; height: 20px; border-radius: 50%;"></div>',
  iconSize: [20, 20],
});

// Add points with custom markers
mapPoints.forEach(point => {
  const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

  const popupContent = `
    <strong>${point.title}</strong><br>
    ${point.description}<br>
    <img src="${point.image}" alt="${point.title}" width="200" style="margin-top: 5px; border-radius: 8px;" />
  `;
  marker.bindPopup(popupContent);
});
