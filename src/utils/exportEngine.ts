import {
  AIAuditTrailRecord,
  Athlete,
  HierarchyContext,
  Injury,
  NutritionPlan,
  TestResult,
  TrainingSession,
  UserRole,
} from '../types/usi';

let lastExplicitDownloadTimestamp = 0;

export function markExplicitDownload() {
  lastExplicitDownloadTimestamp = Date.now();
}

export function wasRecentlyDownloaded(windowMs = 900): boolean {
  return Date.now() - lastExplicitDownloadTimestamp < windowMs;
}

export function sanitizeFilename(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  markExplicitDownload();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 600);
}

/**
 * 1. CSV Exporter (UTF-8 with BOM for Excel compatibility)
 */
export function exportToCSV(
  filenameBase: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
  metadataLines?: string[]
): string {
  const cleanName = filenameBase.endsWith('.csv')
    ? filenameBase
    : `${sanitizeFilename(filenameBase)}.csv`;

  const escapeCsvCell = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines: string[] = [];
  if (metadataLines && metadataLines.length > 0) {
    metadataLines.forEach((meta) => {
      lines.push(escapeCsvCell(meta));
    });
    lines.push('');
  }

  lines.push(headers.map(escapeCsvCell).join(','));
  rows.forEach((row) => {
    lines.push(row.map(escapeCsvCell).join(','));
  });

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBlobDownload(blob, cleanName);
  return cleanName;
}

/**
 * 2. Excel (.xls) Exporter (Styled HTML Table Workbook for Excel / Numbers / Sheets)
 */
