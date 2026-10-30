import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const backendDataDir = path.join(rootDir, 'backend', 'data');

if (!fs.existsSync(backendDataDir)) {
  fs.mkdirSync(backendDataDir, { recursive: true });
}

async function exportAll() {
  const { DRUG_CATALOGUE } = await import('../src/data/drugReferenceCatalogue.js');
  const { INTERACTION_RULES } = await import('../src/data/interactionRules.js');
  const { DUPLICATE_THERAPY_RULES } = await import('../src/data/duplicateTherapyRules.js');
  const { RENAL_RULES } = await import('../src/data/renalRules.js');
  const { CONTRAINDICATION_RULES } = await import('../src/data/contraindicationRules.js');
  const { BRAND_TO_GENERIC, COMMON_MISSPELLINGS, SAMPLE_SEARCH_PRESETS } = await import('../src/data/aliasMap.js');
  const { SYNTHETIC_PATIENTS } = await import('../src/data/syntheticPatients.js');
  const { DEMO_CASES } = await import('../src/data/demoCases.js');

  fs.writeFileSync(path.join(backendDataDir, 'drug_catalogue.json'), JSON.stringify(DRUG_CATALOGUE, null, 2));
  fs.writeFileSync(path.join(backendDataDir, 'interaction_rules.json'), JSON.stringify(INTERACTION_RULES, null, 2));
  fs.writeFileSync(path.join(backendDataDir, 'duplicate_rules.json'), JSON.stringify(DUPLICATE_THERAPY_RULES, null, 2));
  fs.writeFileSync(path.join(backendDataDir, 'renal_rules.json'), JSON.stringify(RENAL_RULES, null, 2));
  fs.writeFileSync(path.join(backendDataDir, 'contraindications.json'), JSON.stringify(CONTRAINDICATION_RULES, null, 2));
  fs.writeFileSync(path.join(backendDataDir, 'alias_map.json'), JSON.stringify({
    brand_to_generic: BRAND_TO_GENERIC,
    common_misspellings: COMMON_MISSPELLINGS,
    sample_presets: SAMPLE_SEARCH_PRESETS
  }, null, 2));
  fs.writeFileSync(path.join(backendDataDir, 'synthetic_patients.json'), JSON.stringify(SYNTHETIC_PATIENTS, null, 2));
  fs.writeFileSync(path.join(backendDataDir, 'demo_cases.json'), JSON.stringify(DEMO_CASES, null, 2));

  console.log("Successfully exported all reference datasets to backend/data/");
}

exportAll().catch(err => {
  console.error(err);
  process.exit(1);
});
