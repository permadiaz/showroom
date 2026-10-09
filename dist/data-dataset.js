// Entirely fictional, internally reconciled example. Revenue is IDR.
export const revenue=[
 ['West','A',300000,271000],['West','B',200000,158000],
 ['East','A',150000,166000],['East','B',100000,79000],
 ['North','A',200000,202500],['North','B',50000,39500]
].map(([region,category,previous,current])=>({region,category,previous:previous*1000,current:current*1000}));
export const signals={visits:{previous:100000,current:100200},webOrders:{previous:3000,current:2640},orders:{previous:10000,current:9160},returningOrders:{previous:6000,current:5200},newOrders:{previous:4000,current:3960},storeVisits:{previous:120000,current:120240},stock:[{sku:'SKU-018',previous:96,current:72},{sku:'SKU-024',previous:94,current:75},{sku:'SKU-031',previous:97,current:70}]};
export const stores=[11,12,13,14,15,16,17,18,17,16,14,13].map((n,i)=>({id:'Store '+String(i+1).padStart(2,'0'),region:i<8?'West':i<11?'East':'North',previous:20000000,current:n*1000000}));
export const sum=(rows,key)=>rows.reduce((a,r)=>a+r[key],0);
export const change=(previous,current)=>(current/previous-1)*100;
export function aggregate(predicate=()=>true){const r=revenue.filter(predicate);const previous=sum(r,'previous'),current=sum(r,'current');return {previous,current,change:change(previous,current)};}
export const totals=aggregate();
export const formatPercent=n=>(n>0?'+':'')+n.toFixed(1)+'%';
export const money=n=>'Rp '+(n/1000000).toLocaleString('en-US',{maximumFractionDigits:1})+'m';
const pair=(label,a,b,unit='revenue')=>({label,previous:a,current:b,unit});
export function evidenceFor(id){const west=aggregate(r=>r.region==='West'),cat=aggregate(r=>r.category==='B');const base=[
 {title:'Overall sales',headline:formatPercent(totals.change),text:'September sales declined compared with August in this example.',source:'ERP revenue, reconciled with POS · Aug–Sep 2026',chart:pair('Total sales',totals.previous,totals.current),note:'Revenue is compared on the same reporting-period and currency basis.'},
 {title:'Where the decline concentrates',headline:'West Region · '+formatPercent(west.change),text:'West contributes Rp 71m of the Rp 84m net decline. Other regions together account for the remaining Rp 13m.',source:'ERP + POS · shared region definitions',chart:pair('West Region',west.previous,west.current),note:'Largest contribution refers to the absolute revenue change, not just a percentage.'},
 {title:'Which category contributes most',headline:'Category B · '+formatPercent(cat.change),text:'Category B accounts for Rp 73.5m of the total Rp 84m decline. It is the largest category contribution.',source:'ERP revenue + POS product mapping',chart:pair('Category B · all regions',cat.previous,cat.current),note:'Region and category describe overlapping views of the same decline. Do not add their contributions together.'},
 {title:'A supporting demand signal',headline:'Traffic stable. Conversion lower.',text:'Website visits rose 0.2%, while website orders fell from 3,000 to 2,640. Conversion moved from 3.00% to 2.63%.',source:'Website · visits and orders aligned to the reporting period',chart:pair('Website conversion',3,signals.webOrders.current/signals.visits.current*100,'percent'),note:'Website traffic is one channel. This association alone does not establish the cause of the overall sales decline.'},
 {title:'A customer signal',headline:'Returning-customer orders · −13.3%',text:'Orders from returning customers fell from 6,000 to 5,200; new-customer orders moved from 4,000 to 3,960.',source:'CRM customer groups + ERP/POS orders',chart:pair('Returning-customer orders',6000,5200,'count'),note:'Lower repeat purchasing warrants investigation. It is not proof that customers have churned.'}
 ];
 if(id==='products')return [base[2],{...base[1],text:'West Category B revenue fell from Rp 200m to Rp 158m. The same category also declined in East and North.',chart:pair('Category B · West',200000000,158000000)},base[0],base[3],base[4]];
 if(id==='customers')return [{...base[4],headline:'Returning buyers warrant review.',text:'The example highlights weaker repeat purchasing. It cannot reliably rank individual customers by churn likelihood.',note:'This demo has no validated churn model or individual risk scores.'},base[0],{title:'Order mix',headline:'The decline is concentrated in repeat orders.',text:'Returning-customer orders account for 800 of the 840 fewer orders. New-customer orders account for 40.',source:'CRM segments + order history',chart:pair('New-customer orders',4000,3960,'count'),note:'Definitions and customer identity matching must be validated.'},base[3],{title:'What we still do not know',headline:'A signal is not a prediction.',text:'Customer tenure, contact history, expected purchase frequency and validated outcomes would be needed to assess churn likelihood.',source:'Evidence gap · no predictive model is running',note:'Start with a defined churn outcome and a reviewed use case.'}];
 if(id==='stores')return [base[1],{title:'Compare the regions',headline:'The change is uneven.',text:'West declined 14.2%; East declined 2.0%; North declined 3.2%. Store-level evidence can help explain the difference.',source:'ERP/POS · three reconciled regional totals',chart:pair('East Region',250000000,245000000),note:'Rates describe the same reporting window; they do not identify a cause.'},base[2],base[3],base[4]];
 return base;}
