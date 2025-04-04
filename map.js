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

// Abstract map points with custom markers and color
const mapPoints = [
  {
    lat: 52.369124,
    lng: 4.889797,
    title: 'Begijnhof 34',
    description: 'Hier is 1 van de 2 huizen te vinden met de oudste gevel van Amsterdam (ca. 1530). Het zijn geheel houten huizen, maar van het latere type: ze zijn hoger en hebben stenen zijmuren.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Begijnhof%2C_Amsterdam.jpg/532px-Begijnhof%2C_Amsterdam.jpg',
    color: '#ff6f61' // coral red
  },
  {
    lat: 52.3763121,
    lng: 4.9001456,
    title: 'Zeedijk 1',
    description: 'Hier is 1 van de 2 huizen te vinden met de oudste gevel van Amsterdam (ca. 1530). Het zijn geheel houten huizen, maar van het latere type: ze zijn hoger en hebben stenen zijmuren.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Aepjen-amsterdam.jpg/520px-Aepjen-amsterdam.jpg',
    color: '#ff6f61' // coral red
  },
  {
    lat: 52.366103,
    lng: 4.931851,
    title: 'Dijkdoorbraak',
    description: 'Op 5 maart 1651 werden Amsterdam en omgeving getroffen door een ongekend felle stormvloed. Spectaculair was een dubbele doorbraak van de dijk die we tegenwoordig de Zeeburgerdijk noemen.',
    image: 'https://onsamsterdam.nl/uploads/headerContent/_1400x787_crop_center-center_82_line/dijkdoorbraak.jpg',
    color: '#3f51b5' // blue
  }
];

// Add points with custom markers that change color based on the 'color' field in mapPoints
mapPoints.forEach(point => {
  const customIcon = L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${point.color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],  // Adjust anchor point to center the icon properly
  });

  const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

  const popupContent = `
    <strong>${point.title}</strong><br>
    ${point.description}<br>
    <img src="${point.image}" alt="${point.title}" width="200" style="margin-top: 5px; border-radius: 8px;" />
  `;
  marker.bindPopup(popupContent);
});
