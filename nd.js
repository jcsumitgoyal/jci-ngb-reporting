/* =========================================================
   JCI INDIA — NATIONAL DIRECTORS' REPORTS
   Seven portfolios, each with its own official format.
   ND  → fills and submits their own portfolio report
   ZP / NVP / NEC → read-only view of every ND report
   ADMIN → may open and edit any ND report
   These reports are standalone: nothing is consolidated
   from or into the ZP/NVP reports.
========================================================= */

/* ---- shared section builders ---- */
const ND_COMM = { type:'fields', title:'Communication &amp; Correspondence', key:'comm', cols:[
  ['eventsPromoted','No. of Events Promoted (WhatsApp)'],
  ['promotions','No. Promotions Released (Wishes &amp; Info\u2019s)'],
  ['fbInsta','No. of Facebook / Instagram Promotions'],
  ['letters','No of Letters (Emails)'],
  ['losVisited','No. of LOs Visited'],
  ['phoneCalls','No. of Phone Calls'],
  ['sms','No. of SMS Promotion'],
  ['special','Any Special Communication','text'],
]};
const ND_POA = { type:'text', key:'poaActivity',
  title:'As per the JCI India\u2019s Plan of Action, the next 3 months of activity' };
const ND_PORTFOLIO_TARGETS = { type:'text', key:'portfolioTargets',
  title:'Targets for my portfolio (if any) — month wise and overall' };
const ND_ACTIONS = { type:'rows', key:'actions',
  title:'Actions to be taken as per the plan of action',
  note:'Add as many rows as needed.',
  cols:[['month','Month','text'],['target','Target','text'],['plan','Execution Plan','text'],
        ['deadline','Deadline','date'],['status','Status (Completed or Not)','text']] };

const ND_ZONE_PROGRAMS = { type:'zone', key:'zonePrograms',
  title:'Major Programs held in the Zone',
  cols:[['date','Date','date'],['name','Program / Project Name','text'],
        ['lo','LO Name','text'],['ben','No of Beneficiary','number']] };

const ND_ZD_MEETINGS = { type:'rows', key:'zdMeetings',
  title:'Details about Zone Directors Meeting conducted during the period',
  cols:[['date','Date','date'],['details','Meeting Details','text'],
        ['attendance','Zone Directors Attendance','text']] };
const ND_ACTION_MARKS = { type:'rows', key:'actionMarks', title:'Action Marks (if any)',
  cols:[['mark','Action Mark','text'],['status','Status','text']] };
const ND_RECOGNITIONS = (label) => ({ type:'rows', key:'recognitions', title:(label||'ND')+' Recognitions',
  cols:[['recognition','Recognition','text'],['status','Status','text']] });
const ND_COORDINATORS = { type:'rows', key:'coordinators',
  title:'Performance of National Coordinators (Excellent / Good / Average / Poor)',
  cols:[['name','Name','text'],['portfolio','Portfolio','text'],
        ['ngb2','2nd NGB','text'],['ngb3','3rd NGB','text'],['ngb4','4th NGB','text']] };
const ND_REMARKS = { type:'text', key:'remarks', title:'Remarks' };
const ND_OFFICERS_VISIT = { type:'zone', key:'officersVisit', title:'Officers Visit Status',
  cols:[['np','NP Visit Date','date'],['nvp1','NVP 1st Visit Date','date'],
        ['nvp2','NVP 2nd Visit Date','date'],['remarks','Remarks','text']] };
const ND_NATIONAL_PROGRAMS = { type:'rows', key:'nationalPrograms',
  title:'Major Programs held at National level under your portfolio',
  cols:[['date','Date','date'],['name','Event / Program / Project Name','text'],
        ['host','Host LO Name and Zone','text'],['part','No of Participants','number']] };
const ND_SPECIAL = (label) => ({ type:'rows', key:'specialPrograms',
  title:'Special Programs based on NP\u2019s Vision &amp; POA',
  note:label,
  cols:[['zone','Zone','text'],['date','Date','date'],['name','Program / Project Name','text'],
        ['lo','LO Name','text'],['ben','No of Beneficiary','number']] });

