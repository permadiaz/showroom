export const migrationCopy={
 opening:['CURRENT WORKLOAD','This workload is already running the business.','Moving it starts with understanding what it depends on.'],
 discover:['DISCOVER','The workload is more than the server.','Follow the relationships that need to move with it—or remain connected.'],
 assess:['ASSESS','Define the conditions for moving it.','These are questions to establish, not assumed customer requirements.'],
 design:['DESIGN','The destination follows the requirements.','Form a possible target, one workload requirement at a time.'],
 replicate:['REPLICATE','Prepare the target. Production stays here.','Illustrative replication; the approach varies by workload.'],
 test:['TEST','Test the destination before asking the business to trust it.','Test traffic has its own path. Production still reaches the source.'],
 rehearsal:['HOLD / BOTH ENVIRONMENTS','Now there are two questions.',''],
 cutover:['CUTOVER','The workload stays recognizable. The active path changes.','A planned transition, not an instant or risk-free move.'],
 verify:['VERIFY','The move is not complete until the workload is verified.','Confirm the relationships at the target before treating the transition as complete.'],
 optimize:['OPTIMIZE','Migration gets it there. Optimization improves how it runs there.','Consider capacity, cost, performance, operations and security against actual requirements.'],
 final:['REVEAL',"The destination wasn't the first step.",'']
};
export const migrationDependencies=[['IDENTITY','Application → identity'],['FILE STORAGE','Application → files'],['BACKUP','Database → backup'],['EXTERNAL API','Application → external integration']];
export const migrationConstraints=[['BUSINESS CRITICALITY','What depends on this application?'],['DATA / COMPATIBILITY','How large is the data layer; what must it support?'],['NETWORK REQUIREMENTS','Which integrations must remain reachable?'],['MAINTENANCE WINDOW','When could a transition be attempted?'],['DOWNTIME TOLERANCE','What interruption could the business accept?']];
export const migrationGuides={
 opening:['What workload are you considering moving, and where does it run today?','Migration project · Data center refresh · Hardware lifecycle · SAP modernization','Who owns the application and who approves a change?'],
 discover:['What does this workload depend on outside its own servers?','External integrations · Identity · Network boundaries · Unknown ownership','Which team owns each dependency?'],
 assess:['What happens to the business if this workload becomes unavailable?','Downtime tolerance · Business hours · Maintenance window · Regulatory constraints','How critical and large is the data layer, and is there a target timeline?'],
 design:['What would the target need to preserve for the business?','Cloud mandate · Vendor comparison · Capacity issue · Security requirements','Which requirements need architecture validation rather than an assumption?'],
 replicate:['What changes while the source is still operating?','Transaction activity · Data consistency · Replication limits','What approach could keep target state usable for testing?'],
 test:['What evidence would make the target credible to the workload owner?','POC request · Application testing · Dependencies · Recovery concerns','Who signs off the test, and what conditions would fail it?'],
 rehearsal:['If this workload had to move, what would make the transition unacceptable for the business?','Downtime · Transaction interruption · Data loss · Rollback concern · Dependency failure','Who can approve the maintenance window and the stop/go decision?'],
 cutover:['What would trigger a stop or reconsideration during cutover?','Rollback concern · Business hours · Deadline · Ownership','How would the team decide whether to continue or use a prepared recovery approach?'],
 verify:['What must be checked before the business accepts the target?','Missing transactions · Data consistency · Reachability · Operational visibility','Who verifies application, data and business flows after the transition?'],
 optimize:['What would you want to improve after the migration?','Cost pressure · Capacity · Operational load · Disaster recovery concern','What baseline and measurements would support that decision?'],
 final:['Is the next useful conversation an assessment or an architecture workshop?','Assessment · Testing · Active migration project · Timeline','Bring the workload owner and presales; agree the questions to resolve.']
};
