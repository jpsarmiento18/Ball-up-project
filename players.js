const playerList = document.getElementById('players-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageLabel = document.getElementById('page-label');

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

let page = 1;
let cursors = { 1: '' };

async function fetchPlayers() {
    let url = `${apiUrl}/players?per_page=20`;
    if (cursors[page]) {
        url += `&cursor=${cursors[page]}`;
    }

    const response = await fetch(`${url}`, {
        headers: { Authorization: apiKey },
    });
    const players = await response.json();

    cursors[page + 1] = players.meta.next_cursor;

    playerList.innerHTML = players.data.map(player => {
        const { first_name, last_name, position, team } = player;

        return `
    <li>
      <span>${first_name} ${last_name}</span>
      <span>${position} · ${team?.abbreviation ?? 'FA'}</span>
    </li>
  `;
    }).join('');

    pageLabel.textContent = `Page ${page}`;
    prevBtn.disabled = page === 1;
}

nextBtn.addEventListener('click', () => {
    page++;
    fetchPlayers();
});

prevBtn.addEventListener('click', () => {
    page--;
    fetchPlayers();
});

fetchPlayers();