/* ---- the seven portfolios ---- */
const ND_PORTFOLIOS = {
  gd: { name:'Growth &amp; Development', role:'National Director', sections:[
    ND_COMM,
    { type:'statusTA', key:'status', title:'Membership Status',
      rows:[['mem','Membership'],['fc','Foundation Contribution']] },
    { type:'zoneTA', key:'indiaStatus', title:'2026 JCI India Status',
      cols:[['mem','Membership'],['contribution','Contribution'],['centurion','Centurion LO\u2019s'],
            ['growth100','100% Growth LOs'],['newLOs','New LO\u2019s'],['ladyLOs','Lady LO\u2019s'],
            ['jrjc','JrJc Members']] },
    { type:'zoneText', key:'efforts', title:'Efforts taken to make Zone positive / growth in membership',
      col:'Efforts to be taken' },
    { type:'zoneTA', key:'foundation', title:'Foundation Contribution Details',
      note:'Target and Achieved for each title.',
      cols:[['hgf','HGF'],['jfm','JFM'],['jfd','JFD'],['jfa','JFA'],['jfp','JFP'],['jfs','JFS'],
            ['jfg','JFG'],['rpp','RPP'],['jfr','JFR'],['jfj','JFJ'],['jfk','JFK'],['sen','SEN'],['ppp','PPP']] },
    { type:'zone', key:'otherContribution', title:'Any Other Contribution Details',
      cols:[['jcsat','JCSAT','text'],['natconSponsor','NATCON Sponsor','text'],
            ['pdm','PDM','text'],['other','Any Other','text']] },
    { type:'zone', key:'zonePrograms', title:'Major G &amp; D related Programs held in the Zone',
      cols:[['date','Date','date'],['name','Program / Project Name','text'],
            ['lo','LO Name','text'],['ben','No of Beneficiary','number']] },
    ND_ZD_MEETINGS, ND_POA, ND_PORTFOLIO_TARGETS, ND_ACTIONS,
    ND_ACTION_MARKS, ND_RECOGNITIONS('ND'), ND_COORDINATORS, ND_REMARKS,
  ]},
  business: { name:'Business', role:'National Director', sections:[
    ND_COMM, ND_POA, ND_PORTFOLIO_TARGETS, ND_ACTIONS,
    { type:'zone', key:'jcom', title:'JCOM Report',
      cols:[['tables','No of Tables','number'],['partners','No of Partners','number'],
            ['business','Business Transacted','text'],['newTables','No of New Tables','number'],
            ['newPartners','No of New Partners','number'],['newMembers','No of New Members to JCI','number']] },
    { type:'zone', key:'zonePrograms', title:'Major Programs held in the Zone (CYE, B2B, Business Expo, etc.)',
      cols:[['date','Date','date'],['name','Event / Program / Project Name','text'],
            ['lo','LO Name','text'],['ben','No of Beneficiary','number']] },
    ND_NATIONAL_PROGRAMS, ND_SPECIAL(''), ND_ZD_MEETINGS,
    ND_ACTION_MARKS, ND_RECOGNITIONS('ND'), ND_COORDINATORS, ND_REMARKS,
  ]},
  community: { name:'Community Development', role:'National Director', sections:[
    ND_COMM, ND_POA, ND_PORTFOLIO_TARGETS, ND_ACTIONS,
    ND_ZONE_PROGRAMS, ND_NATIONAL_PROGRAMS,
    ND_SPECIAL('OLOS / DHAN / CLOCK TOWER / ADOPT A CHILD / CLEAN PLATE CHALLENGE'),
    ND_ZD_MEETINGS, ND_ACTION_MARKS, ND_RECOGNITIONS('ND'), ND_COORDINATORS, ND_REMARKS,
  ]},
  training: { name:'Training', role:'National Director', sections:[
    ND_COMM, ND_POA, ND_PORTFOLIO_TARGETS, ND_ACTIONS,
    { type:'zoneTA', key:'events', title:'Events Participation Details',
      note:'Target and Achieved for each event.',
      cols:[['eps','EPS'],['capp','CAPP'],['jaf','JAF'],['ztws','ZTWS'],
            ['trainingDay','Training Day'],['nttts','NTTTS'],['nalanda','NALANDA'],['outbound','Outbound Training']] },
    { type:'zone', key:'zonePrograms',
      title:'Major Training Programs held in the Zone (JCI Courses, Future, Trainers Day, etc.)',
      cols:[['date','Date','date'],['name','Event Name','text'],
            ['host','Host LO','text'],['part','No of Participants','number']] },
    { type:'rows', key:'nationalPrograms', title:'Major Training Programs held at the National Level',
      cols:[['date','Date','date'],['name','Event Name','text'],
            ['host','Host LO and Zone','text'],['part','No of Participants','number']] },
    ND_SPECIAL(''), ND_ZD_MEETINGS,
    ND_ACTION_MARKS, ND_RECOGNITIONS('ND'), ND_COORDINATORS, ND_REMARKS,
  ]},
  management: { name:'Management', role:'National Director', sections:[
    ND_COMM, ND_POA, ND_PORTFOLIO_TARGETS, ND_ACTIONS,
    { type:'zone', key:'mrf', title:'MRF Status (in %)',
      cols:[['jan','Jan','number'],['feb','Feb','number'],['mar','Mar','number'],['apr','Apr','number'],
            ['may','May','number'],['jun','Jun','number'],['jul','Jul','number'],['aug','Aug','number'],
            ['sep','Sep','number'],['oct','Oct','number'],['nov','Nov','number']] },
    { type:'zoneTA', key:'events', title:'Events Participation Details',
      note:'Target and Achieved for each event.',
      cols:[['lots','LOTS'],['pa','PA'],['midcon','MIDCON'],['r2r','R2R'],
            ['aps','APS'],['star','STAR'],['parl','Mr. Parliamentarian'],['zonecon','ZONECON']] },
    { type:'zone', key:'zonePrograms', title:'Major Events held in the Zone',
      cols:[['date','Date','date'],['name','Event Name','text'],
            ['host','Host LO','text'],['part','No of Participants','number']] },
    { type:'rows', key:'nationalPrograms', title:'Major Events held at the National Level under your portfolio',
      cols:[['date','Date','date'],['name','Event Name','text'],
            ['host','Host LO and Zone','text'],['part','No of Participants','number']] },
    ND_OFFICERS_VISIT, ND_ZD_MEETINGS,
    ND_ACTION_MARKS, ND_RECOGNITIONS('ND'), ND_COORDINATORS, ND_REMARKS,
  ]},
  pr: { name:'PR &amp; Marketing', role:'National Director', sections:[
    ND_COMM, ND_POA, ND_PORTFOLIO_TARGETS, ND_ACTIONS,
    ND_ZONE_PROGRAMS,
    ND_SPECIAL('JCI Branding, Clock Tower, Marathon, JCI Bhawan, etc.'),
    ND_ZD_MEETINGS, ND_ACTION_MARKS, ND_RECOGNITIONS('ND'), ND_COORDINATORS, ND_REMARKS,
  ]},
  jrjc: { name:'Junior Jaycee', role:'National Coordinator', sections:[
    ND_COMM,
    { type:'zoneTA', key:'jrjcStatus', title:'2026 JCI India Junior Jc Status',
      cols:[['members','Jr JC Membership'],['wings','Jr JC Wing\u2019s'],['newWings','New JrJc Wings']] },
    ND_POA, ND_PORTFOLIO_TARGETS, ND_ACTIONS,
    ND_ZONE_PROGRAMS,
    { type:'zone', key:'jcsat', title:'JCSAT Status',
      cols:[['target','Target','number'],['achieved','Achieved','number'],['remarks','Remarks','text']] },
    ND_SPECIAL(''),
    { type:'zone', key:'jjcBoard', title:'Zones that have formed a JJC Board',
      cols:[['chairman','Chairman Name','text'],['remarks','Remarks','text']] },
    { type:'rows', key:'zdMeetings',
      title:'Details about Zone Directors / Coordinators Meeting conducted during the period',
      cols:[['date','Date','date'],['details','Meeting Details','text'],
            ['attendance','Attendance','text']] },
    ND_ACTION_MARKS, ND_RECOGNITIONS('NC'), ND_REMARKS,
  ]},
};

