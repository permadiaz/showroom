export type Visibility = 'PUBLIC' | 'PRESENTATION_ONLY' | 'INTERNAL' | 'CONFIDENTIAL';
export type Mode = 'explore' | 'learn' | 'show' | 'sell';
export type SolutionWorld = 'think' | 'understand' | 'run' | 'build' | 'work' | 'engage' | 'protect' | 'connect';
export interface LearnModule { title: string; simpleExplanation: string; businessValue: string; examples: string[]; commonTerms: string[]; commonQuestions: string[]; }
export interface SalesArsenal { say: string[]; ask: string[]; listenFor: string[]; probe: string[]; proof: string[]; connect: string[]; objections: {objection:string;direction:string}[]; nextMoves:string[]; }
export interface ShowDefinition { slug:string; name:string; world:SolutionWorld; kind:string; number:string; tagline:string; description:string; icon:string; status:'live'|'coming-soon'; visibility:Visibility; }
export interface ProblemDefinition { id:string; label:string; experience:string; visibility:Visibility; entry?:'migration'; destination?:string; }
// Reserved extension contract only. No generator, API, customer data, or UI action.
export interface CustomMagicShowInput { problem:string; industry:string; environment:string; technology:string[]; desiredOutcome:string; proposedSolution:string; }

export interface CloudSimulationState {
 environment: 'ON-PREMISE' | 'HYBRID' | 'OTHER CLOUD' | null;
 scenario: 'TRAFFIC SPIKE' | 'SERVER FAILURE' | 'DATA GROWTH' | 'NEW APPLICATION' | 'BACKUP & RECOVERY' | null;
 pressure: number;
 migration: boolean;
 workload: string;
 stage: number;
 tested: boolean;
 migrated: boolean;
 scaled: boolean;
 recovered: boolean;
 reveal: boolean;
 lesson: number;
 moment: 'normal' | 'trigger' | 'consequence' | 'question' | 'compare' | 'retest' | 'stabilized' | 'takeaway' | 'capabilities' | 'simple';
 running: boolean;
 comparison: boolean;
 resources: number;
 details: boolean;
}

export type WorkspaceScene = 'opening' | 'before' | 'friction' | 'mail' | 'calendar' | 'meet' | 'collaborate' | 'work' | 'gemini' | 'followup' | 'final';
export interface WorkspaceState {
 scene: WorkspaceScene;
 before: number;
 availability: boolean;
 slot: 'Tue 10:30' | 'Wed 14:00' | null;
 team: boolean;
 meetLink: boolean;
 attachment: boolean;
 event: boolean;
 meetingStarted: boolean;
 notes: boolean;
 channel: 'chat' | 'space' | null;
 space: boolean;
 spaceTab: string;
 file: string | null;
 edits: number;
 doc: boolean;
 ai: boolean;
 aiTab: string;
 draft: boolean;
 network: boolean;
 lesson: number;
 calendarTry: string;
 practice: string | null;
 quiz: number;
 answer: 'CHAT' | 'SPACE' | null;
}

/** Reusable, page-session events. No backend or persistent discovery capture. */
export type ShowEventType = 'show_started' | 'question_asked' | 'scenario_triggered' | 'customer_signal_added' | 'pain_identified' | 'current_state_identified' | 'concern_identified' | 'followup_question_selected' | 'technology_revealed' | 'next_step_selected' | 'show_completed' | 'mode_changed' | 'presentation_started' | 'presentation_completed';
export interface ShowEventContext { scope?: string; mode: Mode; step: string; category?: string; value?: unknown; source?: string; }
export interface ShowEvent extends ShowEventContext { id: number; type: ShowEventType; experience: string; /** Compatibility alias; prefer experience. */ showId: string; timestamp: string; payload: Record<string, unknown>; }
export interface ShowSession { emit(type: ShowEventType, experience: string, payload?: Record<string, unknown>, context?: Partial<ShowEventContext>): ShowEvent | null; start(experience: string, context?: Partial<ShowEventContext>): void; reset(experience: string): void; resetScope(experience: string, scope: string): void; subscribe(listener: (event: ShowEvent) => void): () => void; snapshot(): ShowEvent[]; }
export type DataScene = 'opening' | 'question' | 'partial' | 'boundary' | 'fragments' | 'unify' | 'same' | 'answer' | 'follow' | 'ai' | 'technology' | 'final';
export type DataQuestionId = 'sales' | 'products' | 'customers' | 'stores';
export type DataCurrentState = 'separate_systems' | 'centralized_manual_reporting' | 'reporting_ready_ai_interest' | 'not_sure';
export interface DataState {
 scene: DataScene; draft: string; question: string; questionId: DataQuestionId | null; error: string;
 inspected: string[]; issue: string | null; currentState: DataCurrentState | null;
 prepare: number; evidence: number; seenEvidence: number; followup: string | null; depth: number;
 investigated: boolean; ai: boolean; products: boolean; nextStep: 'discovery' | 'assessment' | null;
 lesson: number; distinction: number;
}
