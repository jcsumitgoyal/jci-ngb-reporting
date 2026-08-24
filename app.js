/* =========================================================
   JCI INDIA NGB REPORTING — APP LOGIC
   ZP  → files the full Zone President report (official format)
   NVP → auto-consolidated area report (official NVP format)
         + NVP-only inputs (last-year status, event bids)
   NEC → national view, area by area
========================================================= */

/* ---------- Row definitions (from the official formats) ---------- */
const TA_ROWS = [
  ['mem2nd','Membership'],
  ['newLOs',"New LO's"],
  ['ladyLOs',"Lady LO's"],
  ['jrjc','JrJc Wing'],
  ['jcomTables','JCOM Tables'],
  ['jcomMembers','JCOM Members'],
  ['jacMembers','JAC Members'],
];
const FC_ROWS = [
  ['hgf','HGF (3,000)'],['jfm','JFM (5,000)'],['jfd','JFD (10,000)'],['jfa','JFA (15,000)'],
  ['jfp','JFP (25,000)'],['jff','JFF (50,000)'],['jfs','JFS (1,00,000)'],['jfg','JFG (2,00,000)'],
  ['rpp','RPP (3,00,000)'],['jfr','JFR (4,00,000)'],['jfj','JFJ (5,00,000)'],['jfk','JFK (10,00,000)'],
  ['jfi','JFI (25,00,000)'],['senator','SENATOR'],['ppp','PPP'],['others','OTHERS'],
];
const EV_ROWS = [
  ['aspac','ASPAC'],['wc','W.C'],['jcsat','JCSAT'],['nalanda','NALANDA'],['nttts','NTTTS'],
  ['ablePro','ABLE (PRO)'],['ableEnt','ABLE (ENT)'],['jasmine','JASMINE'],['oyp','OYP'],
  ['tobip','TOBIP'],['natcon','NATCON'],
];
const EP_ROWS = [
  ['lots','LOTS'],['pa','PA'],['midcon','MIDCON'],['r2r','R2R'],
  ['star','STAR'],['aps','APS'],['parl','Parliamentarian'],['zoncon','ZONCON'],
];
const OC_COLS = [
  ['jcsat','JCSAT'],['natconSponsor','NATCON Sponsor'],['challengeSponsor','Challenge Sponsor'],
  ['pdm','PDM'],['other','Any Other'],
];
const LY_COLS = [
  ['annual','Annual'],['half2','2nd Half'],['activeLOs',"Active LO's"],
  ['newLOs',"New LO's"],['jrjc','JrJc Wing'],['ladyLOs',"Lady LO's"],
];
const VISIT_KEYS = [['nvp1','NVP 1st Half Visit'],['nvp2','NVP 2nd Half Visit'],['np','NP Visit']];

/* Baseline period: Zone Status targets and Last Year membership are entered
   once here, then carried into every later period automatically. */
const BASE_PERIOD = (typeof PERIODS !== 'undefined' && PERIODS[0]) || 'I NGB';

/* ---------- Storage ---------- */
const useFirebase = typeof FIREBASE_CONFIG !== 'undefined' && !!FIREBASE_CONFIG.projectId;
let db = null;
if (useFirebase) { firebase.initializeApp(FIREBASE_CONFIG); db = firebase.firestore(); }
const pkey = p => p.replace(/[^A-Za-z0-9]+/g,'_');

const Store = {
  async saveZP(r){
    const id = 'z' + r.zone + '_' + pkey(r.period);
    if (useFirebase) await db.collection('reports').doc(id).set(r);
    else { const all = JSON.parse(localStorage.getItem('jci_reports')||'{}'); all[id]=r; localStorage.setItem('jci_reports', JSON.stringify(all)); }
  },
  async getZP(zone, period){
    const id = 'z' + zone + '_' + pkey(period);
    if (useFirebase){ const d = await db.collection('reports').doc(id).get(); return d.exists ? d.data() : null; }
    const all = JSON.parse(localStorage.getItem('jci_reports')||'{}'); return all[id]||null;
  },
  async zpForPeriod(period, zones){
    if (useFirebase){
      const snap = await db.collection('reports').where('period','==',period).get();
      let rows = snap.docs.map(d=>d.data());
      if (zones) rows = rows.filter(r=>zones.includes(r.zone));
      return rows;
    }
    const all = Object.values(JSON.parse(localStorage.getItem('jci_reports')||'{}'));
    return all.filter(r=>r.period===period && (!zones||zones.includes(r.zone)));
  },
  async saveNVP(doc){
    const id = 'nvp' + doc.area + '_' + pkey(doc.period);
    if (useFirebase) await db.collection('nvp_reports').doc(id).set(doc);
    else { const all = JSON.parse(localStorage.getItem('jci_nvp')||'{}'); all[id]=doc; localStorage.setItem('jci_nvp', JSON.stringify(all)); }
  },
  async getNVP(area, period){
    const id = 'nvp' + area + '_' + pkey(period);
    if (useFirebase){ const d = await db.collection('nvp_reports').doc(id).get(); return d.exists ? d.data() : null; }
    const all = JSON.parse(localStorage.getItem('jci_nvp')||'{}'); return all[id]||null;
  }
};

/* ---------- Auth & helpers ---------- */
function today(){ return new Date().toISOString().slice(0,10); }

/* Reporting-period dates, configured per role in users.js */
function periodCfg(role){
  const d = (typeof PERIOD_DATES !== 'undefined' && PERIOD_DATES[role]) || {};
  return { from: d.from || '2026-05-25',
           to:   (!d.to || d.to === 'today') ? today() : d.to,
           lockFrom: d.lockFrom !== false,
           lockTo:   d.lockTo   !== false };
}
function dateField(id, label, value, locked){
  return '<div><label for="'+id+'">'+label+'</label>'
    + '<input id="'+id+'" type="date" value="'+esc(value)+'"'+(locked?' readonly':'')+'></div>';
}

