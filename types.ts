
export interface ReferenceItem {
  title: string;
  authors: string;
  year: number;
  journal: string;
  url: string;
}

export interface SyllabusWeek {
  week: number;
  content: string;
  ilo: string; // Intended Learning Outcomes
  ats: string; // Assessment Tasks
  tlas: string; // Teaching/Learning Activities
  synchronous: string; // Synchronous activities
  asynchronous: string; // Asynchronous activities
  ltsm: string; // Learning and Teaching Support Materials
  outputMaterials: string;
}

export interface SyllabusData {
  pilos: string[]; // Program Intended Learning Outcomes
  syllabus: SyllabusWeek[];
  references: ReferenceItem[];
}

export interface ParsedSyllabusResponse extends SyllabusData {
    subjectTitle: string;
    courseDescription: string;
    numWeeks: number;
}