/* ---- storage ---- */
const NDStore = {
  async get(portfolio, period){
    const id = 'nd_' + portfolio + '_' + pkey(period);
    if (useFirebase){ const d = await db.collection('nd_reports').doc(id).get(); return d.exists ? d.data() : null; }
    const all = JSON.parse(localStorage.getItem('jci_nd')||'{}'); return all[id]||null;
  },
  async save(doc){
    const id = 'nd_' + doc.portfolio + '_' + pkey(doc.period);
    if (useFirebase){ await db.collection('nd_reports').doc(id).set(doc); return; }
    const all = JSON.parse(localStorage.getItem('jci_nd')||'{}'); all[id]=doc;
    localStorage.setItem('jci_nd', JSON.stringify(all));
  },
  async allForPeriod(period){
    if (useFirebase){
      const snap = await db.collection('nd_reports').where('period','==',period).get();
      return snap.docs.map(d=>d.data());
    }
    return Object.values(JSON.parse(localStorage.getItem('jci_nd')||'{}')).filter(r=>r.period===period);
  }
};

/* ---- helpers ---- */
function ndZones(){ return Object.keys(AREAS).flatMap(a=>AREAS[a]).sort((x,y)=>x-y); }
function ndName(portfolio){ const p = ND_PORTFOLIOS[portfolio]; return p ? p.name.replace(/&amp;/g,'&') : portfolio; }
function ndUserFor(portfolio){ return USERS.find(u=>u.role==='ND' && u.portfolio===portfolio); }
function ndInput(id, type, val){
  type = type || 'number';
  return '<input id="'+id+'" type="'+type+'"'+(type==='number'?' min="0"':'')
    + (val!==undefined&&val!==null&&val!=='' ? ' value="'+esc(val)+'"' : '')+'>';
}
function ndCell(v){ return '<td'+(typeof v==='number'?' class="n"':'')+'>'+esc(show(v)??'')+'</td>'; }