export function exportToExcel(
  filenameBase: string,
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
  summaryPairs?: { label: string; value: string }[]
): string {
  const cleanName =
    filenameBase.endsWith('.xls') || filenameBase.endsWith('.xlsx')
      ? filenameBase.replace(/\.xlsx$/, '.xls')
      : `${sanitizeFilename(filenameBase)}.xls`;

  const escapeHtml = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  const summaryHtml =
    summaryPairs && summaryPairs.length > 0
      ? `
    <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse; margin-bottom:16px; font-family:Arial, sans-serif; font-size:11px;">
      <tr style="background:#0F172A; color:#38BDF8; font-weight:bold;">
        <td colspan="2">EXECUTIVE SUMMARY &amp; TELEMETRY CONTEXT</td>
      </tr>
      ${summaryPairs
        .map(
          (p) => `
        <tr>
          <td style="background:#F1F5F9; font-weight:bold; color:#1E293B; width:220px;">${escapeHtml(p.label)}</td>
          <td style="color:#0F172A;">${escapeHtml(p.value)}</td>
        </tr>`
        )
        .join('')}
    </table>`
      : '';

  const htmlDocument = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>USI Operational Export</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body style="font-family:Arial, sans-serif; font-size:12px;">
        <div style="background:#090D16; color:#F8FAFC; padding:14px; margin-bottom:12px;">
          <div style="font-size:10px; color:#38BDF8; letter-spacing:1px; text-transform:uppercase;">UNIFIED SPORTS INTERFACE (USI) · OFFICIAL DATA EXPORT</div>
          <div style="font-size:18px; font-weight:bold; margin-top:4px;">${escapeHtml(title)}</div>
          <div style="font-size:12px; color:#94A3B8; margin-top:2px;">${escapeHtml(subtitle)}</div>
        </div>
        ${summaryHtml}
        <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse; width:100%; font-family:Arial, sans-serif; font-size:11px;">
          <thead>
            <tr style="background:#0F172A; color:#F8FAFC; font-weight:bold;">
              ${headers.map((h) => `<th style="padding:8px; text-align:left; border:1px solid #334155;">${escapeHtml(h)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row, rIdx) => `
              <tr style="background:${rIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
                ${row.map((cell) => `<td style="padding:6px 8px; border:1px solid #CBD5E1; color:#0F172A;">${escapeHtml(cell)}</td>`).join('')}
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF', htmlDocument], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  triggerBlobDownload(blob, cleanName);
  return cleanName;
}

/**
 * 3. JSON Exporter
 */
export function exportToJSON(filenameBase: string, payload: unknown): string {
  const cleanName = filenameBase.endsWith('.json')
    ? filenameBase
    : `${sanitizeFilename(filenameBase)}.json`;
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  triggerBlobDownload(blob, cleanName);
  return cleanName;
}

/**
 * 4. Native Standards-Compliant PDF 1.4 Generator (Zero external dependencies, multi-page support)
 */
export interface PDFReportSection {
  heading: string;
  lines: string[];
}

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  metadataPairs?: { label: string; value: string }[];
  sections?: PDFReportSection[];
  tableHeaders?: string[];
  tableRows?: (string | number | boolean | null | undefined)[][];
  footerNote?: string;
}

function sanitizePdfText(input: string): string {
  return input
    .replace(/✓/g, '[OK]')
    .replace(/✗/g, '[X]')
    .replace(/⚠/g, '[!]')
    .replace(/▲/g, '^')
    .replace(/▼/g, 'v')
    .replace(/●|•|·/g, '-')
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/—|–/g, '-')
    .replace(/“|”/g, '"')
    .replace(/‘|’/g, "'")
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapTextLines(text: string, maxChars: number): string[] {
  const cleaned = text.replace(/\r?\n/g, ' ').trim();
  if (!cleaned) return [''];
  const words = cleaned.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if (!current) {
      current = w;
    } else if (current.length + 1 + w.length <= maxChars) {
      current += ' ' + w;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function exportToPDF(
  filenameBase: string,
  options: PDFExportOptions
): string {
  const cleanName = filenameBase.endsWith('.pdf')
    ? filenameBase
    : `${sanitizeFilename(filenameBase)}.pdf`;

  const pagesCommands: string[][] = [];
  let currentCommands: string[] = [];
  let y = 750;

  const startNewPage = (pageNum: number) => {
    if (currentCommands.length > 0) {
      pagesCommands.push(currentCommands);
    }
    currentCommands = [];
    // Dark top header banner
    currentCommands.push('0.05 0.08 0.14 rg');
    currentCommands.push('36 756 540 54 re f');
    // Accent sky bar
    currentCommands.push('0.05 0.65 0.91 rg');
    currentCommands.push('36 754 540 2 re f');

    // Header text
    currentCommands.push('BT');
    currentCommands.push('/F2 8 Tf');
    currentCommands.push('0.22 0.74 0.97 rg');
    currentCommands.push('48 794 Td');
    currentCommands.push(
      `(${sanitizePdfText('UNIFIED SPORTS INTERFACE (USI) - NATIONAL ATHLETE MANAGEMENT SYSTEM')}) Tj`
    );
    currentCommands.push('ET');

    currentCommands.push('BT');
    currentCommands.push('/F2 13 Tf');
    currentCommands.push('1 1 1 rg');
    currentCommands.push('48 776 Td');
    currentCommands.push(`(${sanitizePdfText(options.title.slice(0, 72))}) Tj`);
    currentCommands.push('ET');

    if (options.subtitle) {
      currentCommands.push('BT');
      currentCommands.push('/F1 8.5 Tf');
      currentCommands.push('0.75 0.82 0.90 rg');
      currentCommands.push('48 763 Td');
      currentCommands.push(`(${sanitizePdfText(options.subtitle.slice(0, 95))}) Tj`);
      currentCommands.push('ET');
    }

    // Footer
    currentCommands.push('0.82 0.86 0.90 RG');
    currentCommands.push('0.5 w');
    currentCommands.push('36 44 m 576 44 l S');

    const footerStr =
      options.footerNote ||
      'USI Official Governance & Telemetry Dossier - Non-Diagnostic Decision Support - Confidential';
    currentCommands.push('BT');
    currentCommands.push('/F1 7.5 Tf');
    currentCommands.push('0.40 0.45 0.52 rg');
    currentCommands.push('36 32 Td');
    currentCommands.push(
      `(${sanitizePdfText(`${footerStr} | Page ${pageNum}`)}) Tj`
    );
    currentCommands.push('ET');

    y = 734;
  };

  let pageCounter = 1;
  startNewPage(pageCounter);

  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < 58) {
      pageCounter += 1;
      startNewPage(pageCounter);
    }
  };

  // 1. Metadata Pairs Box
  if (options.metadataPairs && options.metadataPairs.length > 0) {
    const rowsCount = Math.ceil(options.metadataPairs.length / 2);
    const boxHeight = rowsCount * 16 + 14;
    ensureSpace(boxHeight + 10);

    currentCommands.push('0.95 0.97 0.99 rg');
    currentCommands.push(`36 ${y - boxHeight} 540 ${boxHeight} re f`);
    currentCommands.push('0.82 0.87 0.93 RG');
    currentCommands.push('0.6 w');
    currentCommands.push(`36 ${y - boxHeight} 540 ${boxHeight} re S`);

    let metaY = y - 14;
    for (let i = 0; i < options.metadataPairs.length; i += 2) {
      const left = options.metadataPairs[i];
      const right = options.metadataPairs[i + 1];

      currentCommands.push('BT');
      currentCommands.push('/F2 8.5 Tf');
      currentCommands.push('0.12 0.18 0.28 rg');
      currentCommands.push(`46 ${metaY} Td`);
      currentCommands.push(`(${sanitizePdfText(left.label + ':')}) Tj`);
      currentCommands.push('/F1 8.5 Tf');
      currentCommands.push('0.08 0.12 0.20 rg');
      currentCommands.push(`105 0 Td`);
      currentCommands.push(`(${sanitizePdfText(left.value.slice(0, 34))}) Tj`);
      currentCommands.push('ET');

      if (right) {
        currentCommands.push('BT');
        currentCommands.push('/F2 8.5 Tf');
        currentCommands.push('0.12 0.18 0.28 rg');
        currentCommands.push(`310 ${metaY} Td`);
        currentCommands.push(`(${sanitizePdfText(right.label + ':')}) Tj`);
        currentCommands.push('/F1 8.5 Tf');
        currentCommands.push('0.08 0.12 0.20 rg');
        currentCommands.push(`105 0 Td`);
        currentCommands.push(`(${sanitizePdfText(right.value.slice(0, 34))}) Tj`);
        currentCommands.push('ET');
      }

      metaY -= 15;
    }

    y -= boxHeight + 14;
  }

  // 2. Narrative / Key Sections
  if (options.sections && options.sections.length > 0) {
    for (const sec of options.sections) {
      ensureSpace(34);
      // Section header bar
      currentCommands.push('0.91 0.95 0.99 rg');
      currentCommands.push(`36 ${y - 16} 540 18 re f`);
      currentCommands.push('BT');
      currentCommands.push('/F2 9.5 Tf');
      currentCommands.push('0.05 0.28 0.52 rg');
      currentCommands.push(`42 ${y - 11} Td`);
      currentCommands.push(`(${sanitizePdfText(sec.heading.toUpperCase())}) Tj`);
      currentCommands.push('ET');
      y -= 28;

      for (const rawLine of sec.lines) {
        const wrapped = wrapTextLines(rawLine, 92);
        for (const wLine of wrapped) {
          ensureSpace(14);
          currentCommands.push('BT');
          currentCommands.push('/F1 8.5 Tf');
          currentCommands.push('0.12 0.16 0.23 rg');
          currentCommands.push(`42 ${y} Td`);
          currentCommands.push(`(${sanitizePdfText(wLine)}) Tj`);
          currentCommands.push('ET');
          y -= 13;
        }
      }
      y -= 6;
    }
  }

  // 3. Structured Table
  if (
    options.tableHeaders &&
    options.tableHeaders.length > 0 &&
    options.tableRows &&
    options.tableRows.length > 0
  ) {
    ensureSpace(40);
    const cols = options.tableHeaders.length;
    const tableWidth = 540;
    const colWidth = Math.floor(tableWidth / cols);
    const maxCharsPerCol = Math.max(8, Math.floor(colWidth / 4.7) - 2);

    const drawTableHeader = () => {
      currentCommands.push('0.08 0.13 0.22 rg');
      currentCommands.push(`36 ${y - 18} 540 20 re f`);
      options.tableHeaders!.forEach((h, cIdx) => {
        const x = 40 + cIdx * colWidth;
        currentCommands.push('BT');
        currentCommands.push('/F2 8 Tf');
        currentCommands.push('0.96 0.98 1.0 rg');
        currentCommands.push(`${x} ${y - 11} Td`);
        currentCommands.push(
          `(${sanitizePdfText(String(h).slice(0, maxCharsPerCol))}) Tj`
        );
        currentCommands.push('ET');
      });
      y -= 20;
    };

    drawTableHeader();

    options.tableRows.forEach((row, rIdx) => {
      if (y - 18 < 58) {
        pageCounter += 1;
        startNewPage(pageCounter);
        drawTableHeader();
      }

      if (rIdx % 2 === 1) {
        currentCommands.push('0.96 0.98 0.99 rg');
        currentCommands.push(`36 ${y - 16} 540 16 re f`);
      }

      // Row bottom line
      currentCommands.push('0.88 0.91 0.95 RG');
      currentCommands.push('0.4 w');
      currentCommands.push(`36 ${y - 16} m 576 ${y - 16} l S`);

      row.slice(0, cols).forEach((cell, cIdx) => {
        const x = 40 + cIdx * colWidth;
        const text = cell === null || cell === undefined ? '-' : String(cell);
        currentCommands.push('BT');
        currentCommands.push('/F1 7.8 Tf');
        currentCommands.push('0.10 0.15 0.24 rg');
        currentCommands.push(`${x} ${y - 11} Td`);
        currentCommands.push(
          `(${sanitizePdfText(text.slice(0, maxCharsPerCol))}) Tj`
        );
        currentCommands.push('ET');
      });

      y -= 16;
    });
  }

  if (currentCommands.length > 0) {
    pagesCommands.push(currentCommands);
  }

  // Assemble valid PDF 1.4 object graph
  const objects: string[] = [];
  // Obj 1: Catalog
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  // Obj 2: Pages placeholder (will fill kids)
  objects.push('');
  // Obj 3: Font F1 (Helvetica)
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  // Obj 4: Font F2 (Helvetica-Bold)
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  const pageObjNumbers: number[] = [];

  pagesCommands.forEach((cmds) => {
    const streamData = cmds.join('\n');
    const contentObjNum = objects.length + 1;
    objects.push(
      `<< /Length ${streamData.length} >>\nstream\n${streamData}\nendstream`
    );

    const pageObjNum = objects.length + 1;
    pageObjNumbers.push(pageObjNum);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjNum} 0 R >>`
    );
  });

  // Fill Obj 2 (Pages)
  objects[1] = `<< /Type /Pages /Kids [${pageObjNumbers.map((n) => `${n} 0 R`).join(' ')}] /Count ${pageObjNumbers.length} >>`;

  // Serialize with accurate byte offsets
  let pdfOut = '%PDF-1.4\n';
  const offsets: number[] = [0];

  objects.forEach((body, idx) => {
    offsets.push(pdfOut.length);
    const objNum = idx + 1;
    pdfOut += `${objNum} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = pdfOut.length;
  pdfOut += `xref\n0 ${objects.length + 1}\n`;
  pdfOut += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    const offStr = String(offsets[i]).padStart(10, '0');
    pdfOut += `${offStr} 00000 n \n`;
  }

  pdfOut += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdfOut], { type: 'application/pdf' });
  triggerBlobDownload(blob, cleanName);
  return cleanName;
}

