// Prepared example only: one period, the same five-branch cohort throughout.
export const businessQuestion='WHY DID SALES DECLINE LAST MONTH?';
export const answerability=[
 {value:'multiple_systems',label:'CHECK MULTIPLE SYSTEMS'},
 {value:'export_to_excel',label:'EXPORT TO EXCEL'},
 {value:'wait_for_report',label:'WAIT FOR A REPORT'},
 {value:'data_team',label:'ASK THE DATA TEAM'},
 {value:'already_answerable',label:'WE CAN ALREADY ANSWER IT'},
 {value:'not_sure',label:'NOT SURE'}
];
export const benchmark={
 branches:[{previous:300,current:270},{previous:250,current:222},{previous:200,current:176},{previous:150,current:150},{previous:100,current:98}],
 transactions:{previous:10000,current:8900},traffic:{previous:100000,current:114000},
 pipeline:{previous:200,current:184},target:1000,
 // Revenue is in illustrative millions; traffic means visits to these same branches.

};
export const technologySteps=['ERP / POS / CRM / EXCEL','INTEGRATE','BIGQUERY','LOOKER / ANALYTICS','OPTIONAL AI'];

export const revenueTotals=benchmark.branches.reduce((sum,b)=>({previous:sum.previous+b.previous,current:sum.current+b.current}),{previous:0,current:0});
export const percentChange=(pair,digits=0)=>{const value=(pair.current/pair.previous-1)*100;return `${value<0?'−':'+'}${Math.abs(value).toFixed(digits)}%`;};
export const salesChange=percentChange(revenueTotals,1);
export const declineBranches=benchmark.branches.filter(b=>b.previous-b.current>2);
export const conversion={previous:benchmark.transactions.previous/benchmark.traffic.previous,current:benchmark.transactions.current/benchmark.traffic.current};
benchmark.evidence=[{label:'SALES',value:salesChange},{label:'TRANSACTIONS',value:percentChange(benchmark.transactions)},{label:'TRAFFIC',value:percentChange(benchmark.traffic)},{label:'CONVERSION',value:conversion.current<conversion.previous?'DOWN':'UP'}];
export const sourceFragments=[{id:'ERP',domain:'REVENUE',fragment:`Revenue ${revenueTotals.current<revenueTotals.previous?'↓':'↑'}`},{id:'POS',domain:'TRANSACTIONS',fragment:`Transactions ${benchmark.transactions.current<benchmark.transactions.previous?'↓':'↑'}`},{id:'CRM',domain:'OPPORTUNITIES',fragment:`Pipeline ${benchmark.pipeline.current<benchmark.pipeline.previous?'↓':'↑'}`},{id:'EXCEL',domain:'TARGETS',fragment:'Targets'}];
