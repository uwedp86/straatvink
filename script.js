document.addEventListener('DOMContentLoaded', () => {
    const categories = {
        voetganger: { btnId: 'btn-voetganger', baseCountId: 'count-voetganger' },
        fiets: { btnId: 'btn-fiets', baseCountId: 'count-fiets' },
        bakfiets: { btnId: 'btn-bakfiets', baseCountId: 'count-bakfiets' },
        auto_brommer: { btnId: 'btn-auto_brommer', baseCountId: 'count-auto_brommer'},
        bestelwagen: { btnId: 'btn-bestelwagen', baseCountId: 'count-bestelwagen' },
        vrachtwagen: { btnId: 'btn-vrachtwagen', baseCountId: 'count-vrachtwagen'},
        bus_tram: { btnId: 'btn-bus_tram', baseCountId: 'count-bus_tram' },
        step: { btnId: 'btn-step', baseCountId: 'count-step' }
    };

    const intervals = ['q1', 'q2', 'q3', 'q4']; // Kwartier identifiers
    let counts = {}; // Wordt gevuld door loadCounts
    let currentInterval = 'q1'; // Start in het eerste kwartier

    // Functie om de weergave van ALLE tellers voor EEN categorie bij te werken
    function updateCategoryDisplay(category) {
        let total = 0;
        intervals.forEach(interval => {
            const count = counts[category]?.[interval] || 0;
            total += count;
            const countElement = document.getElementById(`${categories[category].baseCountId}-${interval}`);
            if (countElement) {
                countElement.textContent = count;
                // Voeg data-label toe voor mobiele weergave in CSS
                countElement.setAttribute('data-label', interval.toUpperCase());
            } else {
                console.warn(`Element ${categories[category].baseCountId}-${interval} not found`);
            }
        });
        // Werk totaal bij
        counts[category].total = total; // Zorg dat het totaal in het object ook klopt
        const totalElement = document.getElementById(`${categories[category].baseCountId}-total`);
        if (totalElement) {
            totalElement.textContent = total;
            totalElement.setAttribute('data-label', 'Totaal');
        } else {
             console.warn(`Element ${categories[category].baseCountId}-total not found`);
        }
    }

    // Functie om ALLE tellers op het scherm bij te werken
    function updateAllDisplays() {
        for (const category in categories) {
             if (counts[category]) { // Controleer of de categorie data bestaat
                updateCategoryDisplay(category);
            }
        }
    }

    // Functie om de NAGEKOMEN tellingen op te slaan in localStorage
    function saveCounts() {
        localStorage.setItem('straatvinkCountsInterval', JSON.stringify(counts));
    }

    // Functie om de NAGEKOMEN tellingen te laden uit localStorage
    function loadCounts() {
        const savedCounts = localStorage.getItem('straatvinkCountsInterval');
        let loadedData = {};
        if (savedCounts) {
            try {
                loadedData = JSON.parse(savedCounts);
            } catch (e) {
                console.error("Error parsing localStorage data:", e);
                loadedData = {}; // Reset bij fout
            }
        }

        // Initialiseer/valideer de structuur voor elke categorie
        counts = {}; // Start met een leeg object
        for (const category in categories) {
            counts[category] = { total: 0 }; // Begin met total = 0
            intervals.forEach(interval => {
                // Neem waarde uit loadedData indien geldig, anders 0
                counts[category][interval] = (loadedData[category]?.[interval] > 0) ? loadedData[category][interval] : 0;
                // Bereken initieel totaal opnieuw voor consistentie
                // counts[category].total += counts[category][interval]; // Totaal wordt nu berekend in updateCategoryDisplay
            });
             // Zorg dat oude totalen niet blijven hangen als ze niet meer berekend worden
             if (loadedData[category] && typeof loadedData[category].total !== 'undefined') {
                 // We gebruiken het berekende totaal, negeer opgeslagen totaal hier
             }
        }
        updateAllDisplays(); // Werk de weergave bij na het laden/initialiseren
    }


    // Event listeners toevoegen aan Kwartier Selectie
    document.querySelectorAll('.interval-selector input[name="interval"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentInterval = event.target.value;
            console.log("Current interval set to:", currentInterval);
        });
    });

    // Event listeners toevoegen aan elke Categorie Knop
    for (const category in categories) {
        const button = document.getElementById(categories[category].btnId);
        if (button) {
            button.addEventListener('click', () => {
                // Verhoog de teller voor het HUIDIGE interval
                counts[category][currentInterval] = (counts[category][currentInterval] || 0) + 1;
                updateCategoryDisplay(category); // Werk de weergave voor deze categorie bij
                saveCounts(); // Sla de nieuwe tellingen op
            });
        }
    }

    // Event listener toevoegen aan de Reset Knop
    const resetButton = document.getElementById('btn-reset');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('Weet je zeker dat je ALLE tellers voor ALLE kwartieren wilt resetten?')) {
                for (const category in categories) {
                    intervals.forEach(interval => {
                        counts[category][interval] = 0;
                    });
                    counts[category].total = 0; // Reset ook totaal in het object
                }
                updateAllDisplays(); // Werk de weergave bij
                saveCounts(); // Sla de geresette tellingen op
            }
        });
    }

    // Laad de tellingen wanneer de pagina geladen is
    loadCounts();

    // Stel het initieel geselecteerde interval in (voor het geval de pagina herladen wordt)
    const checkedInterval = document.querySelector('.interval-selector input[name="interval"]:checked');
    if (checkedInterval) {
        currentInterval = checkedInterval.value;
    } else {
        // Fallback als er geen is geselecteerd (zou niet mogen gebeuren met 'checked' in HTML)
        document.querySelector('.interval-selector input[value="q1"]').checked = true;
        currentInterval = 'q1';
    }
     console.log("Initial interval:", currentInterval);

});