/**
 * 5. High-Level Domain Export Builders for Any Module in USI
 */
export function exportAthletesRoster(
  format: 'PDF' | 'CSV' | 'Excel',
  athletes: Athlete[],
  role: UserRole,
  scopeTitle = 'National Athlete Registry & Telemetry Roster'
): string {
  const headers = [
    'Athlete ID',
    'Name',
    'Sport',
    'Position',
    'Squad',
    'Readiness',
    'Injury Risk',
    'ACWR',
    'HRV (ms)',
    'Sleep',
    'Medical Status',
    'Training Status',
    'Coach',
  ];

  const rows = athletes.map((a) => [
    a.athleteId,
    a.name,
    a.sport,
    a.position,
    a.squad,
    `${a.readiness}%`,
    a.injuryRisk,
    a.acwr.toFixed(2),
    `${a.hrvMs} ms`,
    a.sleepFormatted,
    a.medicalStatus,
    a.trainingStatus,
    a.coach,
  ]);

  const summaryPairs = [
    { label: 'Exported By Role', value: role },
    { label: 'Total Athletes', value: `${athletes.length} Monitored Profiles` },
    {
      label: 'Mean Squad Readiness',
      value: `${
        athletes.length
          ? Math.round(athletes.reduce((s, a) => s + a.readiness, 0) / athletes.length)
          : 0
      }%`,
    },
    {
      label: 'High Risk Profiles',
      value: `${athletes.filter((a) => a.injuryRisk === 'High').length} Athletes`,
    },
    { label: 'Generated Date', value: '28 Sep 2026' },
    { label: 'Governance Status', value: 'Verified Telemetry Snapshot' },
  ];

  if (format === 'CSV') {
    return exportToCSV('usi_athlete_registry_export', headers, rows, [
      `USI ${scopeTitle} — Exported by ${role}`,
    ]);
  }
  if (format === 'Excel') {
    return exportToExcel(
      'usi_athlete_registry_export',
      scopeTitle,
      `Exported by ${role} · ${athletes.length} Athletes`,
      headers,
      rows,
      summaryPairs
    );
  }
  return exportToPDF('usi_athlete_registry_dossier', {
    title: scopeTitle,
    subtitle: `Multi-Signal Readiness, ACWR, Autonomic HRV & Clearance Dossier (${athletes.length} Athletes)`,
    metadataPairs: summaryPairs,
    sections: [
      {
        heading: 'Executive Telemetry Highlights',
        lines: athletes.slice(0, 5).map(
          (a) =>
            `${a.name} (${a.athleteId} - ${a.position}): Readiness ${a.readiness}%, ACWR ${a.acwr.toFixed(2)}, HRV ${a.hrvMs}ms, Medical ${a.medicalStatus}. ${a.aiSummary}`
        ),
      },
    ],
    tableHeaders: [
      'ID',
      'Athlete',
      'Position',
      'Readiness',
      'Risk',
      'ACWR',
      'HRV',
      'Medical',
      'Status',
    ],
    tableRows: athletes.map((a) => [
      a.athleteId,
      a.name,
      a.position,
      `${a.readiness}%`,
      a.injuryRisk,
      a.acwr.toFixed(2),
      `${a.hrvMs}ms`,
      a.medicalStatus,
      a.trainingStatus,
    ]),
  });
}

