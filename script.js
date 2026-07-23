// Navigation toggle for small screens
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle?.addEventListener('click', ()=>{
  mainNav.classList.toggle('open');
});

// SVG interactivity
const bodySvg = document.getElementById('bodySvg');
bodySvg?.addEventListener('mouseover', e=>{
  const target = e.target;
  if(target?.dataset?.part){
    target.setAttribute('fill', 'var(--accent-2)');
  }
});
bodySvg?.addEventListener('mouseout', e=>{
  const target = e.target;
  if(target?.dataset?.part){
    target.setAttribute('fill', 'var(--muted)');
  }
});
bodySvg?.addEventListener('click', e=>{
  const target = e.target;
  if(target?.dataset?.part){
    showInfoPopup(e.clientX, e.clientY, target.dataset.part);
  }
});

// Generic SVG part info map
const partInfo = {
  'Cuore':'Cuore — pompa muscolare che mantiene il flusso sanguigno.',
  'Arterie':'Arterie — vasi che conducono sangue ossigenato ai tessuti.',
  'Vene':'Vene — vasi che riportano il sangue al cuore.',
  'Trachea':'Trachea — condotto aereo che connette la laringe ai bronchi.',
  'PolmoneSinistro':'Polmone sinistro — organo della respirazione (2 lobi).',
  'PolmoneDestro':'Polmone destro — organo della respirazione (3 lobi).',
  'Cervello':'Cervello — centro di controllo principale del sistema nervoso.',
  'MidolloSpinale':'Midollo spinale — conduce segnali tra cervello e corpo.',
  'Stomaco':'Stomaco — scompone il cibo con succhi gastrici.',
  'Intestino':'Intestino — assorbe nutrienti e processa residui.',
  'Esophagus':'Esofago — tubo che sposta il cibo dallo stomaco.'
};

function showInfoPopup(x,y,part){
  const text = partInfo[part] || part;
  // remove existing
  document.querySelectorAll('.info-popup').forEach(n=>n.remove());
  const div = document.createElement('div');
  div.className = 'info-popup';
  div.textContent = text;
  document.body.appendChild(div);
  // position near click
  const pad = 12;
  const rect = div.getBoundingClientRect();
  let left = x + pad;
  let top = y + pad;
  if(left + rect.width > window.innerWidth) left = x - rect.width - pad;
  if(top + rect.height > window.innerHeight) top = y - rect.height - pad;
  div.style.left = left + 'px';
  div.style.top = top + 'px';
  // dismiss on click outside or after 6s
  setTimeout(()=>div.remove(),6000);
  div.addEventListener('click', e=>e.stopPropagation());
  window.addEventListener('click', ()=>div.remove(), {once:true});
}

const topicData = {
  cellula: {
    title: 'Cellula',
    text: 'La cellula è l’unità fondamentale della vita: contiene il DNA, produce energia e svolge funzioni specifiche.'
  },
  tessuti: {
    title: 'Tessuti',
    text: 'I tessuti sono gruppi di cellule simili che lavorano insieme: epiteliale, connettivo, muscolare e nervoso.'
  },
  organi: {
    title: 'Organi',
    text: 'Gli organi sono strutture complesse formate da più tessuti, come cuore, polmone, fegato e cervello.'
  },
  apparati: {
    title: 'Apparati',
    text: 'Gli apparati coordinano organi e tessuti per svolgere funzioni vitali come respirazione, digestione e movimento.'
  }
};

const topicButtons = document.querySelectorAll('.topic-btn');
const topicPanel = document.getElementById('topicPanel');

topicButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    topicButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const data = topicData[btn.dataset.topic];
    if (topicPanel && data) {
      topicPanel.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p>`;
    }
  });
});

// Gallery modal
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');
document.querySelectorAll('.gallery-item').forEach(img=>{
  img.addEventListener('click', ()=>{
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modal.setAttribute('aria-hidden','false');
  });
});
modalClose?.addEventListener('click', ()=>modal.setAttribute('aria-hidden','true'));
modal?.addEventListener('click', e=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true')});

// Quiz app
const quizQuestions = [
  {q:'Dove si trova il cuore?', opts:['Sopra lo stomaco','A sinistra del centro del torace','Nel cranio'], a:1},
  {q:'Qual è la funzione principale dei polmoni?', opts:['Filtrare il sangue','Scambio gassoso O2/CO2','Produrre ormoni'], a:1},
  {q:'Quale struttura trasmette segnali nervosi?', opts:['Muscoli','NeuronI','Vasi sanguigni'], a:1},
  {q:'Dove avviene la maggior parte dell\'assorbimento dei nutrienti?', opts:['Stomaco','Intestino tenue','Fegato'], a:1}
];
let quizIndex = 0, quizScore = 0, quizAnswered = false;
const qText = document.getElementById('qText');
const qOpts = document.getElementById('qOpts');
const nextQ = document.getElementById('nextQ');
const quizScoreEl = document.getElementById('quizScore');

function renderQuestion(i){
  const item = quizQuestions[i];
  qText.textContent = item.q;
  qOpts.innerHTML = '';
  item.opts.forEach((opt,idx)=>{
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.addEventListener('click', ()=>selectAnswer(idx));
    qOpts.appendChild(btn);
  });
  quizAnswered = false;
  quizScoreEl.textContent = `Punteggio: ${quizScore}/${quizQuestions.length}`;
}

function selectAnswer(idx){
  if(quizAnswered) return;
  quizAnswered = true;
  const correct = quizQuestions[quizIndex].a === idx;
  if(correct) quizScore++;
  quizScoreEl.textContent = correct ? 'Corretto! ' + `Punteggio: ${quizScore}/${quizQuestions.length}` : 'Errato. ' + `Punteggio: ${quizScore}/${quizQuestions.length}`;
}

nextQ?.addEventListener('click', ()=>{
  if(quizIndex < quizQuestions.length -1){
    quizIndex++;
    renderQuestion(quizIndex);
  } else {
    // finish
    qText.textContent = `Quiz terminato — Punteggio finale ${quizScore}/${quizQuestions.length}`;
    qOpts.innerHTML = '';
    nextQ.style.display = 'none';
  }
});

// Initialize quiz if present
if(qText) renderQuestion(0);

// Search utility
const siteSearch = document.getElementById('siteSearch');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const searchIndex = [
  {title:'Cuore', text:'Il cuore pompa sangue e mantiene il flusso circolatorio. Condizioni: ipertensione, infarto miocardico, aritmie.', tags:['cuore','cardio','ipertensione','infarto','arteria','sistema circolatorio'], url:'circolatorio.html'},
  {title:'Polmoni', text:'I polmoni scambiano ossigeno e anidride carbonica. Condizioni: asma, bronchite, polmonite, BPCO.', tags:['polmoni','respiratorio','asma','bronchite','polmonite','bpco','respiro'], url:'respiratorio.html'},
  {title:'Cervello', text:'Il cervello controlla funzioni sensoriali, motorie e cognitive. Condizioni: ictus, emicrania, epilessia, trauma cranico.', tags:['cervello','nervoso','ictus','emorragia','epilessia','sistema nervoso'], url:'nervoso.html'},
  {title:'Stomaco', text:'Lo stomaco digerisce il cibo con succhi gastrici. Condizioni: gastrite, ulcera, reflusso gastroesofageo, dispepsia.', tags:['stomaco','gastrite','ulcera','reflusso','digestione','digestivo'], url:'digerente.html'},
  {title:'Intestino', text:'L’intestino assorbe nutrienti e gestisce i residui. Condizioni: colite, sindrome dell’intestino irritabile, diarrea.', tags:['intestino','colon','digerente','colite','intestino irritabile','assorbimento'], url:'digerente.html'},
  {title:'Apparato urinario', text:'Include reni, ureteri, vescica e uretra. Condizioni: calcoli, infezioni urinarie, insufficienza renale, cistite e pielonefrite.', tags:['urina','reni','vescica','calcoli','infezione urinaria','uretra','cistite','pielonefrite'], url:'urinario.html'},
  {title:'Sistema linfatico', text:'Il sistema linfatico trasporta linfa, supporta la difesa immunitaria e mantiene l’equilibrio dei liquidi. Condizioni: linfedema, linfoma, infezioni linfatiche, adenopatia e linfangite.', tags:['linfatico','linfa','linfedema','linfoma','immunitario','linfonodi','linfangite'], url:'linfatico.html'},
  {title:'Apparato riproduttore', text:'Organi sessuali e riproduttivi maschili e femminili. Condizioni: endometriosi, infertilità, prostatite, menopausa e ciclo mestruale.', tags:['riproduttore','fertilità','endometriosi','prostata','pubertà','ovuli','sperma','menopausa'], url:'riproduttore.html'},
  {title:'Scheletro', text:'Le ossa sostengono il corpo e proteggono gli organi. Condizioni: osteoporosi, fratture, artrite e scoliosi.', tags:['osso','scheletro','osteoporosi','frattura','artrosi','ossa','scoliosi'], url:'scheletro.html'},
  {title:'Sistema immunitario', text:'Il sistema immunitario difende l’organismo da virus, batteri e agenti patogeni. Termini correlati: vaccinazione, anticorpi, linfociti.', tags:['immunitario','virus','batteri','anticorpi','vaccino','linfociti']},
  {title:'Diabete', text:'Il diabete è una condizione metabolica caratterizzata da alti livelli di zucchero nel sangue; include tipo 1 e tipo 2.', tags:['diabete','glicemia','insulina','metabolismo','iperglicemia']},
  {title:'Influenza', text:'L’influenza è un’infezione virale acuta delle vie respiratorie, con febbre, dolori muscolari e tosse.', tags:['influenza','virus','febbre','tosse','sintomi']},
  {title:'Vaccino', text:'Un vaccino stimola il sistema immunitario per prevenire malattie infettive come influenza, COVID-19 e morbillo.', tags:['vaccino','immunizzazione','preventivo','siero','anticorpi']},
  {title:'Antibiotico', text:'Gli antibiotici combattono le infezioni batteriche ma non funzionano sui virus; l’uso corretto è importante per evitare resistenza.', tags:['antibiotico','batteri','resistenza','farmacia','infezione']},
  {title:'Dialisi', text:'La dialisi è un trattamento medico che sostituisce la funzione dei reni in caso di insufficienza renale.', tags:['dialisi','reni','insufficienza renale','emodialisi','terapia']},
  {title:'Cancro', text:'Il cancro è la proliferazione incontrollata di cellule anomale; include tumori benigni e maligni.', tags:['cancro','tumore','oncologia','chemioterapia','metastasi']},
  {title:'Ictus', text:'L’ictus è un’interruzione del flusso sanguigno al cervello: ischemico o emorragico; richiede intervento medico urgente.', tags:['ictus','cervello','ischemia','emorragia','vascolare']},
  {title:'Gastrite', text:'La gastrite è l’infiammazione della mucosa gastrica, spesso legata a stress, alimentazione o infezione da Helicobacter pylori.', tags:['gastrite','stomaco','helicobacter','infiammazione','ulcera']},
  {title:'Linfoma', text:'Il linfoma è un tumore del sistema linfatico che interessa linfonodi, milza e altri tessuti immunitari.', tags:['linfoma','sistema linfatico','tumore','noduli','oncologia']},
  {title:'Allergia', text:'L’allergia è una reazione eccessiva del sistema immunitario a sostanze normalmente innocue come polline, cibo o farmaci.', tags:['allergia','immunitario','rinite','orticaria','anafilassi']},
  {title:'Anemia', text:'L’anemia è una riduzione dell’emoglobina o dei globuli rossi; può causare affaticamento, pallore e mancanza di respiro.', tags:['anemia','emoglobina','globuli rossi','pallore','affaticamento']},
  {title:'Pressione sanguigna', text:'La pressione sanguigna indica la forza del sangue contro le pareti arteriose; ipertensione aumenta il rischio cardiovascolare.', tags:['pressione','ipertensione','sistolica','diastolica','sangue']},
  {title:'Colesterolo', text:'Il colesterolo è un lipide nel sangue; valori elevati possono aumentare il rischio di aterosclerosi e malattie cardiache.', tags:['colesterolo','lipidi','colesterolo alto','colesterolo LDL','placca']}
];

function renderSearchResults(results, query){
  if(!searchResults) return;
  if(!results.length){
    searchResults.innerHTML = `<p>Nessun risultato trovato per «${query}». Prova parole chiave mediche diverse.</p>`;
    return;
  }
  searchResults.innerHTML = results.map(item=>
    `<article class="card"><h3>${item.title}</h3><p>${item.text}</p>${item.url ? `<p><a href="${item.url}" class="btn ghost">Vai a ${item.title}</a></p>` : ''}</article>`
  ).join('');
}

function runSearch(){
  const query = siteSearch?.value.trim().toLowerCase();
  if(!query){
    searchResults.innerHTML = '<p>Inserisci un termine di ricerca per trovare informazioni.</p>';
    return;
  }
  const results = searchIndex.filter(item=>
    item.title.toLowerCase().includes(query) ||
    item.text.toLowerCase().includes(query) ||
    item.tags?.some(tag=>tag.toLowerCase().includes(query))
  );
  renderSearchResults(results, query);
}

searchBtn?.addEventListener('click', runSearch);
siteSearch?.addEventListener('keydown', e=>{ if(e.key==='Enter') runSearch(); });

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth'});
    }
  })
});