/* =========================================================
   SECTION RENDERERS — edit mode
========================================================= */
function ndSectionEdit(sec, data){
  const d = data || {};
  const zones = ndZones();
  const lab = '<div class="section-label">'+sec.title+'</div>'
    + (sec.note ? '<div class="hint" style="margin-bottom:8px">'+sec.note+'</div>' : '');

  if (sec.type === 'fields'){
    const v = d[sec.key] || {};
    return lab + '<div class="tscroll"><table class="ftab"><tr>'
      + sec.cols.map(([k,l])=>'<th>'+l+'</th>').join('')+'</tr><tr>'
      + sec.cols.map(([k,l,t])=>'<td>'+ndInput('nd_'+sec.key+'_'+k, t||'number', v[k])+'</td>').join('')
      + '</tr></table></div>';
  }
  if (sec.type === 'text'){
    return lab + '<textarea id="nd_'+sec.key+'" rows="3">'+esc(d[sec.key]||'')+'</textarea>';
  }
  if (sec.type === 'statusTA'){
    const v = d[sec.key] || {};
    return lab + '<div class="tscroll"><table class="ftab">'
      + '<tr><th>Particulars</th><th>Target to become Positive</th><th>Achieved</th><th>Shortfall</th><th>Achieved %</th></tr>'
      + sec.rows.map(([k,l])=>'<tr><td class="rowlab">'+l+'</td>'
          + '<td>'+ndInput('nd_'+sec.key+'_'+k+'_t','number',v[k]?.t)+'</td>'
          + '<td>'+ndInput('nd_'+sec.key+'_'+k+'_a','number',v[k]?.a)+'</td>'
          + '<td class="calc" id="nd_'+sec.key+'_'+k+'_sf"></td>'
          + '<td class="calc" id="nd_'+sec.key+'_'+k+'_pc"></td></tr>').join('')
      + '</table></div>';
  }
  if (sec.type === 'zone'){
    const v = d[sec.key] || {};
    return lab + '<div class="tscroll"><table class="ftab"><tr><th>Zone</th>'
      + sec.cols.map(([k,l])=>'<th>'+l+'</th>').join('')+'</tr>'
      + zones.map(z=>'<tr><td class="rowlab">'+z+'</td>'
          + sec.cols.map(([k,l,t])=>'<td>'+ndInput('nd_'+sec.key+'_'+z+'_'+k, t||'number', v[z]?.[k])+'</td>').join('')
          + '</tr>').join('')
      + '</table></div>';
  }
  if (sec.type === 'zoneTA'){
    const v = d[sec.key] || {};
    return lab + '<div class="tscroll"><table class="ftab"><tr><th rowspan="2">Zone</th>'
      + sec.cols.map(([k,l])=>'<th colspan="2">'+l+'</th>').join('')+'</tr><tr>'
      + sec.cols.map(()=>'<th>T</th><th>A</th>').join('')+'</tr>'
      + zones.map(z=>'<tr><td class="rowlab">'+z+'</td>'
          + sec.cols.map(([k])=>'<td>'+ndInput('nd_'+sec.key+'_'+z+'_'+k+'_t','number',v[z]?.[k]?.t)+'</td>'
                              + '<td>'+ndInput('nd_'+sec.key+'_'+z+'_'+k+'_a','number',v[z]?.[k]?.a)+'</td>').join('')
          + '</tr>').join('')
      + '</table></div>';
  }
  if (sec.type === 'zoneText'){
    const v = d[sec.key] || {};
    return lab + '<div class="tscroll"><table class="ftab"><tr><th>Zone</th><th>'+sec.col+'</th></tr>'
      + zones.map(z=>'<tr><td class="rowlab">'+z+'</td>'
          + '<td><textarea id="nd_'+sec.key+'_'+z+'" rows="2">'+esc(v[z]||'')+'</textarea></td></tr>').join('')
      + '</table></div>';
  }
  if (sec.type === 'rows'){
    return lab + '<div class="tscroll"><table class="ftab" id="ndrow_'+sec.key+'"><tr>'
      + sec.cols.map(([k,l])=>'<th>'+l+'</th>').join('')+'<th class="no-print"></th></tr></table></div>'
      + '<button type="button" class="btn-sec" style="margin-top:8px" data-addrow="'+sec.key+'">+ Add row</button>';
  }
  return '';
}

