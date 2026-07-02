import { mapPoints } from './data/cities/amsterdam/index.js';

const detailCard = document.getElementById('detail-card');
const backButton = document.getElementById('back');

function categoryLabel(category) {
  const labels = {
    'history-visible': 'Historie zichtbaar',
    'history-lost': 'Historie niet meer zichtbaar / bijzonder',
    ww2: 'Tweede Wereldoorlog',
    bridges: 'Bruggen',
    nature: 'Natuur'
  };

  return labels[category] || 'Onbekend';
}

function render() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const point = mapPoints[id];

  if (!Number.isInteger(id) || !point) {
    detailCard.innerHTML = '<h1>Locatie niet gevonden</h1><p>Ga terug naar de kaart en probeer opnieuw.</p>';
    return;
  }

  document.title = `${point.title} | Detail`;

  detailCard.innerHTML = `
    <h1>${point.title}</h1>
    <p class="detail-category">${categoryLabel(point.category)}</p>
    <img src="${point.image}" alt="${point.title}" loading="lazy" />
    <p>${point.description}</p>
    <p class="detail-coords">Locatie: ${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}</p>
  `;
}

backButton.addEventListener('click', () => {
  const hasOpener = window.opener && !window.opener.closed;

  if (hasOpener) {
    window.close();
    return;
  }

  window.location.href = './index.html';
});

render();
