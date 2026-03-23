// weTrAivel — Place Image Database
// Curated static Unsplash URLs. Full-res: 800px wide. Thumb: 400x400 crop.
// Lookup hierarchy: city → province → region → country → gradient fallback

const u = (id) => ({
  image_url: `https://images.unsplash.com/photo-${id}?auto=format&w=800&q=80`,
  thumb_url: `https://images.unsplash.com/photo-${id}?auto=format&w=400&h=400&fit=crop&q=70`,
})
const s = (q) => ({
  image_url: `https://source.unsplash.com/800x500/?${encodeURIComponent(q)}`,
  thumb_url: `https://source.unsplash.com/400x400/?${encodeURIComponent(q)}`,
})

export const PLACES = [

  // ────────────────────────────────────────
  // ITALY — IT
  // ────────────────────────────────────────
  { name: 'italy', display_name: 'Italy', type: 'country', country_code: 'IT', gradient: '#0f2027,#203a43,#2c5364', ...u('1552832230-c0197dd311b5') },

  // Regions
  { name: 'tuscany',          display_name: 'Tuscany',          aliases: ['toscana'],             type: 'region', country_code: 'IT', ...u('1543429776-2782fc8e1acd') },
  { name: 'sicily',           display_name: 'Sicily',           aliases: ['sicilia'],             type: 'region', country_code: 'IT', ...u('1555881400-74d7acaacd7e') },
  { name: 'sardinia',         display_name: 'Sardinia',         aliases: ['sardegna'],            type: 'region', country_code: 'IT', ...s('sardinia sea coast') },
  { name: 'lombardy',         display_name: 'Lombardy',         aliases: ['lombardia'],           type: 'region', country_code: 'IT', ...u('1520175480-d41f09571396') },
  { name: 'veneto',           display_name: 'Veneto',           type: 'region',                   country_code: 'IT', ...u('1514890547357-a9ee288728e0') },
  { name: 'lazio',            display_name: 'Lazio',            type: 'region',                   country_code: 'IT', ...u('1552832230-c0197dd311b5') },
  { name: 'campania',         display_name: 'Campania',         type: 'region',                   country_code: 'IT', ...s('naples italy coast') },
  { name: 'puglia',           display_name: 'Puglia',           aliases: ['apulia'],              type: 'region', country_code: 'IT', ...s('puglia trulli alberobello') },
  { name: 'emilia-romagna',   display_name: 'Emilia-Romagna',   type: 'region',                   country_code: 'IT', ...s('bologna italy') },
  { name: 'liguria',          display_name: 'Liguria',          type: 'region',                   country_code: 'IT', ...s('cinque terre liguria') },
  { name: 'piemonte',         display_name: 'Piemonte',         aliases: ['piedmont'],            type: 'region', country_code: 'IT', ...s('piedmont italy vineyard') },
  { name: 'calabria',         display_name: 'Calabria',         type: 'region',                   country_code: 'IT', ...s('calabria italy coast') },
  { name: 'marche',           display_name: 'Marche',           type: 'region',                   country_code: 'IT', ...s('marche italy hills') },
  { name: 'abruzzo',          display_name: 'Abruzzo',          type: 'region',                   country_code: 'IT', ...s('abruzzo italy mountains') },
  { name: 'umbria',           display_name: 'Umbria',           type: 'region',                   country_code: 'IT', ...s('umbria assisi italy') },
  { name: 'friuli',           display_name: 'Friuli-Venezia Giulia', aliases: ['friuli venezia giulia'], type: 'region', country_code: 'IT', ...s('trieste italy') },
  { name: 'trentino',         display_name: 'Trentino-Alto Adige', aliases: ['alto adige','südtirol'], type: 'region', country_code: 'IT', ...s('dolomites trentino italy') },
  { name: 'basilicata',       display_name: 'Basilicata',       type: 'region',                   country_code: 'IT', ...s('matera basilicata italy') },
  { name: 'molise',           display_name: 'Molise',           type: 'region',                   country_code: 'IT', ...s('molise italy village') },
  { name: 'valle-d-aosta',    display_name: "Valle d'Aosta",    aliases: ["valle d'aosta",'aosta valley'], type: 'region', country_code: 'IT', ...s('aosta valley alps italy') },

  // Italy — major cities & provinces
  { name: 'rome',       display_name: 'Rome',       aliases: ['roma'],         region: 'lazio',          type: 'city', country_code: 'IT', ...u('1552832230-c0197dd311b5') },
  { name: 'florence',   display_name: 'Florence',   aliases: ['firenze'],      region: 'tuscany',        type: 'city', country_code: 'IT', ...u('1543429776-2782fc8e1acd') },
  { name: 'venice',     display_name: 'Venice',     aliases: ['venezia'],      region: 'veneto',         type: 'city', country_code: 'IT', ...u('1514890547357-a9ee288728e0') },
  { name: 'milan',      display_name: 'Milan',      aliases: ['milano'],       region: 'lombardy',       type: 'city', country_code: 'IT', ...u('1520175480-d41f09571396') },
  { name: 'naples',     display_name: 'Naples',     aliases: ['napoli'],       region: 'campania',       type: 'city', country_code: 'IT', ...s('naples italy vesuvius') },
  { name: 'bologna',    display_name: 'Bologna',    type: 'city',              region: 'emilia-romagna', country_code: 'IT', ...s('bologna italy piazza') },
  { name: 'turin',      display_name: 'Turin',      aliases: ['torino'],       region: 'piemonte',       type: 'city', country_code: 'IT', ...s('turin torino italy') },
  { name: 'genoa',      display_name: 'Genoa',      aliases: ['genova'],       region: 'liguria',        type: 'city', country_code: 'IT', ...s('genoa genova italy port') },
  { name: 'palermo',    display_name: 'Palermo',    type: 'city',              region: 'sicily',         country_code: 'IT', ...u('1555881400-74d7acaacd7e') },
  { name: 'catania',    display_name: 'Catania',    type: 'city',              region: 'sicily',         country_code: 'IT', ...s('catania sicily etna') },
  { name: 'messina',    display_name: 'Messina',    type: 'city',              region: 'sicily',         country_code: 'IT', ...s('messina sicily strait') },
  { name: 'siracusa',   display_name: 'Syracuse',   aliases: ['syracuse'],     region: 'sicily',         type: 'city', country_code: 'IT', ...s('siracusa syracuse sicily') },
  { name: 'ragusa',     display_name: 'Ragusa',     type: 'city',              region: 'sicily',         country_code: 'IT', ...s('ragusa ibla sicily baroque') },
  { name: 'trapani',    display_name: 'Trapani',    type: 'city',              region: 'sicily',         country_code: 'IT', ...s('trapani sicily salt pans') },
  { name: 'agrigento',  display_name: 'Agrigento',  type: 'city',              region: 'sicily',         country_code: 'IT', ...s('agrigento valley of temples') },
  { name: 'caltanissetta', display_name: 'Caltanissetta', type: 'city',        region: 'sicily',         country_code: 'IT', ...s('caltanissetta sicily') },
  { name: 'enna',       display_name: 'Enna',       type: 'city',              region: 'sicily',         country_code: 'IT', ...s('enna sicily hilltop') },
  { name: 'bari',       display_name: 'Bari',       type: 'city',              region: 'puglia',         country_code: 'IT', ...s('bari puglia italy waterfront') },
  { name: 'lecce',      display_name: 'Lecce',      type: 'city',              region: 'puglia',         country_code: 'IT', ...s('lecce puglia baroque') },
  { name: 'alberobello',display_name: 'Alberobello', type: 'city',             region: 'puglia',         country_code: 'IT', ...s('alberobello trulli puglia') },
  { name: 'brindisi',   display_name: 'Brindisi',   type: 'city',              region: 'puglia',         country_code: 'IT', ...s('brindisi puglia') },
  { name: 'taranto',    display_name: 'Taranto',    type: 'city',              region: 'puglia',         country_code: 'IT', ...s('taranto puglia') },
  { name: 'foggia',     display_name: 'Foggia',     type: 'city',              region: 'puglia',         country_code: 'IT', ...s('foggia puglia gargano') },
  { name: 'verona',     display_name: 'Verona',     type: 'city',              region: 'veneto',         country_code: 'IT', ...s('verona arena italy') },
  { name: 'padova',     display_name: 'Padua',      aliases: ['padua'],        region: 'veneto',         type: 'city', country_code: 'IT', ...s('padua padova italy') },
  { name: 'treviso',    display_name: 'Treviso',    type: 'city',              region: 'veneto',         country_code: 'IT', ...s('treviso italy canal') },
  { name: 'vicenza',    display_name: 'Vicenza',    type: 'city',              region: 'veneto',         country_code: 'IT', ...s('vicenza italy palladian') },
  { name: 'trento',     display_name: 'Trento',     type: 'city',              region: 'trentino',       country_code: 'IT', ...s('trento italy dolomites') },
  { name: 'bolzano',    display_name: 'Bolzano',    aliases: ['bozen'],        region: 'trentino',       type: 'city', country_code: 'IT', ...s('bolzano alto adige dolomites') },
  { name: 'trieste',    display_name: 'Trieste',    type: 'city',              region: 'friuli',         country_code: 'IT', ...s('trieste italy waterfront') },
  { name: 'udine',      display_name: 'Udine',      type: 'city',              region: 'friuli',         country_code: 'IT', ...s('udine italy piazza') },
  { name: 'perugia',    display_name: 'Perugia',    type: 'city',              region: 'umbria',         country_code: 'IT', ...s('perugia umbria italy') },
  { name: 'assisi',     display_name: 'Assisi',     type: 'city',              region: 'umbria',         country_code: 'IT', ...s('assisi italy basilica') },
  { name: 'siena',      display_name: 'Siena',      type: 'city',              region: 'tuscany',        country_code: 'IT', ...s('siena tuscany piazza campo') },
  { name: 'pisa',       display_name: 'Pisa',       type: 'city',              region: 'tuscany',        country_code: 'IT', ...s('pisa leaning tower') },
  { name: 'lucca',      display_name: 'Lucca',      type: 'city',              region: 'tuscany',        country_code: 'IT', ...s('lucca tuscany walls') },
  { name: 'san-gimignano', display_name: 'San Gimignano', aliases: ['san gimignano'], region: 'tuscany', type: 'city', country_code: 'IT', ...s('san gimignano tuscany towers') },
  { name: 'arezzo',     display_name: 'Arezzo',     type: 'city',              region: 'tuscany',        country_code: 'IT', ...s('arezzo tuscany italy') },
  { name: 'grosseto',   display_name: 'Grosseto',   type: 'city',              region: 'tuscany',        country_code: 'IT', ...s('maremma tuscany coast') },
  { name: 'matera',     display_name: 'Matera',     type: 'city',              region: 'basilicata',     country_code: 'IT', ...s('matera sassi cave dwellings') },
  { name: 'potenza',    display_name: 'Potenza',    type: 'city',              region: 'basilicata',     country_code: 'IT', ...s('potenza basilicata italy') },
  { name: 'amalfi',     display_name: 'Amalfi',     type: 'city',              region: 'campania',       country_code: 'IT', ...s('amalfi coast positano') },
  { name: 'positano',   display_name: 'Positano',   type: 'city',              region: 'campania',       country_code: 'IT', ...s('positano amalfi coast') },
  { name: 'sorrento',   display_name: 'Sorrento',   type: 'city',              region: 'campania',       country_code: 'IT', ...s('sorrento italy coast') },
  { name: 'capri',      display_name: 'Capri',      type: 'city',              region: 'campania',       country_code: 'IT', ...s('capri island italy blue grotto') },
  { name: 'salerno',    display_name: 'Salerno',    type: 'city',              region: 'campania',       country_code: 'IT', ...s('salerno campania italy') },
  { name: 'caserta',    display_name: 'Caserta',    type: 'city',              region: 'campania',       country_code: 'IT', ...s('caserta royal palace') },
  { name: 'la-spezia',  display_name: 'La Spezia',  aliases: ['la spezia'],    region: 'liguria',        type: 'city', country_code: 'IT', ...s('cinque terre la spezia liguria') },
  { name: 'savona',     display_name: 'Savona',     type: 'city',              region: 'liguria',        country_code: 'IT', ...s('savona liguria italy') },
  { name: 'imperia',    display_name: 'Imperia',    type: 'city',              region: 'liguria',        country_code: 'IT', ...s('imperia liguria italy') },
  { name: 'bergamo',    display_name: 'Bergamo',    type: 'city',              region: 'lombardy',       country_code: 'IT', ...s('bergamo alta citta italy') },
  { name: 'brescia',    display_name: 'Brescia',    type: 'city',              region: 'lombardy',       country_code: 'IT', ...s('brescia italy piazza') },
  { name: 'como',       display_name: 'Como',       type: 'city',              region: 'lombardy',       country_code: 'IT', ...s('lake como italy') },
  { name: 'mantua',     display_name: 'Mantua',     aliases: ['mantova'],      region: 'lombardy',       type: 'city', country_code: 'IT', ...s('mantua mantova italy lake') },
  { name: 'pavia',      display_name: 'Pavia',      type: 'city',              region: 'lombardy',       country_code: 'IT', ...s('pavia italy certosa') },
  { name: 'cagliari',   display_name: 'Cagliari',   type: 'city',              region: 'sardinia',       country_code: 'IT', ...s('cagliari sardinia italy') },
  { name: 'sassari',    display_name: 'Sassari',    type: 'city',              region: 'sardinia',       country_code: 'IT', ...s('sassari sardinia') },
  { name: 'olbia',      display_name: 'Olbia',      type: 'city',              region: 'sardinia',       country_code: 'IT', ...s('olbia sardinia coast') },
  { name: 'nuoro',      display_name: 'Nuoro',      type: 'city',              region: 'sardinia',       country_code: 'IT', ...s('nuoro sardinia barbagia') },
  { name: 'ancona',     display_name: 'Ancona',     type: 'city',              region: 'marche',         country_code: 'IT', ...s('ancona marche italy') },
  { name: 'pesaro',     display_name: 'Pesaro',     type: 'city',              region: 'marche',         country_code: 'IT', ...s('pesaro urbino marche') },
  { name: 'l-aquila',   display_name: "L'Aquila",   aliases: ["l'aquila"],     region: 'abruzzo',        type: 'city', country_code: 'IT', ...s("l'aquila abruzzo italy") },
  { name: 'pescara',    display_name: 'Pescara',    type: 'city',              region: 'abruzzo',        country_code: 'IT', ...s('pescara abruzzo italy') },
  { name: 'reggio-calabria', display_name: 'Reggio Calabria', aliases: ['reggio calabria'], region: 'calabria', type: 'city', country_code: 'IT', ...s('reggio calabria italy strait') },
  { name: 'cosenza',    display_name: 'Cosenza',    type: 'city',              region: 'calabria',       country_code: 'IT', ...s('cosenza calabria italy') },
  { name: 'catanzaro',  display_name: 'Catanzaro',  type: 'city',              region: 'calabria',       country_code: 'IT', ...s('catanzaro calabria italy') },
  { name: 'ferrara',    display_name: 'Ferrara',    type: 'city',              region: 'emilia-romagna', country_code: 'IT', ...s('ferrara italy castle') },
  { name: 'modena',     display_name: 'Modena',     type: 'city',              region: 'emilia-romagna', country_code: 'IT', ...s('modena italy piazza') },
  { name: 'parma',      display_name: 'Parma',      type: 'city',              region: 'emilia-romagna', country_code: 'IT', ...s('parma italy duomo') },
  { name: 'ravenna',    display_name: 'Ravenna',    type: 'city',              region: 'emilia-romagna', country_code: 'IT', ...s('ravenna italy mosaic') },
  { name: 'rimini',     display_name: 'Rimini',     type: 'city',              region: 'emilia-romagna', country_code: 'IT', ...s('rimini italy beach') },
  { name: 'aosta',      display_name: 'Aosta',      type: 'city',              region: 'valle-d-aosta',  country_code: 'IT', ...s('aosta valley alps castle') },

  // ────────────────────────────────────────
  // SPAIN — ES
  // ────────────────────────────────────────
  { name: 'spain', display_name: 'Spain', type: 'country', country_code: 'ES', gradient: '#c0392b,#8e44ad,#2980b9', ...s('spain landmark travel') },

  // Regions
  { name: 'catalonia',      display_name: 'Catalonia',      aliases: ['cataluña','catalunya'], type: 'region', country_code: 'ES', ...s('barcelona catalonia spain') },
  { name: 'andalusia',      display_name: 'Andalusia',      aliases: ['andalucía'],            type: 'region', country_code: 'ES', ...s('andalusia spain alhambra') },
  { name: 'madrid-region',  display_name: 'Community of Madrid', type: 'region',              country_code: 'ES', ...s('madrid spain plaza mayor') },
  { name: 'basque-country', display_name: 'Basque Country', aliases: ['país vasco','euskadi'], type: 'region', country_code: 'ES', ...s('san sebastian basque spain') },
  { name: 'valencia-region',display_name: 'Valencia',       aliases: ['comunitat valenciana'], type: 'region', country_code: 'ES', ...s('valencia spain city arts') },
  { name: 'galicia',        display_name: 'Galicia',        type: 'region',                    country_code: 'ES', ...s('santiago de compostela galicia') },
  { name: 'balearic-islands',display_name:'Balearic Islands',aliases:['baleares','islas baleares'],type:'region',country_code:'ES',...s('mallorca balearic spain') },
  { name: 'canary-islands', display_name: 'Canary Islands', aliases: ['canarias','islas canarias'], type: 'region', country_code: 'ES', ...s('tenerife canary islands') },
  { name: 'castile-leon',   display_name: 'Castile and León', aliases: ['castilla y león'],   type: 'region', country_code: 'ES', ...s('salamanca spain cathedral') },
  { name: 'castile-la-mancha', display_name: 'Castile-La Mancha', aliases: ['castilla-la mancha'], type: 'region', country_code: 'ES', ...s('toledo spain alcazar') },
  { name: 'aragon',         display_name: 'Aragon',         aliases: ['aragón'],              type: 'region', country_code: 'ES', ...s('zaragoza aragon spain') },
  { name: 'asturias',       display_name: 'Asturias',       type: 'region',                   country_code: 'ES', ...s('asturias spain coast') },
  { name: 'cantabria',      display_name: 'Cantabria',      type: 'region',                   country_code: 'ES', ...s('santander cantabria spain') },
  { name: 'extremadura',    display_name: 'Extremadura',    type: 'region',                   country_code: 'ES', ...s('extremadura spain merida') },
  { name: 'murcia',         display_name: 'Murcia',         type: 'region',                   country_code: 'ES', ...s('cartagena murcia spain') },
  { name: 'navarre',        display_name: 'Navarre',        aliases: ['navarra'],             type: 'region', country_code: 'ES', ...s('pamplona navarra spain') },
  { name: 'la-rioja',       display_name: 'La Rioja',       type: 'region',                   country_code: 'ES', ...s('la rioja spain vineyard') },

  // Spain — cities
  { name: 'barcelona',      display_name: 'Barcelona',      region: 'catalonia',        type: 'city', country_code: 'ES', ...s('barcelona sagrada familia') },
  { name: 'madrid',         display_name: 'Madrid',         region: 'madrid-region',    type: 'city', country_code: 'ES', ...s('madrid spain gran via') },
  { name: 'seville',        display_name: 'Seville',        aliases: ['sevilla'],       region: 'andalusia', type: 'city', country_code: 'ES', ...s('seville sevilla cathedral') },
  { name: 'granada',        display_name: 'Granada',        region: 'andalusia',        type: 'city', country_code: 'ES', ...s('granada alhambra spain') },
  { name: 'malaga',         display_name: 'Málaga',         aliases: ['malaga'],        region: 'andalusia', type: 'city', country_code: 'ES', ...s('malaga spain coast') },
  { name: 'cordoba',        display_name: 'Córdoba',        aliases: ['cordoba'],       region: 'andalusia', type: 'city', country_code: 'ES', ...s('cordoba mezquita spain') },
  { name: 'cadiz',          display_name: 'Cádiz',          aliases: ['cadiz'],         region: 'andalusia', type: 'city', country_code: 'ES', ...s('cadiz spain sea') },
  { name: 'valencia',       display_name: 'Valencia',       region: 'valencia-region',  type: 'city', country_code: 'ES', ...s('valencia spain city of arts') },
  { name: 'bilbao',         display_name: 'Bilbao',         region: 'basque-country',   type: 'city', country_code: 'ES', ...s('bilbao guggenheim basque') },
  { name: 'san-sebastian',  display_name: 'San Sebastián',  aliases: ['san sebastian','donostia'], region: 'basque-country', type: 'city', country_code: 'ES', ...s('san sebastian donostia beach') },
  { name: 'santiago-de-compostela', display_name: 'Santiago de Compostela', region: 'galicia', type: 'city', country_code: 'ES', ...s('santiago de compostela cathedral') },
  { name: 'salamanca',      display_name: 'Salamanca',      region: 'castile-leon',     type: 'city', country_code: 'ES', ...s('salamanca spain university') },
  { name: 'toledo',         display_name: 'Toledo',         region: 'castile-la-mancha',type: 'city', country_code: 'ES', ...s('toledo spain skyline') },
  { name: 'zaragoza',       display_name: 'Zaragoza',       region: 'aragon',           type: 'city', country_code: 'ES', ...s('zaragoza spain basilica') },
  { name: 'palma',          display_name: 'Palma de Mallorca', aliases: ['palma de mallorca'], region: 'balearic-islands', type: 'city', country_code: 'ES', ...s('palma mallorca cathedral') },
  { name: 'ibiza',          display_name: 'Ibiza',          region: 'balearic-islands', type: 'city', country_code: 'ES', ...s('ibiza spain sea') },
  { name: 'menorca',        display_name: 'Menorca',        region: 'balearic-islands', type: 'city', country_code: 'ES', ...s('menorca spain coves') },
  { name: 'tenerife',       display_name: 'Tenerife',       region: 'canary-islands',   type: 'city', country_code: 'ES', ...s('tenerife teide canary') },
  { name: 'gran-canaria',   display_name: 'Gran Canaria',   region: 'canary-islands',   type: 'city', country_code: 'ES', ...s('gran canaria spain dunes') },
  { name: 'pamplona',       display_name: 'Pamplona',       region: 'navarre',          type: 'city', country_code: 'ES', ...s('pamplona spain old town') },
  { name: 'segovia',        display_name: 'Segovia',        region: 'castile-leon',     type: 'city', country_code: 'ES', ...s('segovia spain aqueduct') },
  { name: 'burgos',         display_name: 'Burgos',         region: 'castile-leon',     type: 'city', country_code: 'ES', ...s('burgos spain cathedral') },

  // ────────────────────────────────────────
  // PORTUGAL — PT
  // ────────────────────────────────────────
  { name: 'portugal', display_name: 'Portugal', type: 'country', country_code: 'PT', gradient: '#006400,#ff0000,#ffd700', ...s('lisbon portugal tram') },

  { name: 'algarve',      display_name: 'Algarve',       aliases: ['faro district'],    type: 'region', country_code: 'PT', ...s('algarve portugal cliffs') },
  { name: 'alentejo',     display_name: 'Alentejo',      type: 'region',                country_code: 'PT', ...s('alentejo portugal vineyard') },
  { name: 'douro-valley', display_name: 'Douro Valley',  aliases: ['douro'],            type: 'region', country_code: 'PT', ...s('douro valley porto wine') },
  { name: 'minho',        display_name: 'Minho',         type: 'region',                country_code: 'PT', ...s('minho portugal braga') },
  { name: 'madeira',      display_name: 'Madeira',       type: 'region',                country_code: 'PT', ...s('madeira island portugal') },
  { name: 'azores',       display_name: 'Azores',        aliases: ['açores'],           type: 'region', country_code: 'PT', ...s('azores portugal volcanic') },

  { name: 'lisbon',       display_name: 'Lisbon',        aliases: ['lisboa'],           type: 'city', country_code: 'PT', ...s('lisbon portugal tram alfama') },
  { name: 'porto',        display_name: 'Porto',         type: 'city',                  country_code: 'PT', ...s('porto portugal ribeira') },
  { name: 'sintra',       display_name: 'Sintra',        type: 'city',                  country_code: 'PT', ...s('sintra portugal palace') },
  { name: 'faro',         display_name: 'Faro',          type: 'city',                  region: 'algarve', country_code: 'PT', ...s('faro algarve portugal') },
  { name: 'lagos',        display_name: 'Lagos',         type: 'city',                  region: 'algarve', country_code: 'PT', ...s('lagos algarve portugal sea') },
  { name: 'albufeira',    display_name: 'Albufeira',     type: 'city',                  region: 'algarve', country_code: 'PT', ...s('albufeira algarve portugal') },
  { name: 'braga',        display_name: 'Braga',         type: 'city',                  region: 'minho',   country_code: 'PT', ...s('braga portugal sanctuary') },
  { name: 'coimbra',      display_name: 'Coimbra',       type: 'city',                  country_code: 'PT', ...s('coimbra portugal university') },
  { name: 'evora',        display_name: 'Évora',         aliases: ['evora'],            type: 'city', region: 'alentejo', country_code: 'PT', ...s('evora portugal roman temple') },
  { name: 'setubal',      display_name: 'Setúbal',       aliases: ['setubal'],          type: 'city', country_code: 'PT', ...s('setubal portugal coast') },
  { name: 'aveiro',       display_name: 'Aveiro',        type: 'city',                  country_code: 'PT', ...s('aveiro portugal canals') },
  { name: 'obidos',       display_name: 'Óbidos',        aliases: ['obidos'],           type: 'city', country_code: 'PT', ...s('obidos portugal castle walls') },
  { name: 'nazare',       display_name: 'Nazaré',        aliases: ['nazare'],           type: 'city', country_code: 'PT', ...s('nazare portugal surf waves') },
  { name: 'funchal',      display_name: 'Funchal',       region: 'madeira',             type: 'city', country_code: 'PT', ...s('funchal madeira portugal') },
  { name: 'ponta-delgada',display_name: 'Ponta Delgada', aliases: ['ponta delgada'],   region: 'azores', type: 'city', country_code: 'PT', ...s('ponta delgada azores') },
  { name: 'viana-do-castelo', display_name: 'Viana do Castelo', region: 'minho',       type: 'city', country_code: 'PT', ...s('viana do castelo portugal') },
  { name: 'guimaraes',    display_name: 'Guimarães',     aliases: ['guimaraes'],        type: 'city', region: 'minho', country_code: 'PT', ...s('guimaraes portugal castle') },
  { name: 'cascais',      display_name: 'Cascais',       type: 'city',                  country_code: 'PT', ...s('cascais portugal coast') },

  // ────────────────────────────────────────
  // GREECE — GR
  // ────────────────────────────────────────
  { name: 'greece', display_name: 'Greece', type: 'country', country_code: 'GR', gradient: '#003476,#0d5eaf,#ffffff', ...s('santorini greece blue domes') },

  { name: 'attica',            display_name: 'Attica',            aliases: ['attiki'],          type: 'region', country_code: 'GR', ...s('athens acropolis greece') },
  { name: 'crete',             display_name: 'Crete',             aliases: ['kriti'],           type: 'region', country_code: 'GR', ...s('crete greece gorge sea') },
  { name: 'peloponnese',       display_name: 'Peloponnese',       aliases: ['peloponnisos'],    type: 'region', country_code: 'GR', ...s('peloponnese greece ruins') },
  { name: 'thessaly',          display_name: 'Thessaly',          aliases: ['thessalia'],       type: 'region', country_code: 'GR', ...s('meteora thessaly greece') },
  { name: 'central-macedonia', display_name: 'Central Macedonia', aliases: ['kentriki makedonia'], type: 'region', country_code: 'GR', ...s('thessaloniki greece waterfront') },
  { name: 'ionian-islands',    display_name: 'Ionian Islands',    aliases: ['ionioi nisoi'],    type: 'region', country_code: 'GR', ...s('corfu ionian island greece') },
  { name: 'aegean-islands',    display_name: 'Aegean Islands',    type: 'region',               country_code: 'GR', ...s('cyclades aegean greece') },
  { name: 'dodecanese',        display_name: 'Dodecanese',        type: 'region',               country_code: 'GR', ...s('rhodes dodecanese greece') },
  { name: 'epirus',            display_name: 'Epirus',            type: 'region',               country_code: 'GR', ...s('epirus greece mountains') },
  { name: 'western-greece',    display_name: 'Western Greece',    type: 'region',               country_code: 'GR', ...s('patras western greece') },

  { name: 'athens',       display_name: 'Athens',       aliases: ['athina'],   region: 'attica',            type: 'city', country_code: 'GR', ...s('athens acropolis parthenon') },
  { name: 'thessaloniki', display_name: 'Thessaloniki', type: 'city',          region: 'central-macedonia', country_code: 'GR', ...s('thessaloniki greece white tower') },
  { name: 'santorini',    display_name: 'Santorini',    aliases: ['thira'],    region: 'aegean-islands',    type: 'city', country_code: 'GR', ...s('santorini oia blue domes') },
  { name: 'mykonos',      display_name: 'Mykonos',      region: 'aegean-islands', type: 'city',             country_code: 'GR', ...s('mykonos greece windmills') },
  { name: 'rhodes',       display_name: 'Rhodes',       aliases: ['rodos'],    region: 'dodecanese',        type: 'city', country_code: 'GR', ...s('rhodes old town greece') },
  { name: 'corfu',        display_name: 'Corfu',        aliases: ['kerkyra'], region: 'ionian-islands',    type: 'city', country_code: 'GR', ...s('corfu old town greece') },
  { name: 'zakynthos',    display_name: 'Zakynthos',    aliases: ['zante'],    region: 'ionian-islands',    type: 'city', country_code: 'GR', ...s('zakynthos navagio beach') },
  { name: 'cephalonia',   display_name: 'Cephalonia',   aliases: ['kefalonia'], region: 'ionian-islands',  type: 'city', country_code: 'GR', ...s('kefalonia greece beach') },
  { name: 'lefkada',      display_name: 'Lefkada',      region: 'ionian-islands', type: 'city',            country_code: 'GR', ...s('lefkada greece beach') },
  { name: 'heraklion',    display_name: 'Heraklion',    aliases: ['irakleio'], region: 'crete',            type: 'city', country_code: 'GR', ...s('heraklion crete greece harbour') },
  { name: 'chania',       display_name: 'Chania',       region: 'crete',       type: 'city',               country_code: 'GR', ...s('chania crete greece old port') },
  { name: 'rethymno',     display_name: 'Rethymno',     region: 'crete',       type: 'city',               country_code: 'GR', ...s('rethymno crete greece') },
  { name: 'meteora',      display_name: 'Meteora',      region: 'thessaly',    type: 'city',               country_code: 'GR', ...s('meteora monasteries greece') },
  { name: 'delphi',       display_name: 'Delphi',       region: 'central-greece', type: 'city',           country_code: 'GR', ...s('delphi oracle greece ruins') },
  { name: 'olympia',      display_name: 'Olympia',      region: 'peloponnese', type: 'city',               country_code: 'GR', ...s('ancient olympia greece') },
  { name: 'nafplio',      display_name: 'Nafplio',      region: 'peloponnese', type: 'city',               country_code: 'GR', ...s('nafplio peloponnese greece') },
  { name: 'patras',       display_name: 'Patras',       region: 'western-greece', type: 'city',           country_code: 'GR', ...s('patras greece waterfront') },
  { name: 'ios',          display_name: 'Ios',          region: 'aegean-islands', type: 'city',           country_code: 'GR', ...s('ios cyclades greece') },
  { name: 'naxos',        display_name: 'Naxos',        region: 'aegean-islands', type: 'city',           country_code: 'GR', ...s('naxos greece beach') },
  { name: 'paros',        display_name: 'Paros',        region: 'aegean-islands', type: 'city',           country_code: 'GR', ...s('paros greece beach') },
  { name: 'milos',        display_name: 'Milos',        region: 'aegean-islands', type: 'city',           country_code: 'GR', ...s('milos sarakiniko beach greece') },
  { name: 'kos',          display_name: 'Kos',          region: 'dodecanese',  type: 'city',              country_code: 'GR', ...s('kos dodecanese greece') },

  // ────────────────────────────────────────
  // MALTA — MT
  // ────────────────────────────────────────
  { name: 'malta', display_name: 'Malta', type: 'country', country_code: 'MT', gradient: '#cf0921,#ffffff,#cf0921', ...s('valletta malta harbour') },

  { name: 'valletta',     display_name: 'Valletta',     type: 'city', country_code: 'MT', ...s('valletta malta grand harbour') },
  { name: 'gozo',         display_name: 'Gozo',         aliases: ['ghawdex'], type: 'city', country_code: 'MT', ...s('gozo azure window malta') },
  { name: 'mdina',        display_name: 'Mdina',        type: 'city', country_code: 'MT', ...s('mdina malta silent city') },
  { name: 'sliema',       display_name: 'Sliema',       type: 'city', country_code: 'MT', ...s('sliema malta waterfront') },
  { name: 'st-julians',   display_name: "St Julian's",  aliases: ["st julian's",'san giljan'], type: 'city', country_code: 'MT', ...s('st julians malta') },
  { name: 'marsaxlokk',   display_name: 'Marsaxlokk',   type: 'city', country_code: 'MT', ...s('marsaxlokk malta fishing boats') },
  { name: 'blue-lagoon',  display_name: 'Blue Lagoon',  aliases: ['blue lagoon','comino'], type: 'city', country_code: 'MT', ...s('comino blue lagoon malta') },
  { name: 'mellieha',     display_name: 'Mellieħa',     aliases: ['mellieha'], type: 'city', country_code: 'MT', ...s('mellieha malta beach') },
  { name: 'birgu',        display_name: 'Birgu',        aliases: ['vittoriosa'], type: 'city', country_code: 'MT', ...s('birgu vittoriosa malta') },

  // ────────────────────────────────────────
  // CYPRUS — CY
  // ────────────────────────────────────────
  { name: 'cyprus', display_name: 'Cyprus', type: 'country', country_code: 'CY', gradient: '#003480,#ffffff,#ff9900', ...s('cyprus blue sea coast') },

  { name: 'nicosia',    display_name: 'Nicosia',    aliases: ['lefkosia'], type: 'city', country_code: 'CY', ...s('nicosia cyprus old city') },
  { name: 'limassol',   display_name: 'Limassol',   aliases: ['lemesos'], type: 'city', country_code: 'CY', ...s('limassol cyprus waterfront') },
  { name: 'paphos',     display_name: 'Paphos',     aliases: ['pafos'],   type: 'city', country_code: 'CY', ...s('paphos cyprus aphrodite') },
  { name: 'larnaca',    display_name: 'Larnaca',    aliases: ['larnaka'], type: 'city', country_code: 'CY', ...s('larnaca cyprus salt lake') },
  { name: 'famagusta',  display_name: 'Famagusta',  aliases: ['gazimagusa','ammochostos'], type: 'city', country_code: 'CY', ...s('famagusta cyprus ruins') },
  { name: 'kyrenia',    display_name: 'Kyrenia',    aliases: ['girne'],   type: 'city', country_code: 'CY', ...s('kyrenia harbour cyprus') },
  { name: 'ayia-napa',  display_name: 'Ayia Napa',  aliases: ['ayia napa','agia napa'], type: 'city', country_code: 'CY', ...s('ayia napa cyprus beach') },
  { name: 'troodos',    display_name: 'Troodos',    type: 'city', country_code: 'CY', ...s('troodos mountains cyprus') },

  // ────────────────────────────────────────
  // FRANCE — FR
  // ────────────────────────────────────────
  { name: 'france', display_name: 'France', type: 'country', country_code: 'FR', gradient: '#002395,#ffffff,#ED2939', ...s('paris eiffel tower france') },

  // Regions
  { name: 'ile-de-france',    display_name: 'Île-de-France',       aliases: ['ile de france'],      type: 'region', country_code: 'FR', ...s('paris france eiffel louvre') },
  { name: 'provence',         display_name: 'Provence-Alpes-Côte d\'Azur', aliases: ['paca','provence','cote d\'azur'], type: 'region', country_code: 'FR', ...s('provence lavender france') },
  { name: 'normandy',         display_name: 'Normandy',            aliases: ['normandie'],          type: 'region', country_code: 'FR', ...s('normandy france cliffs') },
  { name: 'brittany',         display_name: 'Brittany',            aliases: ['bretagne'],           type: 'region', country_code: 'FR', ...s('brittany france coast') },
  { name: 'alsace',           display_name: 'Alsace',              type: 'region',                  country_code: 'FR', ...s('alsace france colmar') },
  { name: 'burgundy',         display_name: 'Burgundy',            aliases: ['bourgogne'],          type: 'region', country_code: 'FR', ...s('burgundy france vineyard') },
  { name: 'loire-valley',     display_name: 'Loire Valley',        aliases: ['centre-val de loire'], type: 'region', country_code: 'FR', ...s('loire valley chateau france') },
  { name: 'dordogne',         display_name: 'Dordogne',            type: 'region',                  country_code: 'FR', ...s('dordogne perigord france') },
  { name: 'occitanie',        display_name: 'Occitanie',           type: 'region',                  country_code: 'FR', ...s('carcassonne occitanie france') },
  { name: 'new-aquitaine',    display_name: 'Nouvelle-Aquitaine',  aliases: ['nouvelle aquitaine'],  type: 'region', country_code: 'FR', ...s('bordeaux france wine') },
  { name: 'auvergne',         display_name: 'Auvergne-Rhône-Alpes',aliases: ['auvergne rhone alpes'], type: 'region', country_code: 'FR', ...s('chamonix alps france') },
  { name: 'french-riviera',   display_name: 'French Riviera',      aliases: ['côte d\'azur','cote d\'azur'], type: 'region', country_code: 'FR', ...s('french riviera nice cote azur') },
  { name: 'corsica',          display_name: 'Corsica',             aliases: ['corse'],              type: 'region', country_code: 'FR', ...s('corsica france island sea') },

  // France — cities
  { name: 'paris',       display_name: 'Paris',       region: 'ile-de-france', type: 'city', country_code: 'FR', ...s('paris eiffel tower night') },
  { name: 'nice',        display_name: 'Nice',        region: 'french-riviera', type: 'city', country_code: 'FR', ...s('nice france promenade anglais') },
  { name: 'cannes',      display_name: 'Cannes',      region: 'french-riviera', type: 'city', country_code: 'FR', ...s('cannes france riviera') },
  { name: 'monaco',      display_name: 'Monaco',      type: 'city', country_code: 'FR', ...s('monaco monte carlo harbour') },
  { name: 'marseille',   display_name: 'Marseille',   region: 'provence', type: 'city', country_code: 'FR', ...s('marseille france harbour') },
  { name: 'lyon',        display_name: 'Lyon',        region: 'auvergne', type: 'city', country_code: 'FR', ...s('lyon france old town') },
  { name: 'bordeaux',    display_name: 'Bordeaux',    region: 'new-aquitaine', type: 'city', country_code: 'FR', ...s('bordeaux france bridge') },
  { name: 'strasbourg',  display_name: 'Strasbourg',  region: 'alsace', type: 'city', country_code: 'FR', ...s('strasbourg alsace christmas market') },
  { name: 'colmar',      display_name: 'Colmar',      region: 'alsace', type: 'city', country_code: 'FR', ...s('colmar alsace france canal') },
  { name: 'toulouse',    display_name: 'Toulouse',    region: 'occitanie', type: 'city', country_code: 'FR', ...s('toulouse france pink city') },
  { name: 'montpellier', display_name: 'Montpellier', region: 'occitanie', type: 'city', country_code: 'FR', ...s('montpellier france place comedy') },
  { name: 'avignon',     display_name: 'Avignon',     region: 'provence', type: 'city', country_code: 'FR', ...s('avignon france palace popes') },
  { name: 'aix-en-provence', display_name: 'Aix-en-Provence', region: 'provence', type: 'city', country_code: 'FR', ...s('aix en provence france') },
  { name: 'chamonix',    display_name: 'Chamonix',    region: 'auvergne', type: 'city', country_code: 'FR', ...s('chamonix mont blanc france') },
  { name: 'annecy',      display_name: 'Annecy',      region: 'auvergne', type: 'city', country_code: 'FR', ...s('annecy france lake canal') },
  { name: 'carcassonne', display_name: 'Carcassonne', region: 'occitanie', type: 'city', country_code: 'FR', ...s('carcassonne citadel france') },
  { name: 'mont-saint-michel', display_name: 'Mont Saint-Michel', region: 'normandy', type: 'city', country_code: 'FR', ...s('mont saint michel france') },
  { name: 'versailles',  display_name: 'Versailles',  region: 'ile-de-france', type: 'city', country_code: 'FR', ...s('versailles palace gardens') },
  { name: 'dijon',       display_name: 'Dijon',       region: 'burgundy', type: 'city', country_code: 'FR', ...s('dijon burgundy france') },
  { name: 'nantes',      display_name: 'Nantes',      region: 'brittany', type: 'city', country_code: 'FR', ...s('nantes france castle') },
  { name: 'ajaccio',     display_name: 'Ajaccio',     region: 'corsica', type: 'city', country_code: 'FR', ...s('ajaccio corsica france') },

  // ────────────────────────────────────────
  // UNITED KINGDOM — GB
  // ────────────────────────────────────────
  { name: 'united-kingdom', display_name: 'United Kingdom', aliases: ['uk','britain','great britain'], type: 'country', country_code: 'GB', gradient: '#012169,#C8102E,#ffffff', ...s('london big ben thames') },

  // Nations/Regions
  { name: 'england',   display_name: 'England',  type: 'region', country_code: 'GB', ...s('england countryside rolling hills') },
  { name: 'scotland',  display_name: 'Scotland', type: 'region', country_code: 'GB', ...s('scotland highlands loch') },
  { name: 'wales',     display_name: 'Wales',    type: 'region', country_code: 'GB', ...s('wales castle coast') },
  { name: 'northern-ireland', display_name: 'Northern Ireland', type: 'region', country_code: 'GB', ...s('northern ireland giants causeway') },
  { name: 'cotswolds', display_name: 'Cotswolds', type: 'region', country_code: 'GB', region: 'england', ...s('cotswolds village england') },
  { name: 'lake-district', display_name: 'Lake District', type: 'region', country_code: 'GB', region: 'england', ...s('lake district england mountains') },
  { name: 'yorkshire', display_name: 'Yorkshire', type: 'region', country_code: 'GB', region: 'england', ...s('yorkshire dales england') },
  { name: 'cornwall',  display_name: 'Cornwall',  type: 'region', country_code: 'GB', region: 'england', ...s('cornwall england sea coast') },

  // UK — cities
  { name: 'london',     display_name: 'London',     region: 'england',  type: 'city', country_code: 'GB', ...s('london tower bridge thames') },
  { name: 'edinburgh',  display_name: 'Edinburgh',  region: 'scotland', type: 'city', country_code: 'GB', ...s('edinburgh castle scotland') },
  { name: 'oxford',     display_name: 'Oxford',     region: 'england',  type: 'city', country_code: 'GB', ...s('oxford university england') },
  { name: 'cambridge',  display_name: 'Cambridge',  region: 'england',  type: 'city', country_code: 'GB', ...s('cambridge punting river england') },
  { name: 'bath',       display_name: 'Bath',       region: 'england',  type: 'city', country_code: 'GB', ...s('bath england roman baths') },
  { name: 'bristol',    display_name: 'Bristol',    region: 'england',  type: 'city', country_code: 'GB', ...s('bristol england suspension bridge') },
  { name: 'manchester', display_name: 'Manchester', region: 'england',  type: 'city', country_code: 'GB', ...s('manchester england city') },
  { name: 'liverpool',  display_name: 'Liverpool',  region: 'england',  type: 'city', country_code: 'GB', ...s('liverpool england waterfront') },
  { name: 'york',       display_name: 'York',       region: 'england',  type: 'city', country_code: 'GB', ...s('york minster england medieval') },
  { name: 'brighton',   display_name: 'Brighton',   region: 'england',  type: 'city', country_code: 'GB', ...s('brighton pier england sea') },
  { name: 'glasgow',    display_name: 'Glasgow',    region: 'scotland', type: 'city', country_code: 'GB', ...s('glasgow scotland architecture') },
  { name: 'inverness',  display_name: 'Inverness',  region: 'scotland', type: 'city', country_code: 'GB', ...s('inverness scotland highlands') },
  { name: 'st-andrews', display_name: 'St Andrews', region: 'scotland', type: 'city', country_code: 'GB', ...s('st andrews scotland golf') },
  { name: 'cardiff',    display_name: 'Cardiff',    region: 'wales',    type: 'city', country_code: 'GB', ...s('cardiff wales castle') },
  { name: 'belfast',    display_name: 'Belfast',    region: 'northern-ireland', type: 'city', country_code: 'GB', ...s('belfast northern ireland titanic') },
  { name: 'stratford-upon-avon', display_name: 'Stratford-upon-Avon', region: 'england', type: 'city', country_code: 'GB', ...s('stratford upon avon shakespeare england') },

  // ────────────────────────────────────────
  // SWITZERLAND — CH
  // ────────────────────────────────────────
  { name: 'switzerland', display_name: 'Switzerland', type: 'country', country_code: 'CH', gradient: '#FF0000,#ffffff,#FF0000', ...s('switzerland alps lake') },

  // Cantons
  { name: 'zurich-canton',  display_name: 'Zurich',      aliases: ['zürich canton'], type: 'region', country_code: 'CH', ...s('zurich switzerland lake') },
  { name: 'bern-canton',    display_name: 'Bern',        type: 'region',             country_code: 'CH', ...s('bern switzerland old town') },
  { name: 'geneva-canton',  display_name: 'Geneva',      aliases: ['genève canton'], type: 'region', country_code: 'CH', ...s('geneva switzerland lake') },
  { name: 'valais',         display_name: 'Valais',      aliases: ['wallis'],        type: 'region', country_code: 'CH', ...s('valais zermatt matterhorn') },
  { name: 'vaud',           display_name: 'Vaud',        type: 'region',             country_code: 'CH', ...s('vaud lausanne switzerland') },
  { name: 'ticino',         display_name: 'Ticino',      type: 'region',             country_code: 'CH', ...s('ticino lugano switzerland') },
  { name: 'graubunden',     display_name: 'Graubünden',  aliases: ['grisons','graubünden'], type: 'region', country_code: 'CH', ...s('graubunden st moritz switzerland') },
  { name: 'lucerne-canton', display_name: 'Lucerne',     aliases: ['luzern canton'], type: 'region', country_code: 'CH', ...s('lucerne switzerland chapel bridge') },
  { name: 'appenzell',      display_name: 'Appenzell',   type: 'region',             country_code: 'CH', ...s('appenzell switzerland village') },
  { name: 'fribourg',       display_name: 'Fribourg',    aliases: ['freiburg'],      type: 'region', country_code: 'CH', ...s('fribourg switzerland medieval') },

  // Switzerland — cities
  { name: 'zurich',       display_name: 'Zurich',      aliases: ['zürich'],      region: 'zurich-canton',  type: 'city', country_code: 'CH', ...s('zurich switzerland old town lake') },
  { name: 'geneva',       display_name: 'Geneva',      aliases: ['genève'],      region: 'geneva-canton',  type: 'city', country_code: 'CH', ...s('geneva switzerland fountain lake') },
  { name: 'bern',         display_name: 'Bern',        type: 'city',             region: 'bern-canton',    country_code: 'CH', ...s('bern switzerland bear clock tower') },
  { name: 'basel',        display_name: 'Basel',       type: 'city',             country_code: 'CH',       ...s('basel switzerland rhine') },
  { name: 'lucerne',      display_name: 'Lucerne',     aliases: ['luzern'],      region: 'lucerne-canton', type: 'city', country_code: 'CH', ...s('lucerne switzerland chapel bridge lake') },
  { name: 'interlaken',   display_name: 'Interlaken',  region: 'bern-canton',    type: 'city',             country_code: 'CH', ...s('interlaken switzerland alps lakes') },
  { name: 'zermatt',      display_name: 'Zermatt',     region: 'valais',         type: 'city',             country_code: 'CH', ...s('zermatt matterhorn switzerland') },
  { name: 'lausanne',     display_name: 'Lausanne',    region: 'vaud',           type: 'city',             country_code: 'CH', ...s('lausanne switzerland lake leman') },
  { name: 'lugano',       display_name: 'Lugano',      region: 'ticino',         type: 'city',             country_code: 'CH', ...s('lugano switzerland lake ticino') },
  { name: 'montreux',     display_name: 'Montreux',    region: 'vaud',           type: 'city',             country_code: 'CH', ...s('montreux switzerland lake castle') },
  { name: 'locarno',      display_name: 'Locarno',     region: 'ticino',         type: 'city',             country_code: 'CH', ...s('locarno ticino switzerland lake') },
  { name: 'grindelwald',  display_name: 'Grindelwald', region: 'bern-canton',    type: 'city',             country_code: 'CH', ...s('grindelwald switzerland eiger') },
  { name: 'st-moritz',    display_name: 'St. Moritz',  aliases: ['st moritz'],   region: 'graubunden',     type: 'city', country_code: 'CH', ...s('st moritz engadin switzerland lake') },

  // ────────────────────────────────────────
  // GERMANY — DE
  // ────────────────────────────────────────
  { name: 'germany', display_name: 'Germany', type: 'country', country_code: 'DE', gradient: '#000000,#DD0000,#FFCE00', ...s('germany neuschwanstein castle') },

  // States
  { name: 'bavaria',             display_name: 'Bavaria',              aliases: ['bayern'],                    type: 'region', country_code: 'DE', ...s('bavaria germany alps neuschwanstein') },
  { name: 'berlin-state',        display_name: 'Berlin',               type: 'region',                         country_code: 'DE', ...s('berlin germany brandenburger') },
  { name: 'hamburg-state',       display_name: 'Hamburg',              type: 'region',                         country_code: 'DE', ...s('hamburg germany speicherstadt') },
  { name: 'nrw',                 display_name: 'North Rhine-Westphalia',aliases: ['nordrhein-westfalen','nrw'], type: 'region', country_code: 'DE', ...s('cologne cathedral nrw germany') },
  { name: 'bw',                  display_name: 'Baden-Württemberg',    aliases: ['baden württemberg'],          type: 'region', country_code: 'DE', ...s('heidelberg black forest germany') },
  { name: 'saxony',              display_name: 'Saxony',               aliases: ['sachsen'],                   type: 'region', country_code: 'DE', ...s('dresden saxony germany frauenkirche') },
  { name: 'rhineland-palatinate',display_name: 'Rhineland-Palatinate', aliases: ['rheinland-pfalz'],           type: 'region', country_code: 'DE', ...s('rhine valley germany castle') },
  { name: 'thuringia',           display_name: 'Thuringia',            aliases: ['thüringen'],                 type: 'region', country_code: 'DE', ...s('weimar thuringia germany') },
  { name: 'black-forest',        display_name: 'Black Forest',         aliases: ['schwarzwald'],               type: 'region', country_code: 'DE', ...s('black forest germany trees') },
  { name: 'romantic-road',       display_name: 'Romantic Road',        aliases: ['romantische straße'],        type: 'region', country_code: 'DE', ...s('rothenburg tauber germany medieval') },

  // Germany — cities
  { name: 'berlin',       display_name: 'Berlin',       region: 'berlin-state',  type: 'city', country_code: 'DE', ...s('berlin germany gate night') },
  { name: 'munich',       display_name: 'Munich',       aliases: ['münchen'],    region: 'bavaria',        type: 'city', country_code: 'DE', ...s('munich marienplatz germany') },
  { name: 'hamburg',      display_name: 'Hamburg',      region: 'hamburg-state', type: 'city', country_code: 'DE', ...s('hamburg harbour germany') },
  { name: 'cologne',      display_name: 'Cologne',      aliases: ['köln'],       region: 'nrw',            type: 'city', country_code: 'DE', ...s('cologne cathedral germany rhine') },
  { name: 'frankfurt',    display_name: 'Frankfurt',    region: 'nrw',           type: 'city', country_code: 'DE', ...s('frankfurt germany skyline') },
  { name: 'heidelberg',   display_name: 'Heidelberg',   region: 'bw',            type: 'city', country_code: 'DE', ...s('heidelberg castle germany river') },
  { name: 'dresden',      display_name: 'Dresden',      region: 'saxony',        type: 'city', country_code: 'DE', ...s('dresden frauenkirche germany') },
  { name: 'nuremberg',    display_name: 'Nuremberg',    aliases: ['nürnberg'],   region: 'bavaria',        type: 'city', country_code: 'DE', ...s('nuremberg germany medieval') },
  { name: 'rothenburg',   display_name: 'Rothenburg ob der Tauber', region: 'bavaria', type: 'city', country_code: 'DE', ...s('rothenburg tauber germany wall') },
  { name: 'fussen',       display_name: 'Füssen',       aliases: ['füssen'],     region: 'bavaria',        type: 'city', country_code: 'DE', ...s('fussen neuschwanstein castle germany') },
  { name: 'bamberg',      display_name: 'Bamberg',      region: 'bavaria',       type: 'city', country_code: 'DE', ...s('bamberg germany old town') },
  { name: 'stuttgart',    display_name: 'Stuttgart',    region: 'bw',            type: 'city', country_code: 'DE', ...s('stuttgart germany mercedes') },
  { name: 'freiburg',     display_name: 'Freiburg',     region: 'bw',            type: 'city', country_code: 'DE', ...s('freiburg im breisgau germany') },
  { name: 'dusseldorf',   display_name: 'Düsseldorf',   aliases: ['düsseldorf'], region: 'nrw',            type: 'city', country_code: 'DE', ...s('düsseldorf germany rhine') },
  { name: 'bonn',         display_name: 'Bonn',         region: 'nrw',           type: 'city', country_code: 'DE', ...s('bonn germany beethoven') },
  { name: 'leipzig',      display_name: 'Leipzig',      region: 'saxony',        type: 'city', country_code: 'DE', ...s('leipzig germany old city hall') },
  { name: 'bremen',       display_name: 'Bremen',       type: 'city',            country_code: 'DE',       ...s('bremen germany market square') },
  { name: 'weimar',       display_name: 'Weimar',       region: 'thuringia',     type: 'city', country_code: 'DE', ...s('weimar germany goethe') },
  { name: 'trier',        display_name: 'Trier',        region: 'rhineland-palatinate', type: 'city', country_code: 'DE', ...s('trier germany porta nigra roman') },
  { name: 'regensburg',   display_name: 'Regensburg',   region: 'bavaria',       type: 'city', country_code: 'DE', ...s('regensburg germany danube medieval') },
]