/* =========================================================
   SECTION RENDERERS — read-only view
========================================================= */
function ndSectionView(sec, data){
  const d = data || {};
  const zones = ndZones();
  const lab = '<div class="section-label">'+sec.title+'</div>';
  const empty = '<div class="hint">Nothing reported.</div>';

  if (sec.type === 'fields'){
    const v = d[sec.key] || {};
    return lab + '<div class="tscroll"><table class="rtab"><tr>'
      + sec.cols.map(([k,l])=>'<th>'+l+'</th>').join('')+'</tr><tr>'
      + sec.cols.map(([k])=>ndCell(v[k])).join('')+'</tr></table></div>';
  }
  if (sec.type === 'text'){
    return lab + '<div style="font-size:13.5px;white-space:pre-wrap">'+esc(d[sec.key]||'—')+'</div>';
  }
  if (sec.type === 'statusTA'){
    const v = d[sec.key] || {};
    return lab + '<div class="tscroll"><table class="rtab">'
      + '<tr><th>Particulars</th><th>Target to become Positive</th><th>Achieved</th><th>Shortfall</th><th>Achieved %</th></tr>'
      + sec.rows.map(([k,l])=>{ const s=v[k]||{};
          return '<tr><td class="rowlab">'+l+'</td><td class="n">'+show(s.t)+'</td><td class="n">'+show(s.a)+'</td>'
            + '<td class="n">'+show(shortfall(s.t,s.a))+'</td><td class="n">'+pct(s.t,s.a)+'</td></tr>'; }).join('')
      + '</table></div>';
  }
  if (sec.type === 'zone'){
    const v = d[sec.key] || {};
    const rows = zones.filter(z=>sec.cols.some(([k])=>{ const x=v[z]?.[k]; return x!==''&&x!=null; }));
    if(!rows.length) return lab + empty;
    return lab + '<div class="tscroll"><table class="rtab"><tr><th>Zone</th>'
      + sec.cols.map(([k,l])=>'<th>'+l+'</th>').join('')+'</tr>'
      + rows.map(z=>'<tr><td class="rowlab">'+z+'</td>'
          + sec.cols.map(([k])=>ndCell(v[z]?.[k])).join('')+'</tr>').join('')
      + '</table></div>';
  }
  if (sec.type === 'zoneTA'){
    const v = d[sec.key] || {};
    const tot = k => zones.reduce((s,z)=>({t:s.t+n(v[z]?.[k]?.t), a:s.a+n(v[z]?.[k]?.a)}), {t:0,a:0});
    return lab + '<div class="tscroll"><table class="rtab"><tr><th rowspan="2">Zone</th>'
      + sec.cols.map(([k,l])=>'<th colspan="2">'+l+'</th>').join('')+'</tr><tr>'
      + sec.cols.map(()=>'<th>T</th><th>A</th>').join('')+'</tr>'
      + zones.map(z=>'<tr><td class="rowlab">'+z+'</td>'
          + sec.cols.map(([k])=>'<td class="n">'+show(v[z]?.[k]?.t)+'</td><td class="n">'+show(v[z]?.[k]?.a)+'</td>').join('')
          + '</tr>').join('')
      + '<tr><td class="rowlab tot">Total</td>'
      + sec.cols.map(([k])=>{ const t=tot(k); return '<td class="n tot">'+t.t+'</td><td class="n tot">'+t.a+'</td>'; }).join('')
      + '</tr></table></div>';
  }
  if (sec.type === 'zoneText'){
    const v = d[sec.key] || {};
    const rows = zones.filter(z=>v[z]);
    if(!rows.length) return lab + empty;
    return lab + '<div class="tscroll"><table class="rtab"><tr><th>Zone</th><th>'+sec.col+'</th></tr>'
      + rows.map(z=>'<tr><td class="rowlab">'+z+'</td><td>'+esc(v[z])+'</td></tr>').join('')
      + '</table></div>';
  }
  if (sec.type === 'rows'){
    const list = d[sec.key] || [];
    if(!list.length) return lab + empty;
    return lab + '<div class="tscroll"><table class="rtab"><tr>'
      + sec.cols.map(([k,l])=>'<th>'+l+'</th>').join('')+'</tr>'
      + list.map(r=>'<tr>'+sec.cols.map(([k])=>ndCell(r[k])).join('')+'</tr>').join('')
      + '</table></div>';
  }
  return '';
}

