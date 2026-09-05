/* =========================================================
   JCI INDIA NGB REPORTING — CONFIGURATION
   This is the only file you normally need to edit.
   ========================================================= */

/* FIREBASE — paste your web app config here to enable shared,
   multi-user data (see README). Left empty = local demo mode. */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC0pul1TdmYUzQmm9oT6wKBDKH8O5iGT38",
  authDomain: "jci-ngb.firebaseapp.com",
  projectId: "jci-ngb",
};

/* Zone → NVP Area mapping */
const AREAS = {
  A:[3,13,14,20,29],
  B:[1,8,9,11,19],
  C:[10,15,16,23,28],
  D:[2,4,5,18,25],
  E:[12,17,21,24],
  F:[6,22,26,27],
};

/* -----------------------------------------------------------------
   APP VERSION — bump this on every change you publish.
   Shown in the footer, the login screen and the admin console, so
   you can confirm at a glance which build a user is actually running
   (handy when someone's browser is serving a cached copy).
   Convention: MAJOR.MINOR — raise MINOR for changes/fixes,
   MAJOR for a significant reworking.
----------------------------------------------------------------- */
const APP_VERSION = '2.3';
const APP_UPDATED = '2026-08-26';
const APP_CHANGES = [
  ['2.3','2026-09-05','Downloads now use meaningful filenames: zone/area/portfolio, person name and date-time.'],
  ['2.2','2026-09-05','Fixed the blank first page in printed reports (page-break rule); labelled the participants table and declaration block in the ZP PDF.'],
  ['2.1','2026-08-26','Charts added to the ZP report and its PDF; fixed the blank first page when downloading a ZP report.'],
  ['2.0','2026-08-26','An NVP can no longer submit a final report until every assigned zone has filed; areas with any pending zone now show as pending everywhere.'],
  ['1.9','2026-08-26','NVP report status shown area by area with names, in the admin console and the consolidated view.'],
  ['1.8','2026-08-26','NVP Efforts, Action Mark and Remarks now compulsory for every zone before a final submission; pending-zone notice on the NVP page.'],
  ['1.7','2026-08-26','Reports lock after final submission; SuperAdmin can reopen them.'],
  ['1.6','2026-08-26','All seven ND formats completed: Action Marks, ND/NC Recognitions, National Coordinators performance, Remarks, Zone Directors Meetings, Officers Visit (Management), Any Other Contribution and Major Programs (G&D), JCSAT and JJC Board (JrJc), National-level programs (Training).'],
  ['1.5','2026-08-26','National Directors\' names added.'],
  ['1.4','2026-08-26','Removed the version/changelog card from the admin console.'],
  ['1.3','2026-08-26','G&D foundation table now has Target/Achieved per title; ND status board in admin console.'],
  ['1.2','2026-08-26','National Directors reports added (7 portfolios); view-only access for ZP, NVP and NEC.'],
  ['1.1','2026-08-26','Events Participation targets moved into the central baseline data.'],
  ['1.0','2026-08-25','Login activity log with IP and device; SuperAdmin console; baseline data editor; developer credit.'],
];

/* Reporting periods (reports are filed per NGB / NEC meeting) */
const PERIODS = ['I NGB','II NGB','III NGB','IV NGB','V NGB','VI NEC & IV NGB'];
const DEFAULT_PERIOD = 'IV NGB';

/* -----------------------------------------------------------------
   REPORTING PERIOD DATES — configurable separately for ZP and NVP.
   from      : start date shown in the report (YYYY-MM-DD)
   to        : 'today' = always the current date, or a fixed 'YYYY-MM-DD'
   lockFrom  : true = read-only, false = the user may edit it
   lockTo    : true = read-only, false = the user may edit it
   Example — to let NVPs choose their own dates, set lockFrom/lockTo false.
----------------------------------------------------------------- */
const PERIOD_DATES = {
  ZP:  { from:'2026-05-25', to:'today', lockFrom:true, lockTo:true },
  NVP: { from:'2026-05-25', to:'today', lockFrom:true, lockTo:true },
};

