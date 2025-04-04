const map = L.map('map').setView([52.37, 4.89], 13); // Amsterdam coordinates

// Custom tile background (optional, simplified design)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Abstract map points with custom markers
const mapPoints = [
  {
    lat: 52.370216,
    lng: 4.895168,
    title: 'Colorful Mural',
    description: 'A beautiful street mural in the city.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Graffiti_Mural.jpg/640px-Graffiti_Mural.jpg'
  },
  {
    lat: 52.3667,
    lng: 4.8945,
    title: 'Old Church',
    description: 'One of the oldest buildings in Amsterdam.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Oude_Kerk.jpg/640px-Oude_Kerk.jpg'
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
