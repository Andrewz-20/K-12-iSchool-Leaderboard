const SHEET_URL = 'https://api.allorigins.win/raw?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vRuPYnGFTqKBCNuMY_l-fm0cOOj3qQtkqaDz4ruAYlzrJ9kC2IGAcymEBhpbgOnyTZCpoHzu_PSWUkS/pub?output=csv';
const UPDATE_INTERVAL = 10000; // 10 seconds

async function fetchData() {
    try {
        const response = await fetch(`${SHEET_URL}&nocache=${Math.random()}`);
        const csv = await response.text();
        const data = csvToArray(csv);
        
        // Clean the data - remove any empty rows and ensure required fields exist
        const validTutors = data.filter(tutor => 
            tutor.Name && tutor.Name.trim() !== '' && 
            tutor.ImageURL && tutor.ImageURL.trim() !== ''
        );

        renderTutors(validTutors);
        addConfettiEffects();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTutors(tutors) {
    const container = document.getElementById('graduates-grid');
    container.innerHTML = tutors.map(tutor => `
        <div class="graduate-card">
            <img src="${tutor.ImageURL}" class="graduate-avatar" alt="${tutor.Name}">
            <h3 class="graduate-name">${formatName(tutor.Name)}</h3>
            <p class="graduate-degree">24/24</p>
            <p class="graduate-date">Date: 02/2025 </p>
        </div>
    `).join('');
}

// Helper function to clean up names (remove IDs and special characters)
function formatName(name) {
    return name
        .replace(/\[.*?\]/g, '') // Remove anything in brackets
        .replace(/\(.*?\)/g, '') // Remove anything in parentheses
        .replace(/\{.*?\}/g, '') // Remove anything in curly braces
        .replace(/T-\d+/g, '')   // Remove T- numbers
        .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
        .trim();
}

function addConfettiEffects() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    document.querySelectorAll('.graduate-card').forEach(card => {
        for (let i = 0; i < 15; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 5}s`;
            confetti.style.width = `${Math.random() * 8 + 4}px`;
            confetti.style.height = `${Math.random() * 8 + 4}px`;
            card.appendChild(confetti);
        }
    });
}

function csvToArray(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((acc, header, index) => {
            acc[header] = (values[index] || '').trim();
            return acc;
        }, {});
    });
}

// Initial load
fetchData();
setInterval(fetchData, UPDATE_INTERVAL);
