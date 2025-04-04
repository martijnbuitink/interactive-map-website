const map = L.map('map').setView([52.37, 4.89], 13); // Amsterdam

// Fancy looking tiles (Stamen Watercolor or others)
L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
  attribution: '&copy; Stamen, OpenStreetMap contributors'
}).addTo(map);

const mapPoints = [
  {
    lat: 52.370216,
    lng: 4.895168,
    theme: 'art',
    title: 'Colorful Mural',
    description: 'A beautiful street mural.',
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

function getColorByTheme(theme) {
  switch (theme) {
    case 'art': return 'deeppink';
    case 'history': return 'cornflowerblue';
    default: return 'gray';
  }
}

mapPoints.forEach(point => {
  const marker = L.circleMarker([point.lat, point.lng], {
    radius: 10,
    fillColor: getColorByTheme(point.theme),
    color: '#222',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  }).addTo(map);

  const popupContent = `
    <strong>${point.title}</strong><br>
    ${point.description}<br>
    <img src="${point.image}" alt="${point.title}" width="200" style="margin-top: 5px; border-radius: 8px;" />
  `;
  marker.bindPopup(popupContent);
});
