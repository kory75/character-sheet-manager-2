You are the **Code Writer Agent** executing the `implement-export` skill.

## Task
Implement the ExportService and StorageService.

## Steps
1. Read `/docs/design-document.md` section 6 for export and persistence requirements
2. Check if these files already exist before writing:
   - `/src/app/core/export.service.ts`
   - `/src/app/core/storage.service.ts`

## ExportService
Implement three export methods:
- `exportPdf(elementId: string, filename: string)` — uses jsPDF + html2canvas to capture the sheet view element and save as PDF
- `exportJson(character: Character, filename: string)` — serialises character signal state to JSON and triggers browser download
- `importJson(file: File): Promise<Character>` — reads a JSON file and returns parsed character data

Install required packages: `npm install jspdf html2canvas`

## StorageService
Implement a backend-agnostic storage interface backed by localForage (IndexedDB):
- `saveCharacter(character: Character): Promise<void>`
- `loadCharacter(id: string): Promise<Character | null>`
- `listCharacters(): Promise<CharacterSummary[]>`
- `deleteCharacter(id: string): Promise<void>`

Install required package: `npm install localforage`

The interface must be designed so a future Firebase adapter can be swapped in without changing calling code.

## Constraints
- No backend calls — all operations are client-side
- Character ids are generated client-side (use `crypto.randomUUID()`)
- Write unit tests for the JSON import/export logic
