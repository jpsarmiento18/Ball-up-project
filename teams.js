const teamList = document.getElementById('teams-list');
const eastBtn = document.getElementById('east-btn');
const westBtn = document.getElementById('west-btn');
const conferenceLabel = document.getElementById('conference-label');

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

let allTeams = [];

async function fetchTeams() {
    try {
        const response = await fetch(`${apiUrl}/teams`, {
            headers: { Authorization: apiKey },
        });
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        const teams = await response.json();

        allTeams = teams.data;
        showConference('East');
    } catch (error) {
        console.log(error);
    }
}

function showConference(conference) {
    const filtered = allTeams.filter(team => team.conference === conference);

    teamList.innerHTML = filtered.map(team => {
        const { full_name, division } = team;
        conferenceLabel.textContent = `You are viewing the ${conference}ern Conference`;

        if (conference === 'East') {
            conferenceLabel.textContent = 'You are viewing the Eastern Conference';
        } else {
            conferenceLabel.textContent = 'You are viewing the Western Conference';
        }

        return `
      <li>
        <span>${full_name}</span>
        <span>${division}</span>
      </li>
    `;
    }).join('');

    eastBtn.classList.toggle('active', conference === 'East');
    westBtn.classList.toggle('active', conference === 'West');
}

eastBtn.addEventListener('click', () => showConference('East'));
westBtn.addEventListener('click', () => showConference('West'));

fetchTeams();