/* -----------------------------------------------------------------
   ZONE BASELINE DATA — maintained centrally by NHQ.
   For each zone:
     ly       : Last Year (2025) Membership Status
                annual, half2, activeLOs, newLOs, jrjc, ladyLOs
     zsTarget : Zone Status "Target to become Positive"
                mem = Membership, fc = Foundation Contribution
     target   : FTY 2026 Target column of the Target/Achievement table
                mem2nd (Membership), newLOs, ladyLOs, jrjc,
                jcomTables, jcomMembers, jacMembers
     evTarget : Target column of Events Participation Details
                aspac, wc, jcsat, nalanda, nttts, ablePro, ableEnt,
                jasmine, oyp, tobip, natcon
   Leave a value as '' if not known — the ZP can then type it in.
   BASELINE_LOCKED = true  -> ZPs see these as read-only (recommended)
                     false -> ZPs may edit / correct them
----------------------------------------------------------------- */
const BASELINE_LOCKED = true;

/* -----------------------------------------------------------------
   LOCK AFTER FINAL SUBMIT
   true  -> once a ZP, NVP or ND presses "Submit final report" their
            report becomes read-only. Only the SuperAdmin can reopen it
            (open the report from the admin console and press "Reopen
            for editing"), which returns it to draft so the owner can
            correct and resubmit.
   false -> submitted reports stay editable by their owner.
----------------------------------------------------------------- */
const LOCK_AFTER_SUBMIT = true;

const ZONE_BASELINE = {
  1: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  2: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  3: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  4: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  5: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  6: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  8: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  9: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  10: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  11: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  12: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  13: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  14: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  15: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  16: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  17: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  18: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  19: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  20: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  21: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  22: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  23: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  24: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  25: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  26: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  27: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  28: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
  29: { ly:{annual:'', half2:'', activeLOs:'', newLOs:'', jrjc:'', ladyLOs:''}, zsTarget:{mem:'', fc:''}, target:{mem2nd:'', newLOs:'', ladyLOs:'', jrjc:'', jcomTables:'', jcomMembers:'', jacMembers:''},
       evTarget:{aspac:'', wc:'', jcsat:'', nalanda:'', nttts:'', ablePro:'', ableEnt:'', jasmine:'', oyp:'', tobip:'', natcon:''} },
};

/* Users — passwords stored as SHA-256 hashes, never plain text.
   Default pattern: ZP -> Zp<zone>@2026, NVP -> Nvp<Area>@2026, NEC -> Nec@2026.
   To change a password: open the site with #hash, type the new
   password, and paste the generated hash over "p" below. */
