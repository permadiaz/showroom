// Prepared example only: one period, the same five-branch cohort throughout.
export const businessQuestion='WHY DID SALES DECLINE LAST MONTH?';
export const sourceFragments=[
 {id:'ERP',fragment:'Revenue ↓'}, {id:'POS',fragment:'Transactions ↓'},
 {id:'CRM',fragment:'Pipeline ↓'}, {id:'EXCEL',fragment:'Targets'}
];
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
 // Revenue is in illustrative millions; traffic means visits to these same branches.
 evidence:[{label:'SALES',value:'−8.4%'},{label:'TRANSACTIONS',value:'−11%'},{label:'TRAFFIC',value:'+14%'},{label:'CONVERSION',value:'DOWN'}]
};
export const technologySteps=['ERP / POS / CRM / EXCEL','INTEGRATE','BIGQUERY','LOOKER / ANALYTICS','OPTIONAL AI'];
