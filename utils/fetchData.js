import axios from 'axios';
import fs from 'fs';
import AdmZip from 'adm-zip';
import csv from 'csv-parser';

// URL du fichier ZIP
const ZIP_URL_LOTO = 'https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afp6';
const ZIP_URL_EUROMILLIONS = 'https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afe6';


export const fetchData = async (game, lastDraw = null) => {
    // Étape 1 : Télécharger le fichier ZIP
    const downloadFile = async (url, outputPath) => {
        const writer = fs.createWriteStream(outputPath);

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    };

    // Étape 2 : Extraire le fichier ZIP
    const extractZip = (zipPath, outputDir) => {
        const zip = new AdmZip(zipPath);
        const entries = zip.getEntries();

        let csvFileName = null;
        entries.forEach(entry => {
            if (entry.entryName.endsWith('.csv')) {
                csvFileName = entry.entryName;
                zip.extractEntryTo(entry, outputDir, false, true);
            }
        });

        if (!csvFileName) {
            throw new Error('Aucun fichier CSV trouvé dans le ZIP.');
        }

        console.log(`Fichier CSV trouvé : ${csvFileName}`);
        return `${outputDir}/${csvFileName}`;
    };

    // Étape 3 : Lire le fichier CSV
    const readCSV = (csvPath) => {
        const results = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(csvPath, { encoding: 'utf8' })
                .pipe(csv({ separator: ';' }))
                .on('data', (row) => {
                    // Transformer les données en tableau d'objets formatés
                    try {
                        const parseDate = (dateStr) => {
                            const [day, month, year] = dateStr.split('/').map(Number); // Extraire jour, mois, année
                            return new Date(year, month - 1, day); // Les mois commencent à 0 (janvier = 0)
                        };
                        const formattedRow = {
                            date: parseDate(row['date_de_tirage']),
                            numbers: [
                                parseInt(row['boule_1'] || row['N°1'], 10),
                                parseInt(row['boule_2'] || row['N°2'], 10),
                                parseInt(row['boule_3'] || row['N°3'], 10),
                                parseInt(row['boule_4'] || row['N°4'], 10),
                                parseInt(row['boule_5'] || row['N°5'], 10),
                            ],
                            bonus: [
                                parseInt(row['numero_chance'] || row['etoile_1'], 10),
                                parseInt(row['etoile_2'], 10)
                                ].filter(num => !isNaN(num)),
                        };
                        results.push(formattedRow);
                    } catch (err) {
                        console.error('Erreur lors de la transformation d\'une ligne :', err);
                    }
                })
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    };

    // Exécution principale
    const main = async () => {
        const zipPath = './file.zip'; // Chemin temporaire pour stocker le fichier ZIP téléchargé
        const outputDir = './extracted'; // Répertoire où extraire les fichiers ZIP
        // const csvFileName = 'data.csv'; // Nom du fichier CSV attendu dans le ZIP
        const ZIP_URL = game === 'euromillions' ? ZIP_URL_EUROMILLIONS : game === 'loto' ? ZIP_URL_LOTO : null

        if (!ZIP_URL) {
            throw new Error('Jeu non supporté ou URL manquante.');
        }

        try {
            console.log('Téléchargement du fichier ZIP...');
            await downloadFile(ZIP_URL, zipPath);

            console.log('Extraction du fichier ZIP...');
            const csvPath = await extractZip(zipPath, outputDir);

            console.log('Lecture du fichier CSV...');
            // const csvPath = `${outputDir}/${csvFileName}`;
            const data = await readCSV(csvPath);

            console.log('Données récupérées sans erreur');
            return data
        } catch (error) {
            console.error('Une erreur est survenue :', error);
        } finally {
            // Nettoyage des fichiers temporaires
            if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
            if (fs.existsSync(csvPath)) fs.unlinkSync(csvPath);  // Suppression du fichier CSV extrait
        }
    };

    // Lancer le script
    const datas = await main();
    if(lastDraw) {
        const newData = datas.filter((data) => data.date > lastDraw.date)
        return newData
    }
    return datas
}
