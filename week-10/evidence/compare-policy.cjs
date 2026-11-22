const fs = require('node:fs');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const path = require('node:path');
const root=path.resolve(__dirname, '../..');
const ts = require(path.join(root, 'week-10/app/node_modules/typescript'));
const baseline=process.argv[2] || 'ed0731ef6205d0e2ca3c77f722b9df1439cacab7';
function load(source, imports={}) {
 const exports = {};
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 new Function('exports','require',code)(exports,(name)=>{if(!(name in imports))throw Error(name);return imports[name];});
 return exports;
}
const old=(file)=>cp.execFileSync('git',['show',baseline+':week-10/app/src/'+file],{cwd:root,encoding:'utf8'});
const now=(file)=>fs.readFileSync(root+'/week-10/app/src/'+file,'utf8');
const policy=load(now('lib/availabilityPolicy.ts'));
const oldB=load(old('booking.ts')).canBook,newB=load(now('booking.ts'),{'./lib/availabilityPolicy':policy}).canBook;
const oldA=load(old('lib/availability.ts')).checkAvailability,newA=load(now('lib/availability.ts'),{'./availabilityPolicy':policy}).checkAvailability;
const values=[-1,0,539,540,541,570,600,630,660,720,840,841,1380,1440,1441,NaN,Infinity];
let predicates=0,adapters=0;
for(const start of values)for(const end of values)for(const now of [0,540,NaN])for(const blocked of [false,true])for(const bookings of [[],[{start:600,end:660}],[{start:600,end:660},{start:720,end:780}]]) {
 const request=Object.freeze({start,end,now,blocked,bookings:Object.freeze(bookings.map(Object.freeze))});
 assert.deepEqual(newB(request),oldB(request));predicates++;
 for(const roomId of ['r1','unknown']) {
  const input={roomId,start,end,currentTime:now},rooms=[{id:'r1',name:'Fictional',blocked}],events=bookings.map((b,i)=>({...b,id:String(i),roomId:'r1',bookedBy:'Fictional'}));
  const before=structuredClone({input,rooms,events});
  assert.deepEqual(newA(input,rooms,events),oldA(input,rooms,events));
  assert.deepEqual({input,rooms,events},before);adapters++;
 }
}
console.log('PASS: '+predicates+' canBook results exactly equal baseline; '+adapters+' UI-adapter decisions/messages exactly equal baseline; fixtures unchanged.');
console.log('Inputs include touching, overlap, 120/121 boundaries, midnight, invalid numbers, blocked and unknown room. This equivalence check preserves existing invalid-clock behavior; it does not prove every possible input.');