/* =========================================================
   ND REPORT FORM (ND's own report, or admin editing it)
========================================================= */
async function renderNDForm(user, portfolio){
  portfolio = portfolio || user.portfolio;
  const P = ND_PORTFOLIOS[portfolio];
  if (!P){ app.innerHTML = appbar(user) + '<main class="wrap"><div class="empty">Unknown portfolio.</div></main>'; return; }
  const cfg = periodCfg('NVP');   /* NDs follow the same reporting window */

  app.innerHTML = appbar(user) + '<main class="wrap view">' + modeBanner()
    + '<div class="print-header"><img src="jci-india-logo.png" alt="JCI India">'
    + '<div><div class="pt" id="ndPh"></div>'
    + '<div class="ps">JCI India, National Headquarters, 506 Windfall, Sahar Plaza, J. B. Nagar, Andheri (East), Mumbai 400 059 · management@jciindia.in</div></div></div>'
    + '<div class="pagehead"><h1>'+P.role+' — '+P.name+'</h1>'
    + '<div class="pick"><label style="margin:0">Report for</label>'+periodPicker('ndPeriod', DEFAULT_PERIOD)+'</div></div>'
    + '<div class="loaded-note" id="ndNote"></div>'
    + '<div id="ndLockBanner"></div>'
    + '<div class="toolbar no-print"><button type="button" class="btn-sec" id="ndPrintBtn">Download PDF (Print)</button>'
    + '<button type="button" class="btn-sec" onclick="location.hash=\'nd\'">View all ND reports</button>'
    + (user.viaAdmin || user.role==='ADMIN' ? '<button type="button" class="btn-sec" id="ndReopenBtn">Reopen for editing</button>' : '')
    + '</div>'
    + '<form id="ndForm"><div class="card">'
    + '<div class="section-label">Report Details</div>'
    + '<div class="form-grid">'
    + '<div><label for="nd_m_name">Name of the '+P.role+'</label><input id="nd_m_name" required></div>'
    + '<div><label>Portfolio</label><input value="'+P.name.replace(/&amp;/g,'&')+'" disabled></div>'
    + dateField('nd_m_from','Reporting Period From', cfg.from, cfg.lockFrom)
    + dateField('nd_m_to','Reporting Period To', cfg.to, cfg.lockTo)
    + '<div><label for="nd_m_date">Reporting Date</label><input id="nd_m_date" type="date" value="'+today()+'"></div>'
    + '</div>'
    + '<div id="ndSections"></div>'
    + '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">'
    + '<button type="button" class="btn-sec" id="ndDraftBtn" style="margin-top:20px;padding:12px 22px;font-size:15px">Save as draft</button>'
    + '<button class="btn-primary" type="submit">Submit final report</button></div>'
    + '<div class="hint">A draft is saved for you but is not shown to others until you submit. Submitting again updates your report.</div>'
    + '</div></form>'
    + '<div class="app-foot">Developed by <b>JFS Sumit Goyal</b>'+versionTag()+'</div></main>';

  let current = null;
  let ndLocked = false;

  function addRow(secKey, cols, values){
    const table = document.getElementById('ndrow_'+secKey);
    if(!table) return;
    const i = table.querySelectorAll('tr[data-r]').length + 1 + Math.floor(Math.random()*1e6);
    const tr = document.createElement('tr');
    tr.dataset.r = secKey;
    tr.innerHTML = cols.map(([k,l,t])=>'<td>'+ndInput('ndr_'+secKey+'_'+i+'_'+k, t||'text', values?values[k]:'')+'</td>').join('')
      + '<td class="no-print"><button type="button" class="btn-sec ndr-del">✕</button></td>';
    tr.dataset.idx = i;
    table.appendChild(tr);
    tr.querySelector('.ndr-del').addEventListener('click', ()=>tr.remove());
  }

  function build(data){
    document.getElementById('ndSections').innerHTML = P.sections.map(s=>ndSectionEdit(s, data)).join('');
    /* dynamic row sections */
    P.sections.filter(s=>s.type==='rows').forEach(s=>{
      const list = (data && data[s.key]) || [];
      (list.length ? list : [null,null]).forEach(v=>addRow(s.key, s.cols, v));
    });
    document.querySelectorAll('[data-addrow]').forEach(b=>{
      const s = P.sections.find(x=>x.key===b.dataset.addrow);
      b.addEventListener('click', ()=>addRow(s.key, s.cols, null));
    });
    /* live shortfall / % */
    P.sections.filter(s=>s.type==='statusTA').forEach(s=>{
      s.rows.forEach(([k])=>{
        const upd = ()=>{
          const t = nval('nd_'+s.key+'_'+k+'_t'), a = nval('nd_'+s.key+'_'+k+'_a');
          const sf = document.getElementById('nd_'+s.key+'_'+k+'_sf');
          const pc = document.getElementById('nd_'+s.key+'_'+k+'_pc');
          if(sf) sf.textContent = show(shortfall(t,a));
          if(pc) pc.textContent = pct(t,a);
        };
        ['t','a'].forEach(x=>{ const el=document.getElementById('nd_'+s.key+'_'+k+'_'+x); if(el) el.addEventListener('input', upd); });
        upd();
      });
    });
  }

  function gather(status){
    const zones = ndZones();
    const out = { portfolio, period:$('#ndPeriod').value, status,
      meta:{ name:val('nd_m_name'),
             from: cfg.lockFrom ? cfg.from : val('nd_m_from'),
             to:   cfg.lockTo   ? cfg.to   : val('nd_m_to'),
             reportDate: val('nd_m_date') },
      submittedBy:user.u, updatedAt:new Date().toISOString(), appVersion:appVersion() };

    P.sections.forEach(s=>{
      if (s.type==='fields'){
        out[s.key] = Object.fromEntries(s.cols.map(([k,l,t])=>[k, (t==='text'?val('nd_'+s.key+'_'+k):nval('nd_'+s.key+'_'+k))]));
      } else if (s.type==='text'){
        out[s.key] = val('nd_'+s.key);
      } else if (s.type==='statusTA'){
        out[s.key] = Object.fromEntries(s.rows.map(([k])=>[k,{t:nval('nd_'+s.key+'_'+k+'_t'), a:nval('nd_'+s.key+'_'+k+'_a')}]));
      } else if (s.type==='zone'){
        out[s.key] = Object.fromEntries(zones.map(z=>[z, Object.fromEntries(
          s.cols.map(([k,l,t])=>[k, (t==='number'||!t) ? nval('nd_'+s.key+'_'+z+'_'+k) : val('nd_'+s.key+'_'+z+'_'+k)]))]));
      } else if (s.type==='zoneTA'){
        out[s.key] = Object.fromEntries(zones.map(z=>[z, Object.fromEntries(
          s.cols.map(([k])=>[k,{t:nval('nd_'+s.key+'_'+z+'_'+k+'_t'), a:nval('nd_'+s.key+'_'+z+'_'+k+'_a')}]))]));
      } else if (s.type==='zoneText'){
        out[s.key] = Object.fromEntries(zones.map(z=>[z, val('nd_'+s.key+'_'+z)]));
      } else if (s.type==='rows'){
        out[s.key] = [...document.querySelectorAll('#ndrow_'+s.key+' tr[data-r]')].map(tr=>{
          const i = tr.dataset.idx;
          return Object.fromEntries(s.cols.map(([k,l,t])=>[k, (t==='number') ? nval('ndr_'+s.key+'_'+i+'_'+k) : val('ndr_'+s.key+'_'+i+'_'+k)]));
        }).filter(r=>Object.values(r).some(v=>v!==''&&v!=null));
      }
    });
    return out;
  }

  async function load(){
    const period = $('#ndPeriod').value;
    document.getElementById('ndPh').textContent = (P.role+' '+P.name.replace(/&amp;/g,'&')+' Report — '+period).toUpperCase();
    let r = null;
    try{ r = await NDStore.get(portfolio, period); }
    catch(err){ console.error(err); toast('Could not load the report — check connection'); }
    current = r;
    const note = document.getElementById('ndNote');
    note.style.display = r ? 'block' : 'none';
    if (r) note.textContent = r.status==='draft'
      ? 'DRAFT loaded — it is not visible to others until you submit.'
      : 'Final submitted report loaded — saving will update it.';
    build(r);
    setV('nd_m_name', r?.meta?.name || (user.role==='ND' ? (user.name||'') : (ndUserFor(portfolio)?.name||'')));
    setV('nd_m_date', r?.meta?.reportDate || today());
    ndLocked = isLocked(r, user);
    document.getElementById('ndLockBanner').innerHTML = lockBanner(ndLocked);
    applyLock('#ndForm', ndLocked);
    const rb = document.getElementById('ndReopenBtn');
    if (rb) rb.style.display = (r && r.status==='submitted') ? '' : 'none';
  }

  async function persist(status, msg){
    if (ndLocked){ toast('This report is locked — ask the SuperAdmin to reopen it'); return; }
    const doc = gather(status);
    try{ await NDStore.save(doc); toast(msg); load(); }
    catch(err){ console.error(err); toast('Could not save — check connection'); }
  }
  document.getElementById('ndForm').addEventListener('submit', e=>{
    e.preventDefault(); persist('submitted','Report for '+$('#ndPeriod').value+' submitted');
  });
  document.getElementById('ndPrintBtn').addEventListener('click', ()=>{
    printAs(safeName(P.name.replace(/&amp;/g,'&')) + '_' + safeName(val('nd_m_name') || user.name || user.u) + '_' + stamp());
  });
  document.getElementById('ndDraftBtn').addEventListener('click', ()=>persist('draft','Draft saved'));
  const ndReopen = document.getElementById('ndReopenBtn');
  if (ndReopen) ndReopen.addEventListener('click', async ()=>{
    try{ await NDStore.save(gather('draft')); toast('Reopened — the Director can edit and resubmit'); load(); }
    catch(err){ console.error(err); toast('Could not reopen — check connection'); }
  });
  $('#ndPeriod').addEventListener('change', load);
  load();
}

