document.addEventListener('DOMContentLoaded', () => {
    // Definieer de NIEUWE categorieën en hun bijbehorende element-ID's
    // Gebaseerd op PDF [cite: 2]
    const categories = {
        voetganger: { btnId: 'btn-voetganger', countId: 'count-voetganger' },
        fiets: { btnId: 'btn-fiets', countId: 'count-fiets' },
        bakfiets: { btnId: 'btn-bakfiets', countId: 'count-bakfiets' },
        auto_brommer: { btnId: 'btn-auto_brommer', countId: 'count-auto_brommer'},
        bestelwagen: { btnId: 'btn-bestelwagen', countId: 'count-bestelwagen' },
        vrachtwagen: { btnId: 'btn-vrachtwagen', countId: 'count-vrachtwagen'},
        bus_tram: { btnId: 'btn-bus_tram', countId: 'count-bus_tram' },
        step: { btnId: 'btn-step', countId: 'count-step' }
    };

    let counts = {}; // Object om de tellingen bij te houden

    // Functie om de weergave van een teller bij te werken
    function updateCountDisplay(category) {
        const countElement = document.getElementById(categories[category].countId);
        if (countElement) {
            // Zorg ervoor dat de teller op 0 staat als deze nog niet bestaat
            countElement.textContent = counts[category] || 0;
        } else {
             console.warn(`Count element not found for category: ${category} (ID: ${categories[category].countId})`);
        }
    }

    // Functie om alle tellers op het scherm bij te werken
    function updateAllDisplays() {
        for (const category in categories) {
            updateCountDisplay(category);
        }
    }

    // Functie om de tellingen op te slaan in localStorage
    function saveCounts() {
        localStorage.setItem('straatvinkCounts', JSON.stringify(counts)); // Gebruik een unieke naam
    }

    // Functie om de tellingen te laden uit localStorage
    function loadCounts() {
        const savedCounts = localStorage.getItem('straatvinkCounts');
        if (savedCounts) {
            counts = JSON.parse(savedCounts);
             // Zorg ervoor dat alle categorieën bestaan in het 'counts' object,
             // zelfs als ze nieuw zijn toegevoegd sinds de laatste keer opslaan.
             for (const category in categories) {
                if (!(category in counts)) {
                    counts[category] = 0;
                }
            }
        } else {
            // Initialiseer alle tellingen op 0 als er niets is opgeslagen
            for (const category in categories) {
                counts[category] = 0;
            }
        }
        updateAllDisplays(); // Werk de weergave bij na het laden
    }

    // Voeg event listeners toe aan elke knop
    for (const category in categories) {
        const button = document.getElementById(categories[category].btnId);
        if (button) {
            button.addEventListener('click', () => {
                counts[category] = (counts[category] || 0) + 1; // Verhoog de teller
                updateCountDisplay(category); // Werk de weergave bij
                saveCounts(); // Sla de nieuwe tellingen op
            });
        } else {
             console.warn(`Button element not found for category: ${category} (ID: ${categories[category].btnId})`);
        }
    }

    // Voeg event listener toe aan de resetknop
    const resetButton = document.getElementById('btn-reset');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Vraag bevestiging
            if (confirm('Weet je zeker dat je alle tellers wilt resetten? Deze actie kan niet ongedaan gemaakt worden.')) {
                for (const category in categories) {
                    counts[category] = 0; // Reset alle tellers in het object
                }
                updateAllDisplays(); // Werk de weergave bij
                saveCounts(); // Sla de geresette tellingen op
            }
        });
    } else {
         console.warn(`Reset button not found (ID: btn-reset)`);
    }

    // Laad de tellingen wanneer de pagina geladen is
    loadCounts();
});