export function exportSingleAthlete360Dossier(
  format: 'PDF' | 'CSV',
  athlete: Athlete,
  injuries: Injury[],
  role: UserRole
): string {
  const athInjuries = injuries.filter((i) => i.athleteId === athlete.id);
  if (format === 'CSV') {
    const headers = [
      'Field',
      'Metric / Value',
      'Context / Baseline',
      'Status',
    ];
    const rows = [
      ['Athlete Name', athlete.name, athlete.athleteId, athlete.trainingStatus],
      ['Sport & Squad', `${athlete.sport} - ${athlete.squad}`, athlete.position, `Jersey #${athlete.jerseyNumber}`],
      ['Readiness Score', `${athlete.readiness}%`, `Delta ${athlete.readinessDelta}%`, athlete.status],
      ['Injury Risk', athlete.injuryRisk, athlete.riskSignals.join(' | '), athlete.medicalStatus],
      ['Workload (Acute / Chronic)', `${athlete.acuteLoadAu} AU / ${athlete.chronicLoadAu} AU`, `ACWR ${athlete.acwr.toFixed(2)}`, athlete.trainingLoad],
      ['Autonomic HRV rMSSD', `${athlete.hrvMs} ms`, `Baseline ${athlete.hrvBaselineMs} ms`, `${athlete.recovery}% Recovery`],
      ['Sleep & Wellness', athlete.sleepFormatted, `Wellness ${athlete.wellnessScore}/10`, `Soreness ${athlete.sorenessScore}/10`],
      ['Performance Composite', `${athlete.performanceScore}/100`, `30m: ${athlete.performanceMetrics.sprint30m.current} | CMJ: ${athlete.performanceMetrics.cmj.current}`, `Yo-Yo: ${athlete.performanceMetrics.yoYo.current}`],
      ['Assigned Coach', athlete.coach, athlete.coachRole, `Profile ${athlete.profileCompletion}% Complete`],
    ];
    return exportToCSV(`athlete_360_${athlete.name}`, headers, rows, [
      `USI Athlete 360 Official Dossier — ${athlete.name} (${athlete.athleteId})`,
    ]);
  }

  return exportToPDF(`athlete_360_${athlete.name}_dossier`, {
    title: `ATHLETE 360 DOSSIER: ${athlete.name.toUpperCase()}`,
    subtitle: `${athlete.athleteId} | ${athlete.sport} | ${athlete.squad} | ${athlete.position} (#${athlete.jerseyNumber})`,
    metadataPairs: [
      { label: 'Readiness Score', value: `${athlete.readiness}/100 (${athlete.readinessDelta}%)` },
      { label: 'Injury Risk Tier', value: `${athlete.injuryRisk} Risk` },
      { label: 'Workload & ACWR', value: `${athlete.acuteLoadAu} AU (ACWR ${athlete.acwr.toFixed(2)})` },
      { label: 'HRV & Sleep', value: `${athlete.hrvMs} ms (Base ${athlete.hrvBaselineMs}) | ${athlete.sleepFormatted}` },
      { label: 'Medical Clearance', value: `${athlete.medicalStatus} (${athlete.trainingStatus})` },
      { label: 'Lead Coach & Role', value: `${athlete.coach} (Exported by ${role})` },
    ],
    sections: [
      {
        heading: 'AI Operational Summary & Physiological Synthesis',
        lines: [
          athlete.aiSummary,
          `Performance Insight: ${athlete.aiPerformanceInsight}`,
          `Detected Risk Signals: ${athlete.riskSignals.join('; ')}`,
        ],
      },
      {
        heading: 'Clinical & Rehabilitation Status',
        lines:
          athInjuries.length > 0
            ? athInjuries.map(
                (inj) =>
                  `Active Case: ${inj.diagnosis} (${inj.bodyRegionDisplay}) - Stage ${inj.rtpStage}/5 (${inj.rtpStageName}), Progress ${inj.rehabProgressPct}%, Pain ${inj.painScore}/10. Restriction: ${inj.restrictions}`
              )
            : [
                `Medical Note: ${athlete.medicalNote}`,
                `Prior History: ${athlete.previousInjuryHistory}`,
              ],
      },
      {
        heading: 'Performance Assessment Benchmarks',
        lines: [
          `Composite Performance Score: ${athlete.performanceScore}/100`,
          `30m Sprint: ${athlete.performanceMetrics.sprint30m.current} (Squad Avg ${athlete.performanceMetrics.sprint30m.squadAvg}, PB ${athlete.performanceMetrics.sprint30m.personalBest})`,
          `Countermovement Jump (CMJ): ${athlete.performanceMetrics.cmj.current} (Squad Avg ${athlete.performanceMetrics.cmj.squadAvg}, PB ${athlete.performanceMetrics.cmj.personalBest})`,
          `Yo-Yo Intermittent Recovery: ${athlete.performanceMetrics.yoYo.current} (Squad Avg ${athlete.performanceMetrics.yoYo.squadAvg}, PB ${athlete.performanceMetrics.yoYo.personalBest})`,
          `Strength Index: ${athlete.performanceMetrics.strength.current} (Squad Avg ${athlete.performanceMetrics.strength.squadAvg}, PB ${athlete.performanceMetrics.strength.personalBest})`,
        ],
      },
    ],
    tableHeaders: ['Document Name', 'Category', 'Status', 'Expiry', 'File Size'],
    tableRows: athlete.documents.map((d) => [
      d.name,
      d.category,
      d.status,
      d.expiry,
      d.fileSize,
    ]),
  });
}

export function exportAuditTrailReport(
  format: 'PDF' | 'CSV',
  auditTrail: AIAuditTrailRecord[],
  role: UserRole
): string {
  const headers = [
    'Audit ID',
    'Timestamp',
    'Safety Class',
    'Query / Trigger',
    'AI Advisory Recommendation',
    'Reviewed By',
    'Decision',
    'Action Taken',
  ];
  const rows = auditTrail.map((e) => [
    e.id,
    e.timestamp,
    e.safetyClass,
    e.query,
    e.recommendation,
    `${e.reviewedBy} (${e.reviewerRole})`,
    e.decision,
    e.actionTaken,
  ]);

  if (format === 'CSV') {
    return exportToCSV('usi_ai_governance_audit_trail', headers, rows, [
      `USI AI Governance & Explainability Audit Log — Exported by ${role}`,
    ]);
  }

  return exportToPDF('usi_ai_governance_audit_trail', {
    title: 'AI GOVERNANCE & EXPLAINABILITY AUDIT LOG',
    subtitle: `Institutional Decision Support Traceability | Exported by ${role} | ${auditTrail.length} Logged Decisions`,
    metadataPairs: [
      { label: 'Total Logged Queries', value: `${auditTrail.length} Entries` },
      { label: 'Exporting Authority', value: role },
      { label: 'Safety Enforcement', value: 'Human-in-the-Loop Sign-off Active' },
      { label: 'Audit Timestamp', value: '28 Sep 2026' },
    ],
    sections: [
      {
        heading: 'Recent Consequential & Advisory Decisions',
        lines: auditTrail.slice(0, 6).map(
          (e) =>
            `[${e.timestamp}] (${e.safetyClass}) Query: "${e.query}" -> Decision: ${e.decision} by ${e.reviewedBy} (${e.actionTaken})`
        ),
      },
    ],
    tableHeaders: ['Time', 'Class', 'Query / Trigger', 'Reviewer', 'Decision', 'Action Taken'],
    tableRows: auditTrail.map((e) => [
      e.timestamp,
      e.safetyClass,
      e.query,
      e.reviewerRole,
      e.decision,
      e.actionTaken,
    ]),
  });
}

/**
 * 6. Universal Fallback Export Interceptor for any toast mentioning Export or Download
 */
export function triggerFallbackExportForToast(
  toastMessage: string,
  state: {
    role: UserRole;
    context: HierarchyContext;
    activeAthlete: Athlete;
    athletes: Athlete[];
    injuries: Injury[];
    sessions: TrainingSession[];
    nutritionPlans: NutritionPlan[];
    testResults: TestResult[];
    aiAuditTrail: AIAuditTrailRecord[];
  }
): void {
  if (wasRecentlyDownloaded(1000)) {
    return;
  }

  const lower = toastMessage.toLowerCase();
  const isExportOrDownload =
    lower.includes('export') ||
    lower.includes('download') ||
    lower.includes('generated & downloaded') ||
    lower.includes('generating');

  if (!isExportOrDownload) return;

  if (lower.includes('.csv') || lower.includes('(csv)') || lower.includes('csv')) {
    exportAthletesRoster('CSV', state.athletes, state.role, `${state.context.squad} Telemetry Export`);
    return;
  }

  if (lower.includes('.xlsx') || lower.includes('.xls') || lower.includes('excel')) {
    exportAthletesRoster('Excel', state.athletes, state.role, `${state.context.squad} Workbook Export`);
    return;
  }

  if (lower.includes('manifest') || lower.includes('flight') || lower.includes('travel')) {
    exportToPDF('usi_official_travel_manifest', {
      title: 'OFFICIAL INTERNATIONAL TRAVEL & FLIGHT MANIFEST',
      subtitle: `${state.context.federation} | ${state.context.sport} | ${state.context.squad}`,
      metadataPairs: [
        { label: 'Tour / Camp', value: 'Asian Qualifiers & High-Altitude Camp' },
        { label: 'Exported By', value: state.role },
        { label: 'Total Delegation', value: `${state.athletes.length} Athletes + Technical Staff` },
        { label: 'Clearance Status', value: 'Ministry & WADA Verified' },
      ],
      tableHeaders: ['Athlete ID', 'Full Name', 'Position', 'Medical Status', 'Passport / Docs'],
      tableRows: state.athletes.map((a) => [
        a.athleteId,
        a.name,
        a.position,
        a.medicalStatus,
        `${a.documents.length} Verified Docs`,
      ]),
    });
    return;
  }

  if (lower.includes('wada') || lower.includes('anti-doping') || lower.includes('governance') || lower.includes('pathway')) {
    exportToPDF('usi_governance_compliance_certificate', {
      title: 'OFFICIAL GOVERNANCE, WADA & PATHWAY COMPLIANCE DOSSIER',
      subtitle: `${state.context.federation} | Active Authority: ${state.role}`,
      metadataPairs: [
        { label: 'Federation', value: state.context.federation },
        { label: 'Program / Squad', value: `${state.context.program} (${state.context.squad})` },
        { label: 'WADA RTP Status', value: '100% Compliant - Zero Strikes' },
        { label: 'Sign-off Authority', value: state.role },
      ],
      sections: [
        {
          heading: 'Certification Summary',
          lines: [
            toastMessage,
            'All registered athletes and support personnel have satisfied institutional verification, Informed-Sport batch screening, and WADA ADAMS whereabouts compliance.',
          ],
        },
      ],
      tableHeaders: ['Athlete ID', 'Athlete', 'Squad', 'Verification', 'Medical', 'Readiness'],
      tableRows: state.athletes.map((a) => [
        a.athleteId,
        a.name,
        a.squad,
        a.verificationStatus,
        a.medicalStatus,
        `${a.readiness}%`,
      ]),
    });
    return;
  }

  // Default to a rich PDF document matching the toast message
  exportToPDF('usi_operational_document', {
    title: toastMessage.replace(/^(Exporting|Downloaded|Exported)\s+/i, '').slice(0, 68) || 'USI OPERATIONAL REPORT',
    subtitle: `${state.context.federation} | ${state.context.sport} | ${state.context.squad} | Role: ${state.role}`,
    metadataPairs: [
      { label: 'Focus Athlete', value: `${state.activeAthlete.name} (${state.activeAthlete.athleteId})` },
      { label: 'Active Squad', value: state.context.squad },
      { label: 'Exported By', value: state.role },
      { label: 'Timestamp', value: '28 Sep 2026' },
    ],
    sections: [
      {
        heading: 'Document & Telemetry Summary',
        lines: [
          `Action: ${toastMessage}`,
          `Focus Athlete Summary: ${state.activeAthlete.aiSummary}`,
        ],
      },
    ],
    tableHeaders: ['Athlete ID', 'Name', 'Position', 'Readiness', 'ACWR', 'Medical Status'],
    tableRows: state.athletes.map((a) => [
      a.athleteId,
      a.name,
      a.position,
      `${a.readiness}%`,
      a.acwr.toFixed(2),
      a.medicalStatus,
    ]),
  });
}