/* =========================================================
   ND REPORTS VIEWER — read-only for ZP / NVP / NEC
========================================================= */
async function renderNDView(user){
  const keys = Object.keys(ND_PORTFOLIOS);
  app.innerHTML = appbar(user) + '<main class="wrap view">' + modeBanner()
    + '<div class="print-header"><img src="jci-india-logo.png" alt="JCI India">'
    + '<div><div class="pt" id="ndvPh"></div>'
    + '<div class="ps">JCI India, National Headquarters, 506 Windfall, Sahar Plaza, J. B. Nagar, Andheri (East), Mumbai 400 059 · management@jciindia.in</div></div></div>'
    + '<div class="pagehead"><h1>National Directors\u2019 Reports</h1>'
    + '<div class="pick"><label style="margin:0">Report for</label>'+periodPicker('ndvPeriod', DEFAULT_PERIOD)+'</div></div>'
    + '<div class="card"><h2>Portfolios</h2>'
    + '<div class="lead">Submitted reports only. These are view-only; National Directors maintain their own reports.</div>'
    + '<div class="zone-chips" id="ndvChips" style="margin-top:8px"></div></div>'
    + '<div class="toolbar no-print"><button class="btn-sec" id="ndvPrintBtn">Print / PDF</button>'
    + '<button class="btn-sec" id="ndvBack">← Back to my report</button></div>'
    + '<div id="ndvBody"><div class="empty">Loading…</div></div>'
    + '<div class="app-foot">Developed by <b>JFS Sumit Goyal</b>'+versionTag()+'</div></main>';

  document.getElementById('ndvBack').addEventListener('click', ()=>{ location.hash=''; render(); });
  document.getElementById('ndvPrintBtn').addEventListener('click', ()=>{
    printAs('National_Directors_' + safeName(ndName(selected)) + '_' + stamp());
  });

  let selected = keys[0];
  async function load(){
    const period = $('#ndvPeriod').value;
    document.getElementById('ndvPh').textContent = ('National Directors\u2019 Reports — '+period).toUpperCase();
    let rows = [];
    try{ rows = await NDStore.allForPeriod(period); }catch(err){ console.error(err); }
    const byP = Object.fromEntries(rows.filter(r=>r.status!=='draft').map(r=>[r.portfolio,r]));

    document.getElementById('ndvChips').innerHTML = keys.map(k=>
      '<button class="zchip '+(byP[k]?'done':'miss')+(k===selected?'" style="outline:2px solid var(--jci-blue);outline-offset:2px':'')
      + '" data-p="'+k+'">'+ndName(k)+'</button>').join('');
    document.querySelectorAll('#ndvChips [data-p]').forEach(b=>b.addEventListener('click',()=>{ selected=b.dataset.p; load(); }));

    const P = ND_PORTFOLIOS[selected];
    const r = byP[selected];
    const who = r?.meta?.name || ndUserFor(selected)?.name || '';
    document.getElementById('ndvBody').innerHTML = r
      ? '<div class="card"><h2>'+P.role+' — '+P.name+'</h2>'
        + '<div class="lead">'+(who?esc(who)+' · ':'')+'Reporting period '+esc(r.meta?.from||'')+' to '+esc(r.meta?.to||'')
        + (r.meta?.reportDate?' · reported '+esc(r.meta.reportDate):'')+'</div>'
        + P.sections.map(s=>ndSectionView(s, r)).join('')
        + '</div>'
      : '<div class="empty">'+P.role+' '+P.name+' has not submitted a report for '+esc(period)+' yet.'
        + (who?'<br><span class="hint">'+esc(who)+'</span>':'')+'</div>';
  }
  $('#ndvPeriod').addEventListener('change', load);
  load();
}
