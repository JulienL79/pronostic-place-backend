import cron from 'node-cron'
import { dataValidation } from './tasks/dataValidation.js';

// Fonction à exécuter
const myDailyTask = async () => {
    await dataValidation('euromillions')
    await dataValidation('loto')
};

// Planification de la tâche : '0 0 * * *' correspond à tous les jours à minuit
cron.schedule('0 10 * * *', () => {
    const today = new Date()
    console.log(`Démarrage de la tâche planifiée le ${today}`);
    myDailyTask();
}, {
    scheduled: true, // Assure que la tâche démarre automatiquement
    timezone: "Europe/Paris" // Optionnel : Ajuste selon ton fuseau horaire
});

console.log("Tâche planifiée configurée !");