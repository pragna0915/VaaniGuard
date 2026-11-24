(() => {
  const terms = {
    t1: 'Start your 7-day trial for ₹499. After the trial ends, your plan automatically renews at ₹999/month until you cancel.',
    t2: 'Payments are non-refundable once the trial period has started.',
    t3: 'A platform fee of ₹49 and a handling charge of ₹30 are added at the final payment step.'
  };
  const findings = [
    { id:'auto_renewal', severity:'high', label:'HIGH RISK', title:'Auto-renewal detected', sentenceId:'t1', evidence:terms.t1, explanation:{en:'You’ll be charged ₹999 each month after the 7-day trial unless you cancel.',hi:'7 दिन के ट्रायल के बाद रद्द न करने पर हर महीने ₹999 का शुल्क लगेगा।',kn:'7 ದಿನಗಳ ಪ್ರಯೋಗದ ನಂತರ ರದ್ದುಗೊಳಿಸದಿದ್ದರೆ ಪ್ರತಿ ತಿಂಗಳು ₹999 ಶುಲ್ಕ ವಿಧಿಸಲಾಗುತ್ತದೆ.'} },
    { id:'non_refundable', severity:'medium', label:'MEDIUM', title:'Non-refundable purchase', sentenceId:'t2', evidence:terms.t2, explanation:{en:'Once the trial starts, you can’t get your money back.',hi:'ट्रायल शुरू होने के बाद आपको पैसे वापस नहीं मिलेंगे।',kn:'ಪ್ರಯೋಗ ಪ್ರಾರಂಭವಾದ ನಂತರ ನಿಮ್ಮ ಹಣವನ್ನು ಹಿಂತಿರುಗಿಸಲಾಗುವುದಿಲ್ಲ.'} },
    { id:'extra_fees', severity:'medium', label:'MEDIUM', title:'Extra checkout fees', sentenceId:'t3', evidence:terms.t3, explanation:{en:'₹79 extra will be added on top of the ₹499 you see: you’ll pay ₹578.',hi:'दिखाए गए ₹499 के अलावा ₹79 जुड़ेंगे: कुल ₹578 देने होंगे।',kn:'ತೋರಿಸಿರುವ ₹499 ಜೊತೆಗೆ ₹79 ಸೇರುತ್ತದೆ: ಒಟ್ಟು ₹578 ಪಾವತಿಸಬೇಕು.'} }
  ];
  const translations = {
    hi:{'Auto-renewal detected':'अपने-आप सदस्यता नवीनीकृत होगी','Non-refundable purchase':'पैसे वापस नहीं होंगे','Extra checkout fees':'चेकआउट पर अतिरिक्त शुल्क','What this means:':'इसका मतलब:','EVIDENCE FROM THE TERMS':'शर्तों से प्रमाण','Read this clause':'यह शर्त पढ़ें','Take a closer look.':'ध्यान से देखें।','We found 3 things worth knowing before you decide.':'फ़ैसला करने से पहले जानने योग्य 3 बातें मिलीं।','Make it easier to understand':'समझना आसान बनाएं','Listen to the summary':'सारांश सुनें'},
    kn:{'Auto-renewal detected':'ಸ್ವಯಂಚಾಲಿತ ನವೀಕರಣ ಕಂಡುಬಂದಿದೆ','Non-refundable purchase':'ಹಣ ಮರುಪಾವತಿ ಇಲ್ಲ','Extra checkout fees':'ಹೆಚ್ಚುವರಿ ಚೆಕ್‌ಔಟ್ ಶುಲ್ಕಗಳು','What this means:':'ಇದರ ಅರ್ಥ:','EVIDENCE FROM THE TERMS':'ನಿಯಮಗಳಿಂದ ಸಾಕ್ಷ್ಯ','Read this clause':'ಈ ನಿಯಮ ಓದಿ','Take a closer look.':'ಒಮ್ಮೆ ಗಮನಿಸಿ ನೋಡಿ.','We found 3 things worth knowing before you decide.':'ನಿರ್ಧರಿಸುವ ಮೊದಲು ತಿಳಿಯಬೇಕಾದ 3 ವಿಷಯಗಳು ಸಿಕ್ಕಿವೆ.','Make it easier to understand':'ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸುಲಭಗೊಳಿಸಿ','Listen to the summary':'ಸಾರಾಂಶವನ್ನು ಆಲಿಸಿ'}
  };
  const $ = (id) => document.getElementById(id);
  const guardian = $('guardian'), scrim = $('scrim'), toast = $('toast');
  let toastTimer, lastFocus, activeFindings = findings;

  function renderFindings(language='en') {
    const tr = translations[language] || {};
    $('findingList').innerHTML = activeFindings.map((f) => {
      const evidence = document.querySelector(`#${f.sentenceId} p`)?.textContent.trim() || f.evidence;
      return `<article class="finding ${f.severity}">
        <div class="finding-title-row"><span class="severity">${f.label}</span><h3>${tr[f.title] || f.title}</h3></div>
        <div class="finding-copy"><b>${tr['What this means:'] || 'What this means:'}</b> ${f.explanation[language] || f.explanation.en}</div>
        <span class="evidence-label">${tr['EVIDENCE FROM THE TERMS'] || 'EVIDENCE FROM THE TERMS'}</span>
        <button class="evidence-button" data-target="${f.sentenceId}" aria-label="${tr['Read this clause'] || 'Read this clause'}: ${evidence}"><span>↗</span> “${evidence}”</button>
      </article>`;
    }).join('');
    $('findingList').querySelectorAll('.evidence-button').forEach(button => button.addEventListener('click', () => highlightTerm(button.dataset.target)));
  }
  function openPanel() {
    lastFocus = document.activeElement;
    guardian.classList.add('open'); scrim.classList.add('open'); document.body.classList.add('panel-open');
    guardian.setAttribute('aria-hidden','false'); $('closePanel').focus();
  }
  function closePanel() {
    guardian.classList.remove('open'); scrim.classList.remove('open'); document.body.classList.remove('panel-open');
    guardian.setAttribute('aria-hidden','true'); window.speechSynthesis?.cancel(); lastFocus?.focus?.();
  }
  function notify(message) {
    toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  function highlightTerm(id) {
    closePanel();
    const term = $(id); if (!term) return;
    term.scrollIntoView({behavior:'smooth',block:'center'});
    term.classList.remove('highlight'); void term.offsetWidth; term.classList.add('highlight');
    setTimeout(() => term.classList.remove('highlight'), 1700);
  }
  function extractFindings() {
    const text = Object.values(terms).map((_, index) => $('t'+(index+1)).textContent.toLowerCase()).join(' ');
    return findings.filter(f => {
      const clause = $(f.sentenceId)?.textContent.toLowerCase() || '';
      if (f.id === 'auto_renewal') return /automatically renew|auto.?renew/.test(clause);
      if (f.id === 'non_refundable') return /non.?refundable|no refund/.test(clause);
      return /fee|charge/.test(clause) && /₹\s*\d/.test(clause);
    }).filter(f => text.includes(f.id === 'auto_renewal' ? 'renew' : f.id === 'non_refundable' ? 'refund' : 'fee'));
  }
  function runCheck() {
    const button = $('checkBtn'); button.disabled = true; button.classList.add('busy');
    button.querySelector('span:first-child').textContent = 'Reading the terms…';
    setTimeout(() => {
      const matches = extractFindings(); activeFindings = matches;
      if (!matches.length) {
        $('findingList').innerHTML = '<div class="clean-result"><span>✓</span><h3>No risky terms found in this sample.</h3><p>We didn’t spot any of the warning patterns covered by this demo.</p></div>';
      } else {
        renderFindings($('languageSelect').value);
      }
      button.disabled = false; button.classList.remove('busy'); button.querySelector('span:first-child').textContent = 'Check this purchase';
      $('report-summary-title').textContent = matches.length ? 'Take a closer look.' : 'Looking good so far.';
      $('report-summary-copy').textContent = matches.length ? `We found ${matches.length} things worth knowing before you decide.` : 'No matching warning patterns were found in this sample.';
      $('finding-count').textContent = `${matches.length} ${matches.length === 1 ? 'FINDING' : 'FINDINGS'}`;
      openPanel();
    }, 850);
  }
  $('checkBtn').addEventListener('click', runCheck);
  $('closePanel').addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);
  $('reviewBtn').addEventListener('click', () => highlightTerm('t1'));
  $('continueBtn').addEventListener('click', () => { closePanel(); notify('You chose to continue. This sample checkout will not take a payment.'); });
  $('showTerms').addEventListener('click', () => $('termsSection').scrollIntoView({behavior:'smooth',block:'start'}));
  $('languageSelect').addEventListener('change', e => {
    const language = e.target.value;
    const tr = translations[language] || {};
    if (activeFindings.length) renderFindings(language);
    $('report-summary-title').textContent = activeFindings.length ? (tr['Take a closer look.'] || 'Take a closer look.') : 'Looking good so far.';
    $('report-summary-copy').textContent = activeFindings.length ? (tr['We found 3 things worth knowing before you decide.'] || `We found ${activeFindings.length} things worth knowing before you decide.`) : 'No matching warning patterns were found in this sample.';
    document.querySelector('.language-row label').textContent = tr['Make it easier to understand'] || 'Make it easier to understand';
    $('listenLabel').textContent = tr['Listen to the summary'] || 'Listen to the summary';
    document.documentElement.lang = language === 'hi' ? 'hi' : language === 'kn' ? 'kn' : 'en';
  });
  $('listenBtn').addEventListener('click', () => {
    if (!('speechSynthesis' in window)) { notify('Speech playback is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const language = $('languageSelect').value;
    const message = activeFindings.map(f => `${f.title}. ${f.explanation[language] || f.explanation.en}`).join(' ');
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  });
  $('helpBtn').addEventListener('click', () => $('aboutDialog').showModal());
  $('closeDialog').addEventListener('click', () => $('aboutDialog').close());
  $('dialogOk').addEventListener('click', () => $('aboutDialog').close());
  $('aboutDialog').addEventListener('click', e => { if (e.target === $('aboutDialog')) $('aboutDialog').close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && guardian.classList.contains('open')) closePanel(); });

  // The clean variation is a simple URL switch for demonstrations: ?clean=1.
  if (new URLSearchParams(location.search).has('clean')) {
    $('t1').textContent = 'Your membership stays active for 7 days. It will not renew automatically.';
    $('t2').textContent = 'You can request a full refund within 7 days of your purchase.';
    $('t3').textContent = 'The displayed price includes all applicable taxes and service fees.';
    document.querySelector('.price-period').innerHTML = 'for 7 days<br><span>no automatic renewal</span>';
    $('checkBtn').classList.add('clean-button');
  }
  renderFindings();
})();