const USERS = [{"u":"nvpa","p":"be07e99d68448c7590794459c45d1b15c81a145ec4a57ad519c23fed794b8993","role":"NVP","area":"A","name":"JFS JITESH ADVANI"},{"u":"zp3","p":"b14585fc4d7de79b3a8e3fb5ae0baa0850cd428c57a28aeb128aca49f3109cf5","role":"ZP","zone":3,"area":"A","name":"JCI SEN GAURAV SETH"},{"u":"zp13","p":"2cbd94073186a3f6cfe20070d9ee370fb3388572e4d73696282651b57c9f9080","role":"ZP","zone":13,"area":"A","name":"JFD SAURABH GATTANI"},{"u":"zp14","p":"ecb587981d3019b3d17a2bd60edf726ac17b7b476e1d2afdafe906be493ff9b9","role":"ZP","zone":14,"area":"A","name":"PRAJWAL S. JAIN"},{"u":"zp20","p":"fba68b0579cafd806b17f0c13b3769ef2a56d4b2f1ff31d7e74ae32b75e64b28","role":"ZP","zone":20,"area":"A","name":"JCI SEN JAISON GEORGE"},{"u":"zp29","p":"966ae2c080e78cf2d83532266ed0ec8b8feddfefd35b5e6b847e8afb915aa909","role":"ZP","zone":29,"area":"A","name":"JC MANIVANNAN N"},{"u":"nvpb","p":"fa749a002b817ec2b3ce276d575186de56953a2bb329fa7c3bb1001ab0c6ed22","role":"NVP","area":"B","name":"JFS R KOWSIK"},{"u":"zp1","p":"708ecca34f80c43ce37750021b8975994cd0d679d839ca22d9669d954b56148f","role":"ZP","zone":1,"area":"B","name":"JFD SOMEN GOYAL"},{"u":"zp8","p":"73744ce879797e40be82195d83e0cc919d42856273752e4f6da5bf92f99c1a35","role":"ZP","zone":8,"area":"B","name":"JFS LALIT N. BALDANIYA"},{"u":"zp9","p":"a3abbfc8a4bb30e1ad5a93e9bc04f243563eff0a329781fe3f68eb69b4734f65","role":"ZP","zone":9,"area":"B","name":"JCI SEN AARTI MITTAL"},{"u":"zp11","p":"b58942be8a298a28bb7d487ce824b4b98a76209bc5753edd2aaebeebb1788bbb","role":"ZP","zone":11,"area":"B","name":"JFM MAMTA NAIK"},{"u":"zp19","p":"4ad21c231d2c6687ff9d9a37a1d7e58a075f8f1ff09ec421ba273dabbc3b14f2","role":"ZP","zone":19,"area":"B","name":"JCI SEN ARUN PRABHU N"},{"u":"nvpc","p":"b9f47ef0569e87edd8f2c42cb7a9e5d23c08c63e48fe64c5bb3ea4db672f8124","role":"NVP","area":"C","name":"JFR A. MANIKANDAN"},{"u":"zp10","p":"f9d12ea82aa32953b2b20cc90d5a82a370840ae2c14a7d8e4da5d3ef043afedd","role":"ZP","zone":10,"area":"C","name":"JC AMIT GAUR"},{"u":"zp15","p":"f97c7cb4985be7b88874027608ad931cd97a20c0a7bfd4b2fd63c171c12554cd","role":"ZP","zone":15,"area":"C","name":"JFF SANTHOSH SHETTY"},{"u":"zp16","p":"7da208764b9e14ffb0d355e57c5f5a277a21091585a05477c3f727c7db34a751","role":"ZP","zone":16,"area":"C","name":"JFD M R VIJAYGANESSH"},{"u":"zp23","p":"2c99e7cd1a16e7a98dc53cdeee84536ea5826329e95d14ebcdad007d830e1015","role":"ZP","zone":23,"area":"C","name":"JFM AR.T.VIGNESH"},{"u":"zp28","p":"c126157c8b17ec5bc6d1dab71e7b18c29641be7950f34410eb729a0338741f98","role":"ZP","zone":28,"area":"C","name":"JCI SEN MEERA MENON"},{"u":"nvpd","p":"3eade27a8cfbf7e7cedad6a28a4a2df4ae762fa8f62639dedbcbd2f021e84610","role":"NVP","area":"D","name":"JCI SEN RAKESH NAIR"},{"u":"zp2","p":"d97d9c7db78e380b53f58da8f66c885df48b8da2c3cea6ed3ffe91a0705e2304","role":"ZP","zone":2,"area":"D","name":"JFM CA MILAN AGARWAL"},{"u":"zp4","p":"554bf7d1d9e85f4e245d0ba8988d4e134c9a961f05dccfb35f1c7c0512eb427c","role":"ZP","zone":4,"area":"D","name":"JFG CHAITANYA VASANTHAVADA"},{"u":"zp5","p":"1f914dde01a7477aca3711ec4a9d1f6af1945478a63bf865652a8b68d8f70664","role":"ZP","zone":5,"area":"D","name":"JFS CA BK DAD"},{"u":"zp18","p":"ea9953f32d3f1f7219ee7bab18b4e96bfaab8c73dcaf266c299e54c8c46e1c40","role":"ZP","zone":18,"area":"D","name":"JCI SEN S KARTHIK BOSE"},{"u":"zp25","p":"8023c1b44f4e9571b9808beef078cd099e0af5178465688704f61b82edfbe5ee","role":"ZP","zone":25,"area":"D","name":"JFS SUMIT PODDAR"},{"u":"nvpe","p":"01fa0ba0a5c1ea97b2cf4b896d2dcff704ab67ff832f2c4d1e44c448057a807b","role":"NVP","area":"E","name":"JFS SURESH GOMPA"},{"u":"zp12","p":"3a1543501b534811cfe14ffa3ac77d0d5b11af0a226a8bb17d883ca142ed5991","role":"ZP","zone":12,"area":"E","name":"JFS GOUTAM KUMAR JAIN"},{"u":"zp17","p":"bd0f2577c82cac3967d456610d7a6e87894dbfbbcc6e1d83ad5e9c29f97149c2","role":"ZP","zone":17,"area":"E","name":"JFS PREMSHARAN MATHIVANAN"},{"u":"zp21","p":"843ac54375ca765261b330d1d9fd3928e6996396ef9b820b6ae13b9227f10724","role":"ZP","zone":21,"area":"E","name":"HGF GOKUL JB"},{"u":"zp24","p":"169d657dfeea58a1c4c9776f486f0af1e151468a7cd7ed3bf0b40b5aab090a93","role":"ZP","zone":24,"area":"E","name":"JFD CA MADHUSUDHAN NAVADA"},{"u":"nvpf","p":"cbf01288d01ac34b76bfb3ae5b1d54ae2da743c2d965d54b59e6970bfedd6a30","role":"NVP","area":"F","name":"JFP YASHASWINI"},{"u":"zp6","p":"a90d536dfd8d72e91f7f29938c4a23392f34e25114a228023f5a11c662777dde","role":"ZP","zone":6,"area":"F","name":"JC AMRITA SHARMA"},{"u":"zp22","p":"dafc11d81f6a62aac6233ea5d2d7175e93e83a39c1e299b1bf900cb32a8bdb01","role":"ZP","zone":22,"area":"F","name":"JFF SYAM MOHAN M. S"},{"u":"zp26","p":"c64eea2a2f25f1ea99d41341fa413f2086b3f2d64edfd193f180f8b4e459b938","role":"ZP","zone":26,"area":"F","name":"JCI SEN K PRAMODH KUMAR"},{"u":"zp27","p":"efb10d350b6d51b38ac80787df60cf711ad156612f937292e7dcadad4d2b9282","role":"ZP","zone":27,"area":"F","name":"JFP CA PRANAV LATH"},{"u":"nec","p":"1666f9106b1d3b353dccc28b9a06b6304685f111530ba110dff6d5c98514dcaf","role":"NEC"},{"u":"admin","p":"a36aef5a11c4073fbe60314fc9df530a9d5f986533594d1f5190742ff9e0e408","role":"ADMIN","name":"System Administrator"},{"u":"ndgd","p":"c801d6c511f6ffae8c198ef0530176f901c85c4660280b50a803e811ca9a07df","role":"ND","portfolio":"gd","name":"JFS Chitra KS"},{"u":"ndbusiness","p":"c1815de9e58e4b0ae3f6706fc9d3f1677077fdf09eee8fe25a23573d938c20a8","role":"ND","portfolio":"business","name":"JFS Chaturvedi Vutukuru"},{"u":"ndcommunity","p":"b569a5680682538edf4afd0f0676adc4324320be28d402a74ae60c5c819f13cc","role":"ND","portfolio":"community","name":"JC Arun E. Vappatt"},{"u":"ndtraining","p":"8f4fae55b064052bf179e89eba236e68033a1aafcea6a7903f7fc0591245a0f9","role":"ND","portfolio":"training","name":"JFM Anand Mishra"},{"u":"ndmanagement","p":"f5b78afbf784c11c4c66acab2fdea0efef53568c8488c0925c280cf422fd7126","role":"ND","portfolio":"management","name":"JFS Kushal Zanwar"},{"u":"ndpr","p":"41aa713967ad9f197457ce335b996bdb122edd1ba366fc9b059381d0bee47078","role":"ND","portfolio":"pr","name":"JFD Rahul Singla"},{"u":"ndjrjc","p":"23bcb91cc3dbaf3262a6bc0cd46ea9f28ee76703aec97ef1f8586a4e9b584cae","role":"ND","portfolio":"jrjc","name":"JC Sahezad Yunusbhai B"}];