/* Shrink an uploaded photo so it fits comfortably inside a Firestore document */
function compressImage(file, maxPx, quality){
  maxPx = maxPx||900; quality = quality||0.55;
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onerror = ()=>reject(new Error('Could not read the file'));
    reader.onload = ()=>{
      const img = new Image();
      img.onerror = ()=>reject(new Error('That file is not a readable image'));
      img.onload = ()=>{
        const scale = Math.min(1, maxPx/Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width*scale); c.height = Math.round(img.height*scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
async function sha256(text){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function session(){ try{return JSON.parse(sessionStorage.getItem('jci_user'))}catch{return null} }
function setSession(u){ sessionStorage.setItem('jci_user', JSON.stringify(u)); }
function logout(){ sessionStorage.removeItem('jci_user'); render(); }

const $ = s => document.querySelector(s);
const app = document.getElementById('app');
function esc(s){ return String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.style.display='block'; setTimeout(()=>t.style.display='none',2600); }
function val(id){ const el=document.getElementById(id); return el ? el.value.trim() : ''; }
function nval(id){ const v=val(id); return v===''?'':Number(v); }
function n(v){ return v===''||v==null||isNaN(v) ? 0 : Number(v); }
function show(v){ return v===''||v==null ? '' : v; }
function pct(t,a){ return n(t)>0 ? Math.round(n(a)/n(t)*100)+'%' : ''; }
function shortfall(t,a){ return n(t)>0 ? Math.max(n(t)-n(a),0) : ''; }
function setV(id, v){ const el=document.getElementById(id); if(el && v!==undefined && v!==null) el.value = v; }
function zonesOf(areas){ return areas.flatMap(a=>AREAS[a]); }
function areaOfZone(z){ return Object.keys(AREAS).find(a=>AREAS[a].includes(z)); }

function appbar(user){
  const who = user.role==='ZP' ? 'Zone '+user.zone+' · Area '+user.area
            : user.role==='NVP' ? 'NVP Area '+user.area : 'National Executive Committee';
  const nm = user.name ? esc(user.name)+' · ' : '';
  return '<header class="appbar"><div class="appbar-inner">'
    + '<div class="logo-badge"><img src="jci-india-logo.png" alt="JCI India"></div>'
    + '<div><div class="title">JCI India · NGB Reporting</div><div class="sub">Zone → NVP → NEC</div></div>'
    + '<div class="who"><div class="role">'+esc(user.role)+'</div><div>'+nm+esc(who)+'</div></div>'
    + '<button class="btn-out" onclick="logout()">Sign out</button>'
    + '</div></header>';
}
function modeBanner(){
  return useFirebase ? '' : '<div class="mode-banner"><b>Local demo mode.</b> Data is saved only in this browser. Add your Firebase config in <span class="mono">users.js</span> for shared multi-user reporting (see README).</div>';
}
function periodPicker(id, current){
  return '<select id="'+id+'">' + PERIODS.map(p=>'<option '+(p===current?'selected':'')+'>'+p+'</option>').join('') + '</select>';
}

/* ---------- Login ---------- */
function renderLogin(){
  app.innerHTML =
  '<div class="login-shell view"><div class="login-card">'
  + '<img class="login-logo" src="jci-india-logo.png" alt="JCI India">'
  + '<h1>JCI India NEC/NGB Reporting</h1>'
  + '<div class="tag">JCI India · National Growth &amp; Development</div>'
  + '<form id="loginForm">'
  + '<label for="lu">Username</label><input id="lu" autocomplete="username" placeholder="e.g. zp14 or nvpa" required>'
  + '<label for="lp">Password</label><input id="lp" type="password" autocomplete="current-password" required>'
  + '<button class="btn-primary wide" type="submit">Sign in</button>'
  + '<div class="err" id="lerr">Incorrect username or password.</div>'
  + '</form>'
  + '<div class="login-foot">Zone Presidents sign in as <span class="mono">zp&lt;zone&gt;</span> · NVPs as <span class="mono">nvp&lt;area&gt;</span> · NEC as <span class="mono">nec</span>'
  + '<div style="margin-top:10px;color:var(--navy);font-weight:600">Developed by JFS Sumit Goyal</div></div>'
  + '</div></div>';
  $('#loginForm').addEventListener('submit', async e=>{
    e.preventDefault();
    const u = $('#lu').value.trim().toLowerCase();
    const hash = await sha256($('#lp').value);
    const found = USERS.find(x=>x.u===u && x.p===hash);
    if(!found){ $('#lerr').style.display='block'; return; }
    setSession({u:found.u, role:found.role, zone:found.zone??null, area:found.area??null, name:found.name??''});
    render();
  });
}

/* =========================================================
   ZP FORM — official "Zone President Report" format
========================================================= */
function tinp(id, type){ // table cell input
  type = type||'number';
  return '<td><input id="'+id+'" type="'+type+'"'+(type==='number'?' min="0"':'')+'></td>';
}
function statusRowZP(key, label){
  return '<tr><td class="rowlab">'+label+'</td>'
    + tinp('zs_'+key+'_t') + tinp('zs_'+key+'_a')
    + '<td class="calc" id="zs_'+key+'_sf"></td><td class="calc" id="zs_'+key+'_pc"></td></tr>';
}

function renderZP(user){
  const zpCfg = periodCfg('ZP');
  const taRows = TA_ROWS.map(([k,l]) =>
    '<tr><td class="rowlab">'+l+'</td>'+tinp('ta_'+k+'_t')+tinp('ta_'+k+'_a')+'</tr>').join('');
  const fcRows = FC_ROWS.map(([k,l]) =>
    '<tr><td class="rowlab">'+l+'</td>'+tinp('fc_'+k+'_t')+tinp('fc_'+k+'_a')+tinp('fc_'+k+'_amt')+'</tr>').join('');
  const evRows = EV_ROWS.map(([k,l]) =>
    '<tr><td class="rowlab">'+l+'</td>'+tinp('ev_'+k+'_t')+tinp('ev_'+k+'_a')+'</tr>').join('');
  const epCells = EP_ROWS.map(([k,l]) => tinp('ep_'+k)).join('');
  const ocCells = OC_COLS.map(([k]) => tinp('oc_'+k,'text')).join('');
  const visitRows = VISIT_KEYS.map(([k,l]) =>
    '<tr><td class="rowlab">'+l+'</td>'+tinp('vi_'+k+'_dates','text')+tinp('vi_'+k+'_tc','text')+tinp('vi_'+k+'_tcno','text')+tinp('vi_'+k+'_status','text')
    + '<td><input type="file" id="ph_'+k+'_file" accept="image/*" class="no-print" style="font-size:11.5px">'
    + '<div id="ph_'+k+'_wrap" class="ph-wrap"></div></td></tr>').join('');

  app.innerHTML = appbar(user) + '<main class="wrap view">' + modeBanner()
  + '<div class="pagehead"><h1>Zone President Report — Zone '+user.zone+'</h1>'
  + '<div class="pick"><label style="margin:0">Report for</label>'+periodPicker('zpPeriod', DEFAULT_PERIOD)+'</div></div>'
  + '<div class="loaded-note" id="loadedNote">Loaded your earlier submission for this period — saving will update it.</div>'
  + '<div class="toolbar no-print"><button type="button" class="btn-sec" id="zpPrintBtn">Download PDF (Print)</button>'
  + '<button type="button" class="btn-sec" id="zpCsvBtn">Download CSV</button></div>'
  + '<form id="zpForm"><div class="card">'

  + '<div class="section-label">Report Details</div>'
  + '<div class="form-grid">'
  + '<div><label for="m_zpName">Name of the Zone President</label><input id="m_zpName" required></div>'
  + '<div><label>Zone</label><input value="Zone '+user.zone+'" disabled></div>'
  + '<div><label>Area</label><input value="Area '+user.area+'" disabled></div>'
  + dateField('m_from','Reporting Period From', zpCfg.from, zpCfg.lockFrom)
  + dateField('m_to','Reporting Period To', zpCfg.to, zpCfg.lockTo)
  + '<div><label for="m_date">Reporting Date</label><input id="m_date" type="date" value="'+today()+'" required></div>'
  + '</div>'

  + '<div class="section-label">Zone Status</div>'
  + '<div class="hint" id="baseNoteZS" style="margin-bottom:8px"></div>'
  + '<div class="tscroll"><table class="ftab"><tr><th>Zone Status</th><th>Target to become Positive</th><th>Achieved</th><th>Shortfall</th><th>Achieved %</th></tr>'
  + statusRowZP('mem','Membership') + statusRowZP('fc','Foundation Contribution') + '</table></div>'

  + '<div class="section-label">Zone Details</div>'
  + '<div class="form-grid">'
  + '<div><label for="zd_disaff">No of LOs facing Disaffiliation</label><input id="zd_disaff" type="number" min="0"></div>'
  + '<div><label for="zd_susp">No of LOs under Suspension</label><input id="zd_susp" type="number" min="0"></div>'
  + '<div><label for="zd_revived">LOs revived (previous year dues not sent)</label><input id="zd_revived" type="number" min="0"></div>'
  + '<div><label for="zd_jvc">LO Presidents registered in JVC</label><input id="zd_jvc" type="number" min="0"></div>'
  + '</div>'
  + '<div class="form-grid">'
  + '<div><label>Probable Centurion LOs (names)</label><div id="centList"></div>'
  + '<button type="button" class="btn-sec" style="margin-top:6px" id="addCentBtn">+ Add LO name</button></div>'
  + '<div><label>Star LOs of the Period (names)</label><div id="starList"></div>'
  + '<button type="button" class="btn-sec" style="margin-top:6px" id="addStarBtn">+ Add LO name</button></div>'
  + '</div>'

  + '<div class="section-label">Last Year (2025) Membership Status</div>'
  + '<div class="hint" id="baseNoteLY" style="margin-bottom:8px"></div>'
  + '<div class="tscroll"><table class="ftab"><tr>'+LY_COLS.map(([k,l])=>'<th>'+l+'</th>').join('')+'</tr><tr>'
  + LY_COLS.map(([k])=>tinp('ly_'+k)).join('')+'</tr></table></div>'

  + '<div class="section-label">Target / Achievement Report FTY 2026</div>'
  + '<div class="hint" id="baseNoteTA" style="margin-bottom:8px"></div>'
  + '<div class="tscroll"><table class="ftab"><tr><th>Description</th><th>Target</th><th>Achieved</th></tr>'+taRows+'</table></div>'

  + '<div class="section-label">Foundation Contribution Details</div>'
  + '<div class="tscroll"><table class="ftab"><tr><th>Title</th><th>Target</th><th>Achieved</th><th>Amount (₹)</th></tr>'+fcRows+'</table></div>'

  + '<div class="section-label">Events Participation Details</div>'
  + '<div class="tscroll"><table class="ftab"><tr><th>Event</th><th>Target</th><th>Achieved</th></tr>'+evRows+'</table></div>'
  + '<div class="hint" style="margin:10px 0 4px">No of participants:</div>'
  + '<div class="tscroll"><table class="ftab"><tr>'+EP_ROWS.map(([k,l])=>'<th>'+l+'</th>').join('')+'</tr><tr>'+epCells+'</tr></table></div>'

  + '<div class="section-label">Any Other Contribution Details</div>'
  + '<div class="tscroll"><table class="ftab"><tr>'+OC_COLS.map(([k,l])=>'<th>'+l+'</th>').join('')+'</tr><tr>'+ocCells+'</tr></table></div>'

  + '<div class="section-label">NVP / NP Visit Details</div>'
  + '<div class="tscroll"><table class="ftab"><tr><th>Visit</th><th>Visiting Dates</th><th>Tour Coordinator Name</th><th>T.C Contact Number</th><th>Status</th><th>Photo (1 per visit)</th></tr>'+visitRows+'</table></div>'

  + '<div class="section-label">Major Events held in the Zone</div>'
  + '<div class="tscroll"><table class="ftab" id="meTable"><tr><th>Event Name</th><th>Date</th><th>Host LO</th><th>No of Participants</th><th class="no-print"></th></tr></table></div>'
  + '<button type="button" class="btn-sec" style="margin-top:8px" id="addEventBtn">+ Add event</button>'

  + '<div class="section-label">Efforts taken to make Zone positive / growth in membership</div>'
  + '<textarea id="f_efforts" rows="3"></textarea>'

  + '<div class="section-label">Action Marks (if any)</div>'
  + '<textarea id="f_action" rows="2"></textarea>'

  + '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">'
  + '<button type="button" class="btn-sec" id="draftBtn" style="margin-top:20px;padding:12px 22px;font-size:15px">Save as draft</button>'
  + '<button class="btn-primary" type="submit">Submit final report</button></div>'
  + '<div class="hint">A draft is saved for you but NOT shown to your NVP. "Submit final report" makes it count in the Area consolidation; submitting again later updates it. All fields must be filled without fail; A – Achieved, T – Target.</div>'
  + '</div></form><div id="printArea"></div>'
  + '<div class="app-foot">Developed by <b>JFS Sumit Goyal</b></div></main>';

  /* live shortfall / % */
  ['mem','fc'].forEach(k=>{
    ['t','a'].forEach(x=>{
      document.getElementById('zs_'+k+'_'+x).addEventListener('input', ()=>{
        const t=nval('zs_'+k+'_t'), a=nval('zs_'+k+'_a');
        document.getElementById('zs_'+k+'_sf').textContent = show(shortfall(t,a));
        document.getElementById('zs_'+k+'_pc').textContent = pct(t,a);
      });
    });
  });

  /* major events dynamic rows */
  let meCount = 0;
  function addEventRow(d){
    d = d || {};
    meCount++;
    const i = meCount;
    const tr = document.createElement('tr');
    tr.dataset.me = i;
    tr.innerHTML = '<td><input id="me_'+i+'_name" type="text"></td>'
      + '<td><input id="me_'+i+'_date" type="date"></td>'
      + '<td><input id="me_'+i+'_host" type="text"></td>'
      + '<td><input id="me_'+i+'_part" type="number" min="0"></td>'
      + '<td class="no-print"><button type="button" class="btn-sec me-del">✕</button></td>';
    document.getElementById('meTable').appendChild(tr);
    setV('me_'+i+'_name', d.name||''); setV('me_'+i+'_date', d.date||'');
    setV('me_'+i+'_host', d.host||''); setV('me_'+i+'_part', d.part??'');
    tr.querySelector('.me-del').addEventListener('click', ()=>tr.remove());
  }
  document.getElementById('addEventBtn').addEventListener('click', ()=>addEventRow());

  /* multi-name lists (Centurion / Star LOs) */
  function addNameRow(listId, value){
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:6px;margin-bottom:6px';
    wrap.innerHTML = '<input type="text" class="nm" value="'+esc(value||'')+'">'
      + '<button type="button" class="btn-sec nm-del" style="flex-shrink:0">✕</button>';
    document.getElementById(listId).appendChild(wrap);
    wrap.querySelector('.nm-del').addEventListener('click', ()=>wrap.remove());
  }
  function namesOf(listId){
    return [...document.querySelectorAll('#'+listId+' input.nm')].map(i=>i.value.trim()).filter(Boolean);
  }
  function fillNames(listId, v){
    document.getElementById(listId).innerHTML = '';
    const arr = Array.isArray(v) ? v : (v ? String(v).split(',').map(s=>s.trim()).filter(Boolean) : []);
    (arr.length ? arr : ['']).forEach(name=>addNameRow(listId, name));
  }
  document.getElementById('addCentBtn').addEventListener('click', ()=>addNameRow('centList'));
  document.getElementById('addStarBtn').addEventListener('click', ()=>addNameRow('starList'));

  /* one photo per visit */
  const photos = {};
  function showPhoto(k){
    const wrap = document.getElementById('ph_'+k+'_wrap');
    wrap.innerHTML = photos[k]
      ? '<img src="'+photos[k]+'" class="ph-thumb"><button type="button" class="btn-sec no-print ph-rm" style="font-size:11px;padding:3px 8px;margin-top:4px">Remove photo</button>'
      : '';
    const rm = wrap.querySelector('.ph-rm');
    if (rm) rm.addEventListener('click', ()=>{ delete photos[k]; document.getElementById('ph_'+k+'_file').value=''; showPhoto(k); });
  }
  VISIT_KEYS.forEach(([k])=>{
    document.getElementById('ph_'+k+'_file').addEventListener('change', async e=>{
      const f = e.target.files && e.target.files[0];
      if(!f) return;
      try{
        photos[k] = await compressImage(f);
        showPhoto(k);
        toast('Photo added — remember to save');
      }catch(err){ console.error(err); toast('Could not read that image'); e.target.value=''; }
    });
  });

  /* prefill helpers */
  let zpStatus = 'submitted';
  const autosaveKey = () => 'jci_autosave_z'+user.zone+'_'+pkey($('#zpPeriod').value);
  function fillForm(r){
    const m=r.meta||{};
    setV('m_zpName',m.zpName);
    setV('m_from', zpCfg.lockFrom ? zpCfg.from : (m.from||zpCfg.from));
    setV('m_to',   zpCfg.lockTo   ? zpCfg.to   : (m.to||zpCfg.to));
    setV('m_date',m.reportDate||today());
    ['mem','fc'].forEach(k=>{ setV('zs_'+k+'_t',(r.zs?.[k]?.t)??''); setV('zs_'+k+'_a',(r.zs?.[k]?.a)??'');
      document.getElementById('zs_'+k+'_t').dispatchEvent(new Event('input')); });
    const zd=r.zd||{};
    setV('zd_disaff',zd.disaff??''); setV('zd_susp',zd.susp??''); setV('zd_revived',zd.revived??'');
    setV('zd_jvc',zd.jvc??'');
    fillNames('centList', zd.centurion); fillNames('starList', zd.star);
    LY_COLS.forEach(([k])=>setV('ly_'+k,(r.ly?.[k])??''));
    TA_ROWS.forEach(([k])=>{ setV('ta_'+k+'_t',(r.ta?.[k]?.t)??''); setV('ta_'+k+'_a',(r.ta?.[k]?.a)??''); });
    FC_ROWS.forEach(([k])=>{ setV('fc_'+k+'_t',(r.fc?.[k]?.t)??''); setV('fc_'+k+'_a',(r.fc?.[k]?.a)??''); setV('fc_'+k+'_amt',(r.fc?.[k]?.amt)??''); });
    EV_ROWS.forEach(([k])=>{ setV('ev_'+k+'_t',(r.ev?.[k]?.t)??''); setV('ev_'+k+'_a',(r.ev?.[k]?.a)??''); });
    EP_ROWS.forEach(([k])=>setV('ep_'+k,(r.ep?.[k])??''));
    OC_COLS.forEach(([k])=>setV('oc_'+k,(r.oc?.[k])??''));
    VISIT_KEYS.forEach(([k])=>{ const v=r.visits?.[k]||{};
      setV('vi_'+k+'_dates',v.dates??''); setV('vi_'+k+'_tc',v.tc??''); setV('vi_'+k+'_tcno',v.tcno??''); setV('vi_'+k+'_status',v.status??'');
      if(v.photo) photos[k]=v.photo; else delete photos[k];
      showPhoto(k); });
    (r.majorEvents&&r.majorEvents.length ? r.majorEvents : [{},{}]).forEach(addEventRow);
    setV('f_efforts',r.efforts??''); setV('f_action',r.actionMarks??'');
  }
  function setNote(kind){
    zpStatus = kind==='draft' ? 'draft' : 'submitted';
    const el = document.getElementById('loadedNote');
    if(!kind){ el.style.display='none'; return; }
    el.style.display='block';
    el.textContent = kind==='submitted' ? 'This period has a FINAL SUBMITTED report — saving again will update it.'
      : kind==='draft' ? 'DRAFT loaded — it is NOT visible to your NVP until you press "Submit final report".'
      : 'Restored unsaved changes from this device. Save as draft or submit to keep them.';
  }
  /* Baseline fields (Last Year 2025 + current-year targets) come from
     ZONE_BASELINE in users.js, maintained centrally by NHQ. Anything left
     blank there falls back to the first period's report, then to manual entry. */
  const baseCfg = (typeof ZONE_BASELINE !== 'undefined' && ZONE_BASELINE[user.zone]) || {};
  const baseLocked = (typeof BASELINE_LOCKED === 'undefined') ? true : !!BASELINE_LOCKED;
  const has = v => v!=='' && v!=null;

  function lockIf(id, locked){ const el=document.getElementById(id); if(el) el.readOnly = locked; }

  async function applyBaseline(){
    const period = $('#zpPeriod').value;
    const noteZS = document.getElementById('baseNoteZS');
    const noteLY = document.getElementById('baseNoteLY');
    const noteTA = document.getElementById('baseNoteTA');

    /* fall back to the first period's own report for anything not in config */
    let base = null;
    if (period !== BASE_PERIOD){
      try{ base = await Store.getZP(user.zone, BASE_PERIOD); }catch(err){ console.error(err); }
    }
    let fromCfg = false, fromBase = false, manual = false;
    const put = (id, cfgVal, baseVal) => {
      if (has(cfgVal)){ setV(id, cfgVal); lockIf(id, baseLocked); fromCfg = true; }
      else if (has(baseVal)){ setV(id, baseVal); lockIf(id, baseLocked); fromBase = true; }
      else { lockIf(id, false); manual = true; }
    };

    /* Zone Status targets */
    put('zs_mem_t', baseCfg.zsTarget?.mem, base?.zs?.mem?.t);
    put('zs_fc_t',  baseCfg.zsTarget?.fc,  base?.zs?.fc?.t);
    ['mem','fc'].forEach(k=>document.getElementById('zs_'+k+'_t').dispatchEvent(new Event('input')));

    /* Last Year (2025) membership */
    LY_COLS.forEach(([k])=>put('ly_'+k, baseCfg.ly?.[k], base?.ly?.[k]));

    /* FTY 2026 Target column */
    TA_ROWS.forEach(([k])=>put('ta_'+k+'_t', baseCfg.target?.[k], base?.ta?.[k]?.t));

    const note = fromCfg
      ? 'Set centrally by NHQ' + (baseLocked ? ' (read-only).' : ' — correct it here if needed.')
      : fromBase ? 'Carried forward from your '+BASE_PERIOD+' report'+(baseLocked?' (read-only).':'.')
      : 'Not set centrally yet — please enter the figures.';
    [noteZS, noteLY, noteTA].forEach(el=>{ if(el) el.textContent = note; });
    if (manual && (fromCfg||fromBase)) [noteZS,noteLY,noteTA].forEach(el=>{ if(el) el.textContent = note+' Any blank field can be filled in by you.'; });
  }

  async function loadExisting(){
    document.querySelectorAll('#meTable tr[data-me]').forEach(tr=>tr.remove());
    document.getElementById('zpForm').reset();
    let r = null;
    try{ r = await Store.getZP(user.zone, $('#zpPeriod').value); }
    catch(err){ console.error(err); toast('Could not load saved report — check connection'); }
    if(r){ setNote(r.status==='draft'?'draft':'submitted'); fillForm(r); await applyBaseline(); return; }
    /* fall back to this device's auto-saved work-in-progress */
    let auto = null;
    try{ auto = JSON.parse(localStorage.getItem(autosaveKey())||'null'); }catch{}
    if(auto){ setNote('auto'); fillForm(auto); await applyBaseline(); return; }
    setNote(null); addEventRow(); addEventRow(); fillNames('centList'); fillNames('starList');
    setV('m_zpName', user.name||''); setV('m_from', zpCfg.from); setV('m_to', zpCfg.to); setV('m_date', today());
    VISIT_KEYS.forEach(([k])=>{ delete photos[k]; showPhoto(k); });
    await applyBaseline();
  }
  $('#zpPeriod').addEventListener('change', loadExisting);
  loadExisting();

  /* gather the whole form into a report object */
  function gather(status){
    const majorEvents = [...document.querySelectorAll('#meTable tr[data-me]')].map(tr=>{
      const i=tr.dataset.me;
      return {name:val('me_'+i+'_name'), date:val('me_'+i+'_date'), host:val('me_'+i+'_host'), part:nval('me_'+i+'_part')};
    }).filter(ev=>ev.name||ev.date||ev.host||ev.part!=='');
    const obj = (keys, f) => Object.fromEntries(keys.map(([k])=>[k,f(k)]));
    const r = {
      zone:user.zone, area:user.area, period:$('#zpPeriod').value,
      meta:{zpName:val('m_zpName'),
            from: zpCfg.lockFrom ? zpCfg.from : val('m_from'),
            to:   zpCfg.lockTo   ? zpCfg.to   : val('m_to'),
            reportDate:val('m_date')},
      zs:{mem:{t:nval('zs_mem_t'),a:nval('zs_mem_a')}, fc:{t:nval('zs_fc_t'),a:nval('zs_fc_a')}},
      zd:{disaff:nval('zd_disaff'), susp:nval('zd_susp'), revived:nval('zd_revived'), jvc:nval('zd_jvc'),
          centurion:namesOf('centList'), star:namesOf('starList')},
      ly:obj(LY_COLS, k=>nval('ly_'+k)),
      ta:obj(TA_ROWS, k=>({t:nval('ta_'+k+'_t'), a:nval('ta_'+k+'_a')})),
      fc:obj(FC_ROWS, k=>({t:nval('fc_'+k+'_t'), a:nval('fc_'+k+'_a'), amt:nval('fc_'+k+'_amt')})),
      ev:obj(EV_ROWS, k=>({t:nval('ev_'+k+'_t'), a:nval('ev_'+k+'_a')})),
      ep:obj(EP_ROWS, k=>nval('ep_'+k)),
      oc:obj(OC_COLS, k=>val('oc_'+k)),
      visits:Object.fromEntries(VISIT_KEYS.map(([k])=>[k,{dates:val('vi_'+k+'_dates'),tc:val('vi_'+k+'_tc'),tcno:val('vi_'+k+'_tcno'),status:val('vi_'+k+'_status'),photo:photos[k]||''}])),
      majorEvents, efforts:val('f_efforts'), actionMarks:val('f_action'),
      status:status, submittedBy:user.u, updatedAt:new Date().toISOString()
    };
    return r;
  }

  async function persist(status, okMsg){
    const r = gather(status);
    try{
      await Store.saveZP(r);
      localStorage.removeItem(autosaveKey());
      toast(okMsg);
      setNote(status==='draft'?'draft':'submitted');
    }catch(err){
      console.error(err);
      toast('Could not save online — kept safely on this device instead');
      localStorage.setItem(autosaveKey(), JSON.stringify(r));
    }
  }

  /* final submit (validates required fields) */
  document.getElementById('zpForm').addEventListener('submit', e=>{
    e.preventDefault();
    persist('submitted', 'Final report for '+$('#zpPeriod').value+' submitted');
  });
  /* save draft (no validation, not shown to NVP) */
  document.getElementById('draftBtn').addEventListener('click', ()=>{
    persist('draft', 'Draft saved — not yet visible to NVP');
  });

  /* auto-save every change locally so a refresh never loses work */
  let autoTimer = null;
  document.getElementById('zpForm').addEventListener('input', ()=>{
    clearTimeout(autoTimer);
    autoTimer = setTimeout(()=>{
      try{ localStorage.setItem(autosaveKey(), JSON.stringify(gather('draft'))); }catch{}
    }, 700);
  });

  /* ---- Download PDF (print) of the ZP's own report ---- */
  function zpPrintHTML(r){
    const m = r.meta||{}, zd = r.zd||{};
    const sec = (label, html) => '<div class="section-label">'+label+'</div>'+html;
    const kv2 = rows => '<div class="tscroll"><table class="rtab">'+rows+'</table></div>';
    const statusRows = ['mem','fc'].map(k=>{
      const s=r.zs?.[k]||{}, label=k==='mem'?'Membership':'Foundation Contribution';
      return '<tr><td class="rowlab">'+label+'</td><td class="n">'+show(s.t)+'</td><td class="n">'+show(s.a)+'</td><td class="n">'+show(shortfall(s.t,s.a))+'</td><td class="n">'+pct(s.t,s.a)+'</td></tr>';
    }).join('');
    return '<div class="print-header"><img src="jci-india-logo.png" alt="JCI India">'
      + '<div><div class="pt">ZONE PRESIDENT REPORT — '+esc(r.period)+'</div>'
      + '<div class="ps">JCI India, National Headquarters, 506 Windfall, Sahar Plaza, J. B. Nagar, Andheri (East), Mumbai 400 059 · management@jciindia.in</div></div></div>'
      + '<div class="card">'
      + kv2(th(['Name of the Zone President','Zone','Area','Period From','To','Reporting Date'])
        + '<tr><td>'+esc(m.zpName||'')+'</td><td>Zone '+r.zone+'</td><td>Area '+r.area+'</td><td>'+esc(m.from||'')+'</td><td>'+esc(m.to||'')+'</td><td>'+esc(m.reportDate||'')+'</td></tr>')
      + sec('Zone Status', kv2(th(['Zone Status','Target to become Positive','Achieved','Shortfall','Achieved %'])+statusRows))
      + sec('Zone Details', kv2(th(['LOs facing Disaffiliation','LOs under Suspension','LOs Revived (dues pending)','LO Presidents in JVC','Probable Centurion LOs','Star LOs'])
        + '<tr><td class="n">'+show(zd.disaff)+'</td><td class="n">'+show(zd.susp)+'</td><td class="n">'+show(zd.revived)+'</td><td class="n">'+show(zd.jvc)+'</td><td>'+esc(joinNames(zd.centurion))+'</td><td>'+esc(joinNames(zd.star))+'</td></tr>'))
      + sec('Last Year (2025) Membership Status', kv2(th(LY_COLS.map(([k,l])=>l))
        + '<tr>'+LY_COLS.map(([k])=>'<td class="n">'+show(r.ly?.[k])+'</td>').join('')+'</tr>'))
      + sec('Target / Achievement Report', kv2(th(['Description','Target','Achieved'])
        + TA_ROWS.map(([k,l])=>'<tr><td class="rowlab">'+l+'</td><td class="n">'+show(r.ta?.[k]?.t)+'</td><td class="n">'+show(r.ta?.[k]?.a)+'</td></tr>').join('')))
      + sec('Foundation Contribution Details', kv2(th(['Title','Target','Achieved','Amount (₹)'])
        + FC_ROWS.map(([k,l])=>'<tr><td class="rowlab">'+l+'</td><td class="n">'+show(r.fc?.[k]?.t)+'</td><td class="n">'+show(r.fc?.[k]?.a)+'</td><td class="n">'+show(r.fc?.[k]?.amt)+'</td></tr>').join('')))
      + sec('Events Participation Details', kv2(th(['Event','Target','Achieved'])
        + EV_ROWS.map(([k,l])=>'<tr><td class="rowlab">'+l+'</td><td class="n">'+show(r.ev?.[k]?.t)+'</td><td class="n">'+show(r.ev?.[k]?.a)+'</td></tr>').join(''))
        + kv2(th(EP_ROWS.map(([k,l])=>l))+'<tr>'+EP_ROWS.map(([k])=>'<td class="n">'+show(r.ep?.[k])+'</td>').join('')+'</tr>'))
      + sec('Any Other Contribution Details', kv2(th(OC_COLS.map(([k,l])=>l))
        + '<tr>'+OC_COLS.map(([k])=>'<td>'+esc(r.oc?.[k]||'')+'</td>').join('')+'</tr>'))
      + sec('NVP / NP Visit Details', kv2(th(['Visit','Visiting Dates','Tour Coordinator','T.C Contact','Status','Photo'])
        + VISIT_KEYS.map(([k,l])=>{ const v=r.visits?.[k]||{};
          return '<tr><td class="rowlab">'+l+'</td><td>'+esc(v.dates||'')+'</td><td>'+esc(v.tc||'')+'</td><td>'+esc(v.tcno||'')+'</td><td>'+esc(v.status||'')+'</td>'
            + '<td>'+(v.photo?'<img src="'+v.photo+'" class="ph-thumb">':'')+'</td></tr>'; }).join('')))
      + sec('Major Events held in the Zone', (r.majorEvents&&r.majorEvents.length)
        ? kv2(th(['Event Name','Date','Host LO','No of Participants'])
          + r.majorEvents.map(ev=>'<tr><td>'+esc(ev.name)+'</td><td>'+esc(ev.date)+'</td><td>'+esc(ev.host)+'</td><td class="n">'+show(ev.part)+'</td></tr>').join(''))
        : '<div class="hint">None reported.</div>')
      + sec('Efforts taken to make Zone positive / growth in membership', '<div style="font-size:13px;white-space:pre-wrap">'+esc(r.efforts||'—')+'</div>')
      + sec('Action Marks (if any)', '<div style="font-size:13px;white-space:pre-wrap">'+esc(r.actionMarks||'—')+'</div>')
      + kv2(th(['ZP Name','Zone','Date','Status'])
        + '<tr><td>'+esc(m.zpName||'')+'</td><td>Zone '+r.zone+'</td><td>'+esc(m.reportDate||'')+'</td><td>'+(r.status==='draft'?'DRAFT':'Submitted')+'</td></tr>')
      + '<div class="app-foot">Developed by <b>JFS Sumit Goyal</b></div>'
      + '</div>';
  }
  document.getElementById('zpPrintBtn').addEventListener('click', ()=>{
    const r = gather(zpStatus);
    document.getElementById('printArea').innerHTML = zpPrintHTML(r);
    document.body.classList.add('zp-print');
    const done = ()=>{ document.body.classList.remove('zp-print'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  });
  document.getElementById('zpCsvBtn').addEventListener('click', ()=>{
    const r = gather('current');
    const pairs = [['Zone','Zone '+r.zone],['Area','Area '+r.area],['Period',r.period],
      ['ZP Name',r.meta.zpName],['Period From',r.meta.from],['Period To',r.meta.to],['Reporting Date',r.meta.reportDate],
      ['Membership Target',r.zs.mem.t],['Membership Achieved',r.zs.mem.a],
      ['Foundation Target',r.zs.fc.t],['Foundation Achieved',r.zs.fc.a],
      ['LOs facing Disaffiliation',r.zd.disaff],['LOs under Suspension',r.zd.susp],
      ['LOs Revived (dues pending)',r.zd.revived],['LO Presidents in JVC',r.zd.jvc],
      ['Probable Centurion LOs',joinNames(r.zd.centurion)],['Star LOs',joinNames(r.zd.star)]];
    LY_COLS.forEach(([k,l])=>pairs.push(['Last Year '+l, r.ly[k]]));
    TA_ROWS.forEach(([k,l])=>{ pairs.push([l+' Target',r.ta[k].t],[l+' Achieved',r.ta[k].a]); });
    FC_ROWS.forEach(([k,l])=>{ pairs.push([l+' Target',r.fc[k].t],[l+' Achieved',r.fc[k].a],[l+' Amount',r.fc[k].amt]); });
    EV_ROWS.forEach(([k,l])=>{ pairs.push([l+' Target',r.ev[k].t],[l+' Achieved',r.ev[k].a]); });
    EP_ROWS.forEach(([k,l])=>pairs.push([l+' Participants',r.ep[k]]));
    OC_COLS.forEach(([k,l])=>pairs.push(['Other: '+l, r.oc[k]]));
    VISIT_KEYS.forEach(([k,l])=>{ const v=r.visits[k]; pairs.push([l, [v.dates,v.tc,v.tcno,v.status].filter(Boolean).join(' | ')]); });
    (r.majorEvents||[]).forEach((ev,i)=>pairs.push(['Major Event '+(i+1), [ev.name,ev.date,ev.host,ev.part].filter(x=>x!==''&&x!=null).join(' / ')]));
    pairs.push(['Efforts',r.efforts],['Action Marks',r.actionMarks]);
    const csv = pairs.map(([a,b])=>'"'+String(a).replace(/"/g,'""')+'","'+String(b??'').replace(/"/g,'""')+'"').join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['Field,Value\n'+csv],{type:'text/csv'}));
    link.download = 'JCI_ZP_Report_Zone'+r.zone+'_'+pkey(r.period)+'.csv';
    link.click();
  });
}

/* =========================================================
   CONSOLIDATED VIEW (NVP / NEC) — official NVP format
========================================================= */
function th(cells){ return '<tr>'+cells.map(c=>'<th>'+c+'</th>').join('')+'</tr>'; }

/* Baseline values for a zone: config first, then the base-period report */
function baseVal(zone, kind, key, baseByZone){
  const cfg = (typeof ZONE_BASELINE !== 'undefined' && ZONE_BASELINE[zone]) || {};
  const c = kind==='ly' ? cfg.ly?.[key]
          : kind==='zs' ? cfg.zsTarget?.[key]
          : cfg.target?.[key];
  if (c!=='' && c!=null) return c;
  const b = baseByZone?.[zone];
  return kind==='ly' ? b?.ly?.[key]
       : kind==='zs' ? b?.zs?.[key]?.t
       : b?.ta?.[key]?.t;
}

function secStatus(zones, byZone, baseByZone){
  const rows = [];
  ['mem','fc'].forEach(k=>{
    const label = k==='mem'?'Membership':'Foundation Contribution';
    let T=0,A=0;
    zones.forEach((z,i)=>{
      const s = byZone[z]?.zs?.[k]||{};
      /* Target is maintained centrally; fall back to the zone's own entry */
      const bv = baseVal(z,'zs',k,baseByZone);
      const t = (bv!==''&&bv!=null) ? bv : s.t;
      T+=n(t); A+=n(s.a);
      rows.push('<tr>'+(i===0?'<td class="rowlab" rowspan="'+(zones.length+1)+'">'+label+'</td>':'')
        +'<td class="rowlab">Zone '+z+'</td><td class="n">'+show(t)+'</td><td class="n">'+show(s.a)+'</td>'
        +'<td class="n">'+show(shortfall(t,s.a))+'</td><td class="n">'+pct(t,s.a)+'</td></tr>');
    });
    rows.push('<tr><td class="rowlab tot">Area Total</td><td class="n tot">'+T+'</td><td class="n tot">'+A+'</td><td class="n tot">'+Math.max(T-A,0)+'</td><td class="n tot">'+pct(T,A)+'</td></tr>');
  });
  return '<div class="tscroll"><table class="rtab">'
    + th(['Area Status','Zone','Target to become Positive','Achieved','Shortfall','Achieved %'])
    + rows.join('') + '</table></div>';
}
function joinNames(v){ return Array.isArray(v) ? v.filter(Boolean).join(', ') : (v||''); }
function secLastYear(zones, byZone, baseByZone){
  const cell = (z,k) => { const v = baseVal(z,'ly',k,baseByZone);
    return (v!==''&&v!=null) ? v : byZone[z]?.ly?.[k]; };
  const body = zones.map(z=>'<tr><td class="rowlab">Zone '+z+'</td>'
    + LY_COLS.map(([k])=>'<td class="n">'+show(cell(z,k))+'</td>').join('')
    +'</tr>').join('');
  const totals = LY_COLS.map(([k])=>'<td class="n tot">'+zones.reduce((s,z)=>s+n(cell(z,k)),0)+'</td>').join('');
  return '<div class="tscroll"><table class="rtab">'
    + th(['Assigned Zone'].concat(LY_COLS.map(([k,l])=>l))) + body
    + '<tr><td class="rowlab tot">Area Total</td>'+totals+'</tr></table></div>';
}
function secTA(zones, byZone, baseByZone){
  const hcells = ['Description'];
  zones.forEach(z=>{ hcells.push('Z'+z+' T','Z'+z+' A'); });
  hcells.push('Total T','Total A');
  const rows = TA_ROWS.map(([k,l])=>{
    let T=0,A=0;
    const tds = zones.map(z=>{
      const c = byZone[z]?.ta?.[k]||{};
      const bv = baseVal(z,'ta',k,baseByZone);
      const t = (bv!==''&&bv!=null) ? bv : c.t;
      T+=n(t); A+=n(c.a);
      return '<td class="n">'+show(t)+'</td><td class="n">'+show(c.a)+'</td>';
    }).join('');
    return '<tr><td class="rowlab">'+l+'</td>'+tds+'<td class="n tot">'+T+'</td><td class="n tot">'+A+'</td></tr>';
  }).join('');
  return '<div class="tscroll"><table class="rtab">'+th(hcells)+rows+'</table></div>';
}
function secFC(zones, byZone){
  const hcells = ['Title'];
  zones.forEach(z=>hcells.push('Z'+z+' T','Z'+z+' A','Z'+z+' ₹'));
  hcells.push('Total A','Total ₹');
  const rows = FC_ROWS.map(([k,l])=>{
    let A=0,AMT=0;
    const tds = zones.map(z=>{
      const c = byZone[z]?.fc?.[k]||{}; A+=n(c.a); AMT+=n(c.amt);
      return '<td class="n">'+show(c.t)+'</td><td class="n">'+show(c.a)+'</td><td class="n">'+show(c.amt)+'</td>';
    }).join('');
    return '<tr><td class="rowlab">'+l+'</td>'+tds+'<td class="n tot">'+A+'</td><td class="n tot">'+(AMT?AMT.toLocaleString('en-IN'):'')+'</td></tr>';
  }).join('');
  return '<div class="tscroll"><table class="rtab">'+th(hcells)+rows+'</table></div>';
}
function secEV(zones, byZone){
  const hcells = ['Event'];
  zones.forEach(z=>hcells.push('Z'+z+' T','Z'+z+' A'));
  hcells.push('Total T','Total A');
  const rows = EV_ROWS.map(([k,l])=>{
    let T=0,A=0;
    const tds = zones.map(z=>{
      const c = byZone[z]?.ev?.[k]||{}; T+=n(c.t); A+=n(c.a);
      return '<td class="n">'+show(c.t)+'</td><td class="n">'+show(c.a)+'</td>';
    }).join('');
    return '<tr><td class="rowlab">'+l+'</td>'+tds+'<td class="n tot">'+T+'</td><td class="n tot">'+A+'</td></tr>';
  }).join('');
  const ep = zones.map(z=>'<tr><td class="rowlab">Zone '+z+'</td>'
    + EP_ROWS.map(([k])=>'<td class="n">'+show(byZone[z]?.ep?.[k])+'</td>').join('')+'</tr>').join('');
  return '<div class="tscroll"><table class="rtab">'+th(hcells)+rows+'</table></div>'
    + '<div class="hint" style="margin:12px 0 6px">No of participants:</div>'
    + '<div class="tscroll"><table class="rtab">'+th(['Zone'].concat(EP_ROWS.map(([k,l])=>l)))+ep+'</table></div>';
}
function secOC(zones, byZone){
  const rows = zones.map(z=>'<tr><td class="rowlab">Zone '+z+'</td>'
    + OC_COLS.map(([k])=>'<td>'+esc(byZone[z]?.oc?.[k]||'')+'</td>').join('')+'</tr>').join('');
  return '<div class="tscroll"><table class="rtab">'+th(['Zone'].concat(OC_COLS.map(([k,l])=>l)))+rows+'</table></div>';
}
function secVisits(zones, byZone){
  const blocks = VISIT_KEYS.map(([k,label])=>{
    const rows = zones.map(z=>{
      const v = byZone[z]?.visits?.[k]||{};
      const extra = k==='np' ? '<td>'+esc(v.tc||'')+'</td><td>'+esc(v.tcno||'')+'</td>' : '';
      const ph = '<td>'+(v.photo?'<img src="'+v.photo+'" class="ph-thumb">':'')+'</td>';
      return '<tr><td class="rowlab">Zone '+z+'</td><td>'+esc(v.dates||'')+'</td>'+extra+'<td>'+esc(v.status||'')+'</td>'+ph+'</tr>';
    }).join('');
    const head = k==='np' ? ['Assigned Zone','Visiting Dates','Tour Coordinator','T.C Contact','Status','Photo']
                          : ['Assigned Zone','Visiting Dates','Status','Photo'];
    return '<div class="hint" style="margin:12px 0 6px"><b>'+label+' Details</b></div>'
      + '<div class="tscroll"><table class="rtab">'+th(head)+rows+'</table></div>';
  });
  return blocks.join('');
}
function secBids(zones, nvpDoc, editable){
  const bids = nvpDoc?.bids||[];
  if (editable){
    const rows = zones.map(z=>{
      const b = bids.find(x=>x.zone===z)||{};
      return '<tr><td class="rowlab">Zone '+z+'</td>'
        + '<td><input id="bid_'+z+'_name" type="text" value="'+esc(b.name||'')+'"></td>'
        + '<td><input id="bid_'+z+'_date" type="date" value="'+esc(b.date||'')+'"></td>'
        + '<td><input id="bid_'+z+'_venue" type="text" value="'+esc(b.venue||'')+'"></td>'
        + '<td><input id="bid_'+z+'_status" type="text" value="'+esc(b.status||'')+'"></td></tr>';
    }).join('');
    return '<div class="tscroll"><table class="ftab">'+th(['Assigned Zone','Event Name','Date','Venue','Status'])+rows+'</table></div>';
  }
  const rows = zones.map(z=>{
    const b = bids.find(x=>x.zone===z)||{};
    return '<tr><td class="rowlab">Zone '+z+'</td><td>'+esc(b.name||'')+'</td><td>'+esc(b.date||'')+'</td><td>'+esc(b.venue||'')+'</td><td>'+esc(b.status||'')+'</td></tr>';
  }).join('');
  return '<div class="tscroll"><table class="rtab">'+th(['Assigned Zone','Event Name','Date','Venue','Status'])+rows+'</table></div>';
}
function secMajorEvents(zones, byZone){
  const rows = zones.flatMap(z=>(byZone[z]?.majorEvents||[]).map(ev=>
    '<tr><td class="rowlab">Zone '+z+'</td><td>'+esc(ev.name)+'</td><td>'+esc(ev.date)+'</td><td>'+esc(ev.host)+'</td><td class="n">'+show(ev.part)+'</td></tr>'));
  return rows.length
    ? '<div class="tscroll"><table class="rtab">'+th(['Assigned Zone','Event Name','Date','Host LO','No of Participants'])+rows.join('')+'</table></div>'
    : '<div class="empty">No major events reported yet.</div>';
}
function secTextByZone(zones, byZone, field, colLabel){
  const rows = zones.map(z=>'<tr><td class="rowlab">Zone '+z+'</td><td>'+esc(byZone[z]?.[field]||'')+'</td></tr>').join('');
  return '<div class="tscroll"><table class="rtab">'+th(['Assigned Zone',colLabel])+rows+'</table></div>';
}
function secZoneDetails(zones, byZone){
  const rows = zones.map(z=>{
    const d = byZone[z]?.zd||{};
    return '<tr><td class="rowlab">Zone '+z+'</td><td class="n">'+show(d.disaff)+'</td><td class="n">'+show(d.susp)+'</td><td class="n">'+show(d.revived)+'</td><td class="n">'+show(d.jvc)+'</td><td>'+esc(joinNames(d.centurion))+'</td><td>'+esc(joinNames(d.star))+'</td></tr>';
  }).join('');
  return '<div class="tscroll"><table class="rtab">'+th(['Zone','LOs facing Disaffiliation','LOs under Suspension','LOs Revived (dues pending)','LO Presidents in JVC','Probable Centurion LOs','Star LOs'])+rows+'</table></div>';
}

function secNvpNotes(zones, nvpDoc, field, colLabel){
  const notes = nvpDoc?.zoneNotes||{};
  const rows = zones.map(z=>'<tr><td class="rowlab">Zone '+z+'</td><td>'+esc(notes[z]?.[field]||'')+'</td></tr>').join('');
  return '<div class="tscroll"><table class="rtab">'+th(['Assigned Zone',colLabel])+rows+'</table></div>';
}

function nameOfNVP(area){ const u = USERS.find(x=>x.role==='NVP'&&x.area===area); return u?.name||''; }
function nameOfZP(zone){ const u = USERS.find(x=>x.role==='ZP'&&x.zone===zone); return u?.name||''; }

function areaBlock(area, byZone, nvpDoc, isOwner, baseByZone){
  const zones = AREAS[area];
  const sec = (label, html) => '<div class="section-label">'+label+'</div>'+html;
  const nvpName = nvpDoc?.meta?.nvpName || nameOfNVP(area);
  const cfg = periodCfg('NVP');
  const pFrom = nvpDoc?.meta?.from || cfg.from, pTo = nvpDoc?.meta?.to || cfg.to;
  return '<div class="card">'
    + '<h2>Area '+area+' — Consolidated Report</h2>'
    + '<div class="lead">Reporting Period: '+esc(pFrom)+' to '+esc(pTo)+'</div>'
    + '<div class="lead">Assigned Zones: '+zones.join(', ')
    + (nvpName?' · NVP: '+esc(nvpName):'')
    + ' · NVP report: '+(nvpDoc ? (nvpDoc.status==='draft'?'<b style="color:#8A6A0E">Draft</b>':'<b style="color:var(--ok)">Final submitted</b>') : '<b style="color:var(--miss)">Not filed</b>')
    + '</div>'
    + sec('Overall Area Status &amp; Area Status (Zone Wise)', secStatus(zones, byZone, baseByZone))
    + sec('Last Year (2025) Membership Status of the Area <span style="font-weight:400;text-transform:none;letter-spacing:0">(maintained by NHQ)</span>', secLastYear(zones, byZone, baseByZone))
    + sec('Zone Details', secZoneDetails(zones, byZone))
    + sec('Target / Achievement Report FTY 2026', secTA(zones, byZone, baseByZone))
    + sec('Foundation Contribution Details', secFC(zones, byZone))
    + sec('Any Other Contribution Details', secOC(zones, byZone))
    + sec('Visit Details', secVisits(zones, byZone))
    + sec('Events Participation Details', secEV(zones, byZone))
    + sec('National Events Bids received from assigned Zones', secBids(zones, nvpDoc, false))
    + sec('Major Events held in the Zones', secMajorEvents(zones, byZone))
    + sec('Efforts taken to make Zone positive — reported by ZPs', secTextByZone(zones, byZone, 'efforts', 'Efforts taken (ZP report)'))
    + sec('Efforts taken to make Zone positive — NVP input', secNvpNotes(zones, nvpDoc, 'efforts', 'Efforts (NVP input)'))
    + sec('Action Marks (if any) — reported by ZPs', secTextByZone(zones, byZone, 'actionMarks', 'Action Mark (ZP report)'))
    + sec('Action Marks (if any) — NVP input', secNvpNotes(zones, nvpDoc, 'action', 'Action Mark (NVP input)'))
    + sec('NVP Remarks — zone wise', secNvpNotes(zones, nvpDoc, 'remarks', 'Remarks'))
    + '</div>';
}

/* ---------- Dashboard charts ---------- */
let _charts = [];
function mkChart(id, cfg){
  const el = document.getElementById(id);
  if (!el || typeof Chart === 'undefined') return;
  _charts.push(new Chart(el, cfg));
}
function renderCharts(areas, zones, byZone, draftZones, isNEC, baseByZone){
  /* Charts must NEVER break the rest of the dashboard */
  if (typeof Chart === 'undefined'){
    ['chSubT','chMemT','chFCT','chGrT'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent='Chart could not load — check internet connection and refresh.'; });
    return;
  }
  try{
  _charts.forEach(c=>{ try{c.destroy();}catch{} });
  _charts = [];
  const C = { blue:'#0067B1', navy:'#0B2A4A', gold:'#F2B01E', green:'#1E8E5A', red:'#C6453B', line:'#DDE6EE' };
  Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#5B7186';

  /* For NEC the x-axis is Areas (sums); for an NVP it is their Zones */
  const labels = isNEC ? areas.map(a=>'Area '+a) : zones.map(z=>'Zone '+z);
  const groups = isNEC ? areas.map(a=>AREAS[a]) : zones.map(z=>[z]);
  const sum = (zs, path) => zs.reduce((s,z)=>{
    let v = byZone[z]; for (const k of path){ v = v?.[k]; }
    /* targets live in the base-period report; fall back to it when blank */
    if (path[path.length-1]==='t'){
      const kind = path[0]==='zs' ? 'zs' : 'ta';
      const bv = baseVal(z, kind, path[1], baseByZone);
      if (bv!==''&&bv!=null) v = bv;
      else if ((v===''||v==null) && baseByZone){ let b=baseByZone[z]; for(const k of path){ b=b?.[k]; } v=b; }
    }
    return s + n(v);
  }, 0);

  /* 1. Submission status doughnut */
  const done = zones.filter(z=>byZone[z]).length;
  const draft = zones.filter(z=>!byZone[z] && draftZones.has(z)).length;
  const pending = zones.length - done - draft;
  $('#chSubT').textContent = done+' of '+zones.length+' zones submitted (final)';
  mkChart('cvStatus', { type:'doughnut',
    data:{ labels:['Submitted (final)','Draft in progress','Pending'],
      datasets:[{ data:[done,draft,pending], backgroundColor:[C.green,C.gold,C.red], borderWidth:2, borderColor:'#fff' }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'62%',
      plugins:{ legend:{ position:'bottom' } } }
  });

  /* 2. Membership Target vs Achieved */
  $('#chMemT').textContent = isNEC ? 'By area' : 'By zone';
  mkChart('cvMem', { type:'bar',
    data:{ labels, datasets:[
      { label:'Target', data:groups.map(g=>sum(g,['zs','mem','t'])), backgroundColor:'#B8D4EA', borderRadius:4 },
      { label:'Achieved', data:groups.map(g=>sum(g,['zs','mem','a'])), backgroundColor:C.blue, borderRadius:4 } ] },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'bottom' } },
      scales:{ x:{ grid:{display:false} }, y:{ beginAtZero:true, grid:{color:C.line} } } }
  });

  /* 3. Foundation Contribution Target vs Achieved */
  $('#chFCT').textContent = isNEC ? 'By area (counts, from Zone Status)' : 'By zone (counts, from Zone Status)';
  mkChart('cvFC', { type:'bar',
    data:{ labels, datasets:[
      { label:'Target', data:groups.map(g=>sum(g,['zs','fc','t'])), backgroundColor:'#F6DFA3', borderRadius:4 },
      { label:'Achieved', data:groups.map(g=>sum(g,['zs','fc','a'])), backgroundColor:C.gold, borderRadius:4 } ] },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'bottom' } },
      scales:{ x:{ grid:{display:false} }, y:{ beginAtZero:true, grid:{color:C.line} } } }
  });

  /* 4. Growth achieved: New LO's / Lady LO's / JrJc Wing */
  $('#chGrT').textContent = isNEC ? 'By area' : 'By zone';
  mkChart('cvGrowth', { type:'bar',
    data:{ labels, datasets:[
      { label:"New LO's", data:groups.map(g=>sum(g,['ta','newLOs','a'])), backgroundColor:C.blue, borderRadius:4 },
      { label:"Lady LO's", data:groups.map(g=>sum(g,['ta','ladyLOs','a'])), backgroundColor:C.gold, borderRadius:4 },
      { label:'JrJc Wing', data:groups.map(g=>sum(g,['ta','jrjc','a'])), backgroundColor:C.green, borderRadius:4 } ] },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'bottom' } },
      scales:{ x:{ grid:{display:false} }, y:{ beginAtZero:true, grid:{color:C.line} } } }
  });
  }catch(err){ console.error('Charts failed:', err); }
}

