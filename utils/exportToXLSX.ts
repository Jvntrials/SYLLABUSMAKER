
import type { SyllabusData, ReferenceItem } from '../types';

declare const XLSX: any; // Using SheetJS from CDN

export const exportToXLSX = (data: SyllabusData, subjectTitle: string) => {
  // 1. Create worksheet for PILOs
  const pilosHeader = ["Program Intended Learning Outcomes (PILOs)"];
  const pilosData = data.pilos.map(pilo => [pilo]);
  const pilosWs = XLSX.utils.aoa_to_sheet([pilosHeader, ...pilosData]);

  // 2. Create worksheet for Syllabus
  const syllabusHeader = [
    "Week",
    "Content",
    "Intended Learning Outcomes (ILO)",
    "Assessment Tasks (ATs)",
    "Teaching/Learning Activities (TLAs)",
    "Synchronous Methodology",
    "Asynchronous Methodology",
    "Learning and Teaching Support Materials (LTSM)",
    "Output Materials"
  ];

  const syllabusRows = data.syllabus.map(week => [
    week.week,
    week.content,
    week.ilo,
    week.ats,
    week.tlas,
    week.synchronous,
    week.asynchronous,
    week.ltsm,
    week.outputMaterials
  ]);

  const syllabusWs = XLSX.utils.aoa_to_sheet([syllabusHeader, ...syllabusRows]);
  
  // Auto-fit columns helper function
  const fitToColumn = (ws: any) => {
    const objectMaxLength: any[] = [];
    if (!ws || !ws['!ref']) return;
    const range = XLSX.utils.decode_range(ws['!ref']);
    for(let C = range.s.c; C <= range.e.c; ++C) {
        objectMaxLength[C] = 0;
        for(let R = range.s.r; R <= range.e.r; ++R) {
            const cell_address = {c:C, r:R};
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            if(ws[cell_ref] && ws[cell_ref].v) {
                const len = ws[cell_ref].v.toString().length + 2;
                if(len > objectMaxLength[C]) {
                    objectMaxLength[C] = len;
                }
            }
        }
    }
    ws['!cols'] = objectMaxLength.map(w => ({ width: Math.min(w, 80) })); // Cap width at 80
  };
  
  fitToColumn(pilosWs);
  fitToColumn(syllabusWs);

  // 3. Create worksheet for References
  const referencesHeader = ["Title", "Authors", "Year", "Journal", "URL"];
  const referencesRows = data.references?.map((ref: ReferenceItem) => [
      ref.title,
      ref.authors,
      ref.year,
      ref.journal,
      ref.url
  ]) || [];
  const referencesWs = XLSX.utils.aoa_to_sheet([referencesHeader, ...referencesRows]);
  fitToColumn(referencesWs);


  // 4. Create a new workbook and append the worksheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, pilosWs, "PILOs");
  XLSX.utils.book_append_sheet(wb, syllabusWs, "Weekly Syllabus");
  if(data.references && data.references.length > 0) {
    XLSX.utils.book_append_sheet(wb, referencesWs, "References");
  }

  // 5. Generate a filename and trigger download
  const safeFilename = subjectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  XLSX.writeFile(wb, `Syllabus_${safeFilename || 'export'}.xlsx`);
};