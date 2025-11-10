import { seedCategories } from './seeds/system-categories';

async function runAllSeeds() {
  try {
    await Promise.all([seedCategories()]);
    console.log('✅ Tutti i seed sono stati eseguiti con successo.');
  } catch (error) {
    console.error("❌ Errore durante l'esecuzione dei seed:", error);
  }
}

if (require.main === module) {
  runAllSeeds().catch(console.error);
}