async function renderConsolidated(user){
  const nvpCfg = periodCfg('NVP');
  const areas = user.role==='NEC' ? Object.keys(AREAS) : [user.area];
  const title = user.role==='NEC' ? 'National Consolidated Report' : 'NVP Report — Area '+user.area;

  app.innerHTML = appbar(user) + '<main class="wrap view">' + modeBanner()
    + '<div class="print-header"><img src="jci-india-logo.png" alt="JCI India">'
    + '<div><div class="pt" id="phTitle"></div>'
    + '<div class="ps">JCI India, National Headquarters, 506 Windfall, Sahar Plaza, J. B. Nagar, Andheri (East), Mumbai 400 059 · management@jciindia.in</div></div></div>'
    + '<div class="pagehead"><h1>'+title+'</h1>'
    + '<div class="pick"><label style="margin:0">Report for</label>'+periodPicker('cPeriod', DEFAULT_PERIOD)+'</div></div>'
    + '<div class="kpis" id="kpis"></div>'
    + '<div class="chart-grid">'
    + '<div class="chart-card"><h3>Submission status</h3><div class="sub" id="chSubT"></div><div class="chart-box"><canvas id="cvStatus"></canvas></div></div>'
    + '<div class="chart-card"><h3>Membership — Target vs Achieved</h3><div class="sub" id="chMemT"></div><div class="chart-box"><canvas id="cvMem"></canvas></div></div>'
    + '<div class="chart-card"><h3>Foundation Contribution — Target vs Achieved</h3><div class="sub" id="chFCT"></div><div class="chart-box"><canvas id="cvFC"></canvas></div></div>'
    + '<div class="chart-card"><h3>Growth — New / Lady LO\'s &amp; JrJc Wing (Achieved)</h3><div class="sub" id="chGrT"></div><div class="chart-box"><canvas id="cvGrowth"></canvas></div></div>'
    + '</div>'
    + '<div class="card"><h2>Zone submission status</h2>'
    + '<div class="lead">Which Zone Presidents have filed for the selected period.</div>'
    + '<div id="matrixRows"></div>'
    + '<div class="legend"><span><span class="dot" style="background:var(--ok)"></span>Submitted (final)</span><span><span class="dot" style="background:var(--gold)"></span>Draft in progress</span><span><span class="dot" style="background:var(--miss)"></span>Pending</span></div></div>'
    + '<div class="toolbar no-print"><button class="btn-sec" id="csvBtn">Download CSV</button>'
    + '<button class="btn-sec" onclick="window.print()">Print / PDF</button></div>'
    + (user.role==='NVP' ? '<div id="nvpInputs"></div>' : '')
    + '<div id="consol"></div>'
    + '<div class="app-foot">Developed by <b>JFS Sumit Goyal</b></div></main>';

  async function load(){
    const period = $('#cPeriod').value;
    const ph = document.getElementById('phTitle');
    if (ph) ph.textContent = (user.role==='NEC' ? 'NATIONAL CONSOLIDATED REPORT — ' : 'NATIONAL VICE PRESIDENT REPORT — ') + period;
    const zones = zonesOf(areas);
    const allReports = await Store.zpForPeriod(period, zones);
    const reports = allReports.filter(r=>r.status!=='draft'); // drafts excluded until final submit
    const draftZones = new Set(allReports.filter(r=>r.status==='draft').map(r=>r.zone));
    const byZone = Object.fromEntries(reports.map(r=>[r.zone,r]));
    /* base-period reports supply targets & last-year figures for later periods */
    let baseByZone = byZone;
    if (period !== BASE_PERIOD){
      try{
        const baseRows = (await Store.zpForPeriod(BASE_PERIOD, zones)).filter(r=>r.status!=='draft');
        baseByZone = Object.fromEntries(baseRows.map(r=>[r.zone,r]));
      }catch(err){ console.error(err); baseByZone = {}; }
    }
    const nvpDocs = {};
    for (const a of areas) nvpDocs[a] = await Store.getNVP(a, period);

    /* KPIs */
    const sumZS = k => reports.reduce((s,r)=>s+n(r.zs?.[k]?.a),0);
    const sumTA = k => reports.reduce((s,r)=>s+n(r.ta?.[k]?.a),0);
    const fcAmt = reports.reduce((s,r)=>s+FC_ROWS.reduce((x,[k])=>x+n(r.fc?.[k]?.amt),0),0);
    $('#kpis').innerHTML =
      '<div class="kpi"><div class="n">'+reports.length+'<span style="font-size:15px;color:var(--muted)">/'+zones.length+'</span></div><div class="l">Zones reported</div></div>'
      + '<div class="kpi"><div class="n">'+sumZS('mem')+'</div><div class="l">Membership achieved</div></div>'
      + '<div class="kpi"><div class="n">'+sumTA('newLOs')+'</div><div class="l">New LO\'s</div></div>'
      + '<div class="kpi"><div class="n">'+sumTA('ladyLOs')+'</div><div class="l">Lady LO\'s</div></div>'
      + '<div class="kpi"><div class="n">'+(fcAmt?'₹'+fcAmt.toLocaleString('en-IN'):'₹0')+'</div><div class="l">Foundation amount</div></div>';

    /* Matrix */
    $('#matrixRows').innerHTML = areas.map(a=>
      '<div class="matrix-row"><div class="area-tag">Area '+a+'</div><div class="zone-chips">'
      + AREAS[a].map(z=>'<span class="zchip '+(byZone[z]?'done':draftZones.has(z)?'draft':'miss')+'" title="'+esc(nameOfZP(z))+'">Z'+z+'</span>').join('')
      + '</div></div>').join('');

    /* Charts */
    try{ renderCharts(areas, zones, byZone, draftZones, user.role==='NEC', baseByZone); }
    catch(err){ console.error('Charts failed:', err); }

    /* NVP-only inputs */
    if (user.role==='NVP'){
      const a = user.area, zonesA = AREAS[a], docA = nvpDocs[a];
      $('#nvpInputs').innerHTML = '<div class="card no-print"><h2>NVP inputs for this period</h2>'
        + '<div class="lead">These sections are filled by you (not consolidated from ZP reports). They appear in your printed report below.</div>'
        + '<div class="form-grid">'
        + '<div><label for="nv_name">Name of the NVP</label><input id="nv_name" value="'+esc(docA?.meta?.nvpName||user.name||'')+'"></div>'
        + dateField('nv_from','Reporting Period From', nvpCfg.lockFrom ? nvpCfg.from : (docA?.meta?.from||nvpCfg.from), nvpCfg.lockFrom)
        + dateField('nv_to','Reporting Period To', nvpCfg.lockTo ? nvpCfg.to : (docA?.meta?.to||nvpCfg.to), nvpCfg.lockTo)
        + '<div><label for="nv_date">Reporting Date</label><input id="nv_date" type="date" value="'+esc(docA?.meta?.reportDate||today())+'"></div>'
        + '</div>'
        + '<div class="section-label">National Events Bids received from assigned Zones</div>'
        + secBids(zonesA, docA, true)
        + '<div class="section-label">Efforts, Action Marks &amp; Remarks — your input (zone-wise)</div>'
        + '<div class="hint" style="margin-bottom:8px">The ZPs\' own efforts and action marks are consolidated automatically below. These are YOUR remarks per zone; both appear as separate sections in the report.</div>'
        + '<div class="tscroll"><table class="ftab">'
        + '<tr><th>Assigned Zone</th><th>Efforts to make Zone positive (NVP input)</th><th>Action Mark (NVP input)</th><th>Remarks</th></tr>'
        + zonesA.map(z=>'<tr><td class="rowlab">Zone '+z+'</td>'
            + '<td><textarea id="nvpe_'+z+'_efforts" rows="2"></textarea></td>'
            + '<td><textarea id="nvpe_'+z+'_action" rows="2"></textarea></td>'
            + '<td><textarea id="nvpe_'+z+'_remarks" rows="2"></textarea></td></tr>').join('')
        + '</table></div>'
        + '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">'
        + '<button class="btn-sec" id="saveNvpDraftBtn" style="margin-top:20px;padding:12px 22px;font-size:15px">Save as draft</button>'
        + '<button class="btn-primary" id="saveNvpBtn">Submit final NVP report</button></div>'
        + '<div class="hint" id="nvpStatusHint">'
        + (docA ? (docA.status==='draft' ? 'Current status: DRAFT saved '+(docA.updatedAt||'').slice(0,10)
                                         : 'Current status: FINAL submitted '+(docA.updatedAt||'').slice(0,10))
                : 'Not saved yet for this period.')
        + ' Your zone data below consolidates automatically from ZP submissions either way.</div></div>';
      zonesA.forEach(z=>{
        setV('nvpe_'+z+'_efforts', docA?.zoneNotes?.[z]?.efforts ?? '');
        setV('nvpe_'+z+'_action', docA?.zoneNotes?.[z]?.action ?? '');
        setV('nvpe_'+z+'_remarks', docA?.zoneNotes?.[z]?.remarks ?? '');
      });
      async function saveNvp(status){
        const doc = { area:a, period, status:status,
          meta:{nvpName:val('nv_name'),
                from: nvpCfg.lockFrom ? nvpCfg.from : val('nv_from'),
                to:   nvpCfg.lockTo   ? nvpCfg.to   : val('nv_to'),
                reportDate:val('nv_date')},
          zoneNotes:Object.fromEntries(zonesA.map(z=>[z, {efforts:val('nvpe_'+z+'_efforts'), action:val('nvpe_'+z+'_action'), remarks:val('nvpe_'+z+'_remarks')}])),
          bids:zonesA.map(z=>({zone:z, name:val('bid_'+z+'_name'), date:val('bid_'+z+'_date'), venue:val('bid_'+z+'_venue'), status:val('bid_'+z+'_status')}))
            .filter(b=>b.name||b.date||b.venue||b.status),
          updatedAt:new Date().toISOString() };
        try{ await Store.saveNVP(doc); toast(status==='draft'?'NVP draft saved':'NVP report submitted (final)'); load(); }
        catch(err){ toast('Could not save — check connection'); console.error(err); }
      }
      $('#saveNvpBtn').addEventListener('click', ()=>saveNvp('submitted'));
      $('#saveNvpDraftBtn').addEventListener('click', ()=>saveNvp('draft'));
    }

    /* Consolidated report(s) */
    $('#consol').innerHTML = areas.map(a=>areaBlock(a, byZone, nvpDocs[a], user.role==='NVP', baseByZone)).join('');

    /* CSV */
    $('#csvBtn').onclick = ()=>{
      const head = ['Zone','Area','Period','ZP Name','From','To','Report Date',
        'Membership Target','Membership Achieved','FC Target','FC Achieved',
        'LOs Disaffiliation','LOs Suspension','LOs Revived','LO Presidents in JVC','Centurion LOs','Star LOs'];
      LY_COLS.forEach(([k,l])=>head.push('Last Year '+l));
      TA_ROWS.forEach(([k,l])=>head.push(l+' T', l+' A'));
      FC_ROWS.forEach(([k,l])=>head.push(l+' T', l+' A', l+' Amt'));
      EV_ROWS.forEach(([k,l])=>head.push(l+' T', l+' A'));
      EP_ROWS.forEach(([k,l])=>head.push(l+' Participants'));
      OC_COLS.forEach(([k,l])=>head.push('Other: '+l));
      head.push('NVP 1st Visit','NVP 2nd Visit','NP Visit','Major Events','Efforts','Action Marks','Submitted By','Updated At');
      const rows = zones.slice().sort((x,y)=>x-y).map(z=>{
        const r = byZone[z];
        if(!r) return [z, areaOfZone(z), period, 'NOT SUBMITTED'];
        const m=r.meta||{};
        const row = [r.zone, r.area, r.period, m.zpName, m.from, m.to, m.reportDate,
          r.zs?.mem?.t, r.zs?.mem?.a, r.zs?.fc?.t, r.zs?.fc?.a,
          r.zd?.disaff, r.zd?.susp, r.zd?.revived, r.zd?.jvc, joinNames(r.zd?.centurion), joinNames(r.zd?.star)];
        LY_COLS.forEach(([k])=>row.push(r.ly?.[k]));
        TA_ROWS.forEach(([k])=>row.push(r.ta?.[k]?.t, r.ta?.[k]?.a));
        FC_ROWS.forEach(([k])=>row.push(r.fc?.[k]?.t, r.fc?.[k]?.a, r.fc?.[k]?.amt));
        EV_ROWS.forEach(([k])=>row.push(r.ev?.[k]?.t, r.ev?.[k]?.a));
        EP_ROWS.forEach(([k])=>row.push(r.ep?.[k]));
        OC_COLS.forEach(([k])=>row.push(r.oc?.[k]));
        const vs = k => { const v=r.visits?.[k]||{}; return [v.dates,v.tc,v.tcno,v.status].filter(Boolean).join(' | '); };
        row.push(vs('nvp1'), vs('nvp2'), vs('np'),
          (r.majorEvents||[]).map(ev=>[ev.name,ev.date,ev.host,ev.part].filter(x=>x!==''&&x!=null).join(' / ')).join(' ; '),
          r.efforts, r.actionMarks, r.submittedBy, r.updatedAt);
        return row;
      });
      const csv = [head].concat(rows).map(row=>row.map(c=>'"'+String(c??'').replace(/"/g,'""')+'"').join(',')).join('\n');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
      link.download = 'JCI_NGB_'+(user.role==='NEC'?'National':'Area_'+user.area)+'_'+pkey(period)+'.csv';
      link.click();
    };
  }
  $('#cPeriod').addEventListener('change', load);
  load();
}

/* ---------- Password hash tool (open site with #hash) ---------- */
function renderHashTool(){
  app.innerHTML = '<div class="hash-tool card view">'
    + '<h2>Password hash generator</h2>'
    + '<div class="lead">Type a new password to get its SHA-256 hash. Paste the hash into the <span class="mono">USERS</span> list in <span class="mono">users.js</span> to change a user\'s password.</div>'
    + '<label for="hp">New password</label><input id="hp" type="text">'
    + '<label>SHA-256 hash</label><textarea id="ho" rows="2" readonly class="mono" style="font-size:12.5px"></textarea></div>';
  $('#hp').addEventListener('input', async e=>{ $('#ho').value = e.target.value ? await sha256(e.target.value) : ''; });
}

/* ---------- Router ---------- */
function render(){
  if (location.hash === '#hash') return renderHashTool();
  const user = session();
  if (!user) return renderLogin();
  if (user.role === 'ZP') return renderZP(user);
  return renderConsolidated(user);
}
window.addEventListener('hashchange', render);
render();