// Build lookup maps
const byName = {}
const byAlias = {}

for (const p of PLACES) {
  byName[p.name] = p
  if (p.aliases) {
    for (const a of p.aliases) byAlias[a.toLowerCase()] = p
  }
}

// Normalize a place name for lookup
function normalize(str) {
  return str?.toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[àáâã]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c').replace(/[ß]/g, 'ss')
    .replace(/[^\w-]/g, '') || ''
}

/**
 * Get image for a place name.
 * Falls back: city → region → country → null
 */
export function getPlaceImage(cityName, countryCode) {
  if (!cityName) return null
  const key = normalize(cityName)

  // 1. Exact name match
  if (byName[key]) return byName[key]

  // 2. Alias match
  const aliasKey = cityName.toLowerCase().trim()
  if (byAlias[aliasKey]) return byAlias[aliasKey]

  // 3. Country fallback
  if (countryCode) {
    const cc = countryCode.toUpperCase()
    const country = PLACES.find(p => p.type === 'country' && p.country_code === cc)
    if (country) return country
  }

  return null
}

/** Get country flag emoji from country_code */
export function getFlag(countryCode) {
  if (!countryCode) return '🌍'
  const cc = countryCode.toUpperCase()
  return String.fromCodePoint(
    ...cc.split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  )
}

/** Get gradient for a trip based on first stop's country */
export function getTripGradient(countryCode) {
  const country = PLACES.find(p => p.type === 'country' && p.country_code === countryCode?.toUpperCase())
  return country?.gradient || '0f2027,203a43,2c5364'
}
