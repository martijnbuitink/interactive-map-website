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
    lat: 52.347010,
    lng: 4.848853,
    title: 'Huis te Vraag (Rijnsburgstraat 51)',
    description: 'Een piepklein, verborgen kerkhof midden in de stad, met een bijna sprookjesachtige sfeer. De naam komt van een voormalig kasteeltje dat op deze plek stond. Je mag er gewoon rondlopen en het voelt als een geheime tuin.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Entree_Huis_te_Vraag.JPG/390px-Entree_Huis_te_Vraag.JPG',
    color: '#3f51b5' // blue
  },
  {
    lat: 52.366103,
    lng: 4.931851,
    title: 'Zeedburgerdijk/Borneostraat',
    description: 'Op 5 maart 1651 werden Amsterdam en omgeving getroffen door een ongekend felle stormvloed. Spectaculair was een dubbele doorbraak van de dijk die we tegenwoordig de Zeeburgerdijk noemen. Het water had zo\'n kracht dat het een gat achterliet. Je ziet op dit punt dat de grond nog steeds lager ligt.',
    image: 'https://onsamsterdam.nl/uploads/headerContent/_1400x787_crop_center-center_82_line/dijkdoorbraak.jpg',
    color: '#3f51b5' // blue
  },
  {
    lat: 52.368126,
    lng: 4.904566,
    title: 'Mr. Visserplein',
    description: 'De Amsterdamse binnenstad wordt steeds meer autoluw. Hoe anders was het eind jaren 60 toen de gemeente juist ruim baan voor het opkomende vervoersmiddel maakte. Diverse stedenbouwkundigen hebben hun hoofd gebogen over plannen om een soort stadssnelweg dwars door de Nieuwmarktbuurt richting het Centraal Stadion aan te leggen. Bestaande huizen werden al gesloopt voor deze nieuwe weg. Uiteindelijk kwam deze verkeersader er door veel en harde protesten van Amsterdammers er niet, maar een verkeersplein met tunnels werd wel aangelegd: het Mr. Visserplein.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Mr_visserplein_stopera_mozes_en_aaronkerk.jpg/500px-Mr_visserplein_stopera_mozes_en_aaronkerk.jpg',
    color: '#3f51b5' // blue
  },
  {
    lat: 52.374555399238716,
    lng: 4.889638584261016,
    title: 'Jan Roodenpoortstoren',
    description: 'De Jan Roodenpoort was vanaf omstreeks 1480 een kleine doorgang in de vestingmuur van 1425, gelegen bij de Torensteeg. Opvallend is de fundering van de toren. Hier staan de palen zo dicht bij elkaar dat het een nagenoeg massieve houten fundering is geworden. Eigenlijk staat de fundering de bouw van een nieuwe brug in de weg. Er wordt besloten de brug met een vierde boog uit te breiden, waarbij aan beide zijden van de toren kelders ontstaan. In de noordelijke kelder was een uitbreiding van de keuken, de zuidelijke kelder bevatte de uitbreiding van de gevangenis. De toren is inmiddels afgebroken, maar wie zich nu onder de gewelven van de brug waagt, kan zich, mede door de nog steeds aanwezige tralies, met wat verbeeldingskracht het ellendige gevang voorstellen. Na 2001 in de keitjesbestrating van de Torensluis de contouren van de toren met een andere kleur keitjes zichtbaar gemaakt.',
    image: 'https://www.amsterdamsebinnenstad.nl/binnenstad/199/torensluis.jpg',
    color: '#3f51b5' // blue
  },
  {
    lat: 52.366505,
    lng: 4.904601,
    title: 'De M.S. Vaz Diasbrug (brug 238)',
    description: 'Wist je dat deze brug een schuilkelder tegen nucleaire aanvallen bevat? Deze basculebrug in Amsterdam-Centrum verbindt het Jonas Daniel Meijerplein met de Weesperstraat en overspant de Nieuwe Herengracht. De brug is vernoemd naar Mozes Salomon Vaz Dias, oprichter van het eerste journalistieke persbureau van Europa. De huidige brug dateert uit 1964. Aan de ene kant van het water zit de machinekamer en aan de andere kant een schuilkelder.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Brug_238%2C_overzicht2.jpg/399px-Brug_238%2C_overzicht2.jpg',
    color: '#008000' // green
  },
  {
    lat: 52.360790,
    lng: 4.876985,
    title: 'De Vondelbunker (Brug 200: de Vondelbrug)',
    description: 'Verborgen onder de Vondelbrug in het Vondelpark ligt de Vondelbunker, een voormalige nucleaire schuilkelder uit de Koude Oorlog. Tegenwoordig is deze unieke locatie een bruisend cultureel centrum, gerund door een collectief van vrijwilligers. Bij de opening was er nog geen bestemming voor de grote betonnen ruimte in het noordelijke bruggenhoofd. Plannen om er een openbaar urinoir in onder te brengen gingen niet door. Uiteindelijk nam de Bescherming Bevolking (BB) de ruimte in gebruik als schuilplaats.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Vondelbrug.JPG/399px-Vondelbrug.JPG',
    color: '#008000' // green
  },
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
    lat: 52.370059,
    lng: 4.891800,
    title: 'Het mirakel van Amsterdam (Enge Kapelsteeg 2)',
    description: 'In 1345 gebeurde er een wonder in Amsterdam. Een hostie bleef ongeschonden in het vuur na een zieke man het had uitgebraakt. Dit werd het Mirakel van Amsterdam en wordt elk jaar op 15 maart herdacht. Op de plek waar dit gebeurde is een kapel gebouwd, als je naar de overkant van de straat loopt op het Rokin dan kan je de koepel nog zien! Ook is op het Rokin een Romeinse zuil geplaatst die naar dit mirakel verwijst.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Eucharistic_Miracle_of_Amsterdam_by_Jacob_Cornelisz_1518.png/390px-Eucharistic_Miracle_of_Amsterdam_by_Jacob_Cornelisz_1518.png',
    color: '#ff6f61' // coral red
  },
  {
    lat: 52.371164,
    lng: 4.891840,
    title: 'De Papagaai (Kalverstraat 58)',
    description: 'De Papegaai, officieel bekend als de Sint Petrus en Pauluskerk, is een verborgen juweeltje in Amsterdam. Oorspronkelijk was hier een schuilkerk: de katholieken komen bijeen in het woonhuis van de welgestelde familie Bout (een vogelhandelaar, vandaar De Papegaai). Als deze ruimte te klein wordt, wordt er in 1710 achter het huis een kerkje gebouwd.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/De_Papegaai.JPG/399px-De_Papegaai.JPG',
    color: '#ff6f61' // coral red
  },
  {
    lat: 52.370676,
    lng: 4.896327,
    title: 'Het Spinhuis (Oudezijds Achterburgwal 185)',
    description: 'Dit poortje is nog een overblijfsel van het vrouwentuchthuis, het Spinhuis. Vrouwen die hier moesten zitten vanwege ‘lichte zeden’ of armoede werden verplicht om te spinnen. Bizar genoeg ligt het nu tegenover de Universiteitsbibliotheek — van tucht naar kennis!',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Spinhuispoortje.jpg/390px-Spinhuispoortje.jpg',
    color: '#ff6f61' // coral red
  },
  {
    lat: 52.372060,
    lng: 4.905604,
    title: 'Montelbaanstoren (Oudeschans 2)',
    description: 'De Montelbaanstoren werd in 1516 gebouwd als verdedigingstoren aan de Oude Schans. Later kreeg hij een sierlijke opbouw, maar door de slappe grond begon hij te verzakken. Men zegt dat paarden en kabels nodig waren om hem recht te houden. De klok liep zó slecht, dat Amsterdammers hem liefkozend “Malle Jaap” gingen noemen.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Oudeschans.jpg/500px-Oudeschans.jpg',
    color: '#ff6f61' // coral red
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
