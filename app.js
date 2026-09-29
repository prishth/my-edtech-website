/* Prishth app UI: shared helpers for tests.html and dashboard.html */
(function(){
"use strict";
var SB_URL="https://aqrxmcmmdazyslznilbl.supabase.co";
var SB_KEY="sb_publishable_wRKj-veZ1_Ro-HSH8kXCFg_ifvjUD8L";
var P={};
P.sb=window.supabase.createClient(SB_URL,SB_KEY);

/* Feather-style icons */
var IC={
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
 arrow:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z"/>',
 gift:'<rect x="3" y="8" width="18" height="4"/><path d="M12 8v13"/><path d="M19 12v9H5v-9"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
 grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/>',
 chart:'<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>',
 bookmark:'<path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
 book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V22h16"/>',
 layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
 cap:'<path d="m22 10-10-5L2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
 scale:'<path d="M12 3v18"/><path d="M5 21h14"/><path d="m5 8 3 7a3 3 0 0 1-6 0zM19 8l3 7a3 3 0 0 1-6 0z"/><path d="M5 8h14"/>',
 building:'<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
 down:'<path d="m6 9 6 6 6-6"/>',
 lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
 doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'
};
P.icon=function(n,c){return '<svg class="i '+(c||'')+'" viewBox="0 0 24 24">'+(IC[n]||'')+'</svg>';};
P.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};

/* exam grouping by name */
P.groupOf=function(exam){
 var e=String(exam||'').toLowerCase();
 if(/clat|ailet|lsat|law/.test(e))return 'Law';
 if(/ipmat|jipmat|cuet|christ|bba|set\b|symbiosis|bba/.test(e)&&!/mba/.test(e))return 'UG';
 if(/cat|xat|snap|nmat|cmat|mat|mba|tiss|mah/.test(e))return 'MBA';
 return 'Other';
};
P.GROUPS=['MBA','Law','UG','Other'];
P.GROUP_ICON={MBA:'building',Law:'scale',UG:'cap',Other:'book'};

/* nav: session-aware */
P.nav=async function(active){
 var s=(await P.sb.auth.getSession()).data.session;
 var links=[['Tests','/tests'],['PYQs','/pyqs'],['Practice','/dashboard?view=free'],['Resources','/blog']];
 var h='<a class="brand" href="/">Prishth</a><div class="links">'+links.map(function(l){
   return '<a href="'+l[1]+'" class="'+(l[0]===active?'on':'')+'">'+l[0]+'</a>';}).join('')+'</div><div class="sp"></div>'+
   '<label class="search">'+P.icon('search')+'<input id="navQ" placeholder="Search tests, exams or topics..." autocomplete="off"></label>';
 if(s){
  var em=s.user.email||'',ini=em.slice(0,2).toUpperCase();
  h+='<div class="who" id="who"><span class="avatar">'+P.esc(ini)+'</span>'+P.icon('down','sm')+
     '<div class="menu" id="menu"><div class="em">'+P.esc(em)+'</div><a href="/dashboard">My Dashboard</a><a href="/dashboard?view=purchased">My Purchases</a><button id="out">Log out</button></div></div>';
 }else{
  h+='<a class="btn-login" href="/login?next=dashboard">Log in</a>';
 }
 var nav=document.getElementById('nav');nav.className='nav';nav.innerHTML=h;
 var who=document.getElementById('who');
 if(who){who.addEventListener('click',function(e){e.stopPropagation();document.getElementById('menu').classList.toggle('open');});
  document.addEventListener('click',function(){document.getElementById('menu').classList.remove('open');});
  document.getElementById('out').addEventListener('click',async function(){await P.sb.auth.signOut();location.href='/';});}
 var q=document.getElementById('navQ');
 q.addEventListener('keydown',function(e){if(e.key==='Enter'&&q.value.trim())location.href='/tests?q='+encodeURIComponent(q.value.trim());});
 return s;
};

/* data */
P.load=async function(){
 var r=await Promise.all([
  P.sb.from('tests').select('*').eq('is_published',true).order('exam'),
  P.sb.from('questions').select('test_id')
 ]);
 var qc={};(r[1].data||[]).forEach(function(q){if(q.test_id)qc[q.test_id]=(qc[q.test_id]||0)+1;});
 return {tests:r[0].data||[],qc:qc,error:r[0].error};
};

/* test card. opts: {best, needLogin} */
P.card=function(t,qc,best){
 var n=qc[t.id]||0;
 var neg=Number(t.marks_wrong)!==0?String(t.marks_wrong):'0';
 var btn=n>0?'<a class="btn pri sm" href="/test?id='+t.id+'">'+(best?'Re-attempt':'Start Test')+' '+P.icon('arrow','sm')+'</a>'
            :'<span class="btn off sm">No questions yet</span>';
 return '<div class="card tcard"><div class="top"><h3>'+P.esc(t.test_name)+'</h3>'+
  '<span class="tag '+(t.is_free?'free':'paid')+'">'+(t.is_free?'Free':'Paid')+'</span></div>'+
  '<div class="meta"><span>'+P.esc(t.exam)+'</span><span>'+n+' Qs</span><span>'+P.icon('clock','sm')+t.duration_minutes+' min</span>'+
  '<span>+'+t.marks_correct+' / '+neg+'</span></div>'+
  '<div class="foot">'+(best?'<span class="best">Best: '+best.score+' / '+best.total_marks+'</span>':'<span></span>')+btn+'</div></div>';
};

/* exam tiles / counts */
P.examCounts=function(tests){
 var m={};tests.forEach(function(t){var k=t.exam||'Other';m[k]=(m[k]||0)+1;});return m;
};
P.slug=function(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');};
window.P=P;
})();
