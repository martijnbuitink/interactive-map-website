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
    lat: 52.36030775459272,
    lng: 4.888105913270245,
    title: 'Commiezenhuisje',
    description: 'Tot 1840 stond hier de Weteringpoort, een stadspoort uit 1668. Poort is een groot woord: feitelijk was het een onderdoorgang door de stadswal. Buiten de poort lag een lange houten brug over de Singelgracht. De poort werd afgebroken omdat de stad het onderhoud te duur vond. Ze werd vooral gebruikt voor de heffing van accijns op allerlei ingevoerde goederen. Hier kwamen veel groenten langs die via de Boerenwetering werden aangevoerd. Tegenwoordig zit hier het rioolgemaal in dat rioolwater helemaal naar west pompt!',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Commiezenhuis_Weteringschans.JPG/1200px-Commiezenhuis_Weteringschans.JPG',
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
    lat: 52.37303253574737,
    lng: 4.896940492292269,
    title: 'De sloppen en gangen van Amsterdam',
    description: 'Huisnummer 162 springt ineens door naar nr. 194! Waar zijn nummer 164, 166, 168, 170.. et cetera dan gebleven?! Amsterdam zit vol kleine straatjes en nauwe steegjes. Die kennen we allemaal en maken onze binnenstad ook zo knus. Maar het kan nog veel krapper. Naast de stegen kent Mokum namelijk ook talloze nog smallere doorgangetjes tussen de huizen. En die noemen we ‘sloppen en gangen’. Bijna altijd doodlopend en soms met binnentuin erachter. In die doodlopende gangetjes liepen de woningen gewoon door en de huisnummers dus ook.',
    image: 'https://amsterdam-walks.nl/wp-content/uploads/2022/06/Schoenmakersgang-Bernard-Eilers-1930-De-Van-der-Lindes-voor-hun-woning-Dienst-Volkshuisvesting-1933-980x420.jpg',
    color: '#3f51b5' // blue
  },
  {
    lat: 52.37327079472092,
    lng: 4.891887233161381,
    title: 'Publieke executies op De Dam',
    description: 'Het Paleis op de Dam is nu vooral een prachtig gebouw met een ceremoniële functie. Denk aan Koninklijke bezoeken en bijvoorbeeld de Dodenherdenking. Maar ooit was het een plaats waar recht werd gesproken en waar de meest gruwelijke straffen werden voltrokken. In de 17e eeuw was het Paleis namelijk het stadhuis van Amsterdam, waarin terdoodveroordeelden hun laatste minuten doorbrachten,. Ze zaten geknield op de koude marmeren vloer, omringd door de hoogste bestuurders van de stad die gezamenlijk met hen baden, wachtend op het schavot. Op de dag van de terechtstelling werd een houten stellage tegen het paleis opgebouwd waarop de straf werd voltrokken. In de paleismuren zaten gaten waar de draagbalken voor het schavot in werden geschoven. Deze gaten zijn inmiddels dichtgemetseld maar wel nog steeds zichtbaar.',
    image: 'https://www.amsterdam.nl/publish/pages/979434/700px/schavotgaten_klein.jpg',
    color: '#3f51b5' // blue
  },
  {
    lat: 52.37325012329611,
    lng: 4.892266261303745,
    title: 'Normaal Amsterdamse Pijl',
    description: 'Nederland ligt voor een groot deel onder zeeniveau, dus het meten van waterstanden is hier al eeuwenlang belangrijk. In 1675 leidde een grote overstroming in Amsterdam tot nieuwe dijken en sluizen. Burgemeester Johannes Hudde liet in 1683 in acht sluizen peilstenen plaatsen met een markering: de hoogte van de zeedijk boven het Amsterdams Peil (AP). Dat peil werd later de landelijke standaard.In 1818 werd het AP officieel de referentie voor heel Nederland. Vanaf 1875 werd het verder verfijnd en kreeg het de naam NAP: Normaal Amsterdams Peil. In 1953 werd op de Dam een speciaal referentiepunt aangebracht: een bronzen bout op een 22 meter diepe heipaal. Dit markeert het officiële nulpunt voor hoogtemetingen in ons land.',
    image: 'https://img.atlasobscura.com/4MhdqfsNiDbU-cKHcDhzYQgkNA1QSvKCg8QC_xN1ba4/rt:fit/w:1200/q:80/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy84N2I5/OWIzOTcwZjQ3MDRh/MGRfUF8yMDE5MTIy/NF8xNDE3MzMuanBn.webp',
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
  },
  {
    lat: 52.376454512517356,
    lng: 4.902270687792611,
    title: 'De Schreierstoren',
    description: 'Hier vertrokken schepen naar de zee, en hier namen geliefden afscheid. De naam komt van "Schreyhoeckstoren" (scherpe hoek), maar mensen dachten lang dat het “schreien” betekende – huilende vrouwen dus.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Schreierstoren2.jpg/399px-Schreierstoren2.jpg',
    color: '#ff6f61' // coral red
  },
  {
    lat: 52.36775644339379,
    lng: 4.891051830883985,
    title: 'De Rasphuispoort',
    description: 'In het Rasphuis – de eerste moderne Amsterdamse gevangenis – moesten dwangarbeiders Braziliaans hout tot poeder raspen en werden zij zwaar gestraft, soms zelfs onder water gezet. Later werd hier, ironisch genoeg, het eerste overdekte zwembad van Amsterdam gebouwd. In het reliëf op de poort zie je een wagen met Braziliaans hout en de Latijnse inscriptie die vrij vertaald luidt: ‘Wilde beesten moet men temmen’.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Rasphuis0.jpg/300px-Rasphuis0.jpg',
    color: '#ff6f61' // coral red
  },
  {
    lat: 52.365207122159916,
    lng: 4.900645904339913,
    title: 'Het huis met de bloedvlekken (Amstel 216)',
    description: 'Aan de Amstel op nummer 216 staat een prachtig stadspaleis met een duister verleden: het Huis met de Bloedvlekken. Zo genoemd omdat op de buitenmuren van het huis de eeuwenoude graffiti te zien is die oud-burgemeester Coenraad van Beuningen daar met zijn eigen bloed op de muren kalkte. De raadselachtige tekens zijn er om onverklaarbare redenen niet af te boenen en na honderden jaren nog duidelijk zichtbaar.',
    image: 'https://www.amsterdam.nl/publish/pages/827616/amstel216_bloedvlekken.jpg',
    color: '#ff6f61' // coral red
  },
  {
    lat: 52.381550216336564,
    lng: 4.889424927607641,
    title: 'De Huddesteen in de Eenhoornsluis',
    description: 'Wandel je langs de Eenhoornsluis, dan kijk je zo naar een stukje verborgen geschiedenis: de Huddesteen. Deze eenvoudige steen met een groef lijkt misschien onopvallend, maar sinds 1684 gaf hij de hoogte van de zeedijken aan ten opzichte van het "Amsterdams Peil" — een waterpeil waar heel Nederland zich op baseert. Genoemd naar burgemeester Johannes Hudde, was dit een van de acht stenen die verspreid over de stad het water nauwlettend in de gaten hielden. Eeuwenlang dacht men dat deze bij de Eenhoornsluis de enige overlevende was, tot er in 2013 plotseling een tweede opdook tijdens de sloop van De Nieuwe Brug bij het Damrak.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Huddesteen_eenhoornsluis.jpg/500px-Huddesteen_eenhoornsluis.jpg',
    color: '#ff6f61' // coral red
  },
  {
    lat: 52.34590803685165,
    lng: 4.902679890794791,
    title: 'Geheime zender in De Wolkenkrabber (Victorieplein 45)',
    description: 'In september 1944 werd vanuit een appartement in het 12-verdiepingenhuis, beter bekend onder de bijnaam De Wolkenkrabber, radiocontact gelegd met een Brits verkenningsvliegtuig. Verzetsman Dijckmeester zond daar twee weken lang belangrijke berichten naar Londen. Terwijl verzetsman Sonderman met een uitkijkploeg de wacht hield op straat, werkte een radiotelegrafist vanuit de flat aan het Daniël Willinkplein. Toen de Duitsers de zender bijna opspoorden, wist het team op tijd te ontsnappen en verplaatste de zendpost zich via Amsterdam naar Aalsmeer, Purmerend en Monnickendam.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/12-verdiepingenhuis_2019_%281%29.jpg/399px-12-verdiepingenhuis_2019_%281%29.jpg',
    color: '#ffee8c' // pastel yellow
  },
  {
    lat: 52.366311,
    lng: 4.892244,
    title: 'De Carlton-crash',
    description: 'Als je nu over de Reguliersdwarsstraat loopt dan zie je op deze plek een gebouw staan wat niet bij de andere gebouwen in deze straat past. In de nacht van 26 op 27 april 1943 om 02:34 is hier een Engelse bommenwerper neergestort die door een Duits vliegtuig was neergehaald. Daarbij werd een reeks gebouwen verwoest aan de Reguliersdwarsstraat en het Singel, waaronder het hotelgebouw Carlton, waar op dat ogenblik een vestiging van de Duitse Luftwaffe gevestigd was. De zeven bemanningsleden van het toestel kwamen allen om, op de grond vielen zes burgerdoden en drie Duitse militaire slachtoffers. De brand die na het neerstorten ontstond geldt als een van de grootste Amsterdamse stadsbranden, een compleet blok tussen het Singel en de Reguliersdwarsstraat werd in de as gelegd.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/HalifaxopCarlton1943.jpg/399px-HalifaxopCarlton1943.jpg',
    color: '#ffee8c' // pastel yellow
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