export const followups=[
 {id:'category',question:'Why did Category B decline?',layers:[
 {title:'Start with the stores.',text:'Twelve stores account for Rp 64m of the Rp 73.5m Category B decline. Their Category B sales moved from Rp 240m to Rp 176m.',source:'POS store/category sales · reconciled to category total'},
 {title:'Traffic alone does not explain it.',text:'Visits at those stores were nearly stable: 120,000 to 120,240. Category B orders fell from 2,400 to 1,760 in this sample.',source:'Store visit counters + POS Category B orders'},
 {title:'A stock signal deserves investigation.',text:'Availability was lower for three high-volume SKUs: SKU-018, SKU-024 and SKU-031. Check stock movements and promotion changes before attributing the decline.',source:'ERP inventory snapshots + POS product IDs',stock:true}
 ]},
 {id:'stores',question:'Which stores contributed most?',layers:[
 {title:'Store 01 has the largest decline in this cohort.',text:'Category B sales fell from Rp 20m to Rp 11m in Store 01. Store 02 fell to Rp 12m. Store 03 and Store 12 each fell to Rp 13m.',source:'POS · the twelve-store Category B cohort',stores:true},
 {title:'The regional pattern remains visible.',text:'Eight of these stores are in West, three in East and one in North. Their declines reconcile with the category totals; other stores can offset part of a decline.',source:'Store master + POS region mapping'},
 {title:'Take the evidence back to operations.',text:'Ask these stores about replenishment, staffing and promotion execution. The report identifies where to investigate, not what caused every outcome.',source:'Investigation recommendation · not a causal conclusion'}
 ]},
 {id:'orders',question:'Was this caused by fewer customers or smaller orders?',layers:[
 {title:'There were fewer orders.',text:'Orders fell from 10,000 to 9,160. Average order value stayed at Rp 100,000. In this example, the sales change aligns with fewer orders, not a smaller average basket.',source:'ERP/POS · revenue divided by order count'},
 {title:'Most of the order decline came from returning buyers.',text:'Returning-customer orders declined by 800; new-customer orders declined by 40. Order counts alone do not tell us the number of distinct customers.',source:'CRM segment mapping + ERP/POS orders'},
 {title:'Ask the next customer question.',text:'Were repeat buyers unable to find the items they wanted, buying less often, or buying elsewhere? Customer-level analysis and operational evidence are still needed.',source:'Hypotheses to validate · no customer churn prediction'}
 ]},
 {id:'month',question:'What changed compared with the previous month?',layers:[
 {title:'Compare like with like.',text:'August revenue was Rp 1,000m; September revenue was Rp 916m. Dates, currency and product definitions are aligned for this comparison.',source:'Prepared ERP/POS monthly revenue'},
 {title:'Several signals moved together.',text:'Category B sales, repeat orders and website conversion declined. Website visits remained nearly stable.',source:'ERP + CRM + POS + Website · same monthly window'},
 {title:'Some questions remain open.',text:'Promotion differences, replenishment delays and whether the issue persists this month are not established by this dataset.',source:'Explicit evidence gaps · investigate before deciding'}
 ]}
];
