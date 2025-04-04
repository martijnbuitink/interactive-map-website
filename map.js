// Initialize map
const map = L.map('map').setView([52.37, 4.89], 13); // Amsterdam

// Add base tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Example data
const mapPoints = [
  {
    lat: 52.370216,
    lng: 4.895168,
    theme: 'art',
    title: 'Colorful Mural',
    description: 'A beautiful street mural in the heart of the city.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Graffiti_Mural.jpg/640px-Graffiti_Mural.jpg'
  },
  {
    lat: 52.3667,
    lng: 4.8945,
    theme: 'history',
    title: 'Old Church',
    description: 'One of the oldest buildings in Amsterdam.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Oude_Kerk.jpg/640px-Oude_Kerk.jpg'
  }
];

// Theme to color
function getColorByTheme(theme) {
  switch (theme) {
    case 'art': return 'red';
    case 'history': return 'blue';
    default: return 'gray';
  }
}

// Add points
mapPoints.forEach(point => {
  const marker = L.circleMarker([point.lat, point.lng], {
    radius: 8,
    fillColor: getColorByTheme(point.theme),
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }).addTo(map);

  const popupContent = `
    <strong>${point.title}</strong><br>
    ${point.description}<br>
    <img src="${point.image}" alt="${point.title}" width="200"/>
  `;
  marker.bindPopup(popupContent);
});
