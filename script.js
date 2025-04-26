document.addEventListener('DOMContentLoaded', () => {
    // Definieer de categorieën en hun bijbehorende element-ID's
    const categories = {
        voetganger: { btnId: 'btn-voetganger', countId: 'count-voetganger' },
        fiets: { btnId: 'btn-fiets', countId: 'count-fiets' },
        auto: { btnId: 'btn-auto', countId: 'count-auto' },
        lichtevracht: { btnId: 'btn-lichtevracht', countId: 'count-lichtevracht' },
        bus: { btnId: 'btn-bus', countId: 'count-bus' }
    };

    let counts = {}; // Object om de tellingen bij te houden

    // Functie om de weergave van een teller bij te werken
    function updateCountDisplay(category) {
        const countElement = document.getElementById(categories[category].countId);
        if (countElement) {
            countElement.textContent = counts[category] || 0;
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
        localStorage.setItem('trafficCounts', JSON.stringify(counts));
    }

    // Functie om de tellingen te laden uit localStorage
    function loadCounts() {
        const savedCounts = localStorage.getItem('trafficCounts');
        if (savedCounts) {
            counts = JSON.parse(savedCounts);
        } else {
            // Initialiseer tellingen op 0 als er niets is opgeslagen
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
        }
    }

    // Voeg event listener toe aan de resetknop
    const resetButton = document.getElementById('btn-reset');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('Weet je zeker dat je alle tellers wilt resetten?')) {
                for (const category in categories) {
                    counts[category] = 0; // Reset alle tellers in het object
                }
                updateAllDisplays(); // Werk de weergave bij
                saveCounts(); // Sla de geresette tellingen op (of verwijder de key)
                // Alternatief: localStorage.removeItem('trafficCounts');
            }
        });
    }

    // Laad de tellingen wanneer de pagina geladen is
    loadCounts();
});