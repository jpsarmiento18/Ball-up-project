
const liveGames = document.getElementById('games-list');
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;


function apiDate(date) {
    return date.toLocaleDateString('en-CA');
}

function displayDate(dateString) {
    return new Date(dateString + 'T12:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

async function getGames(url) {
    const response = await fetch(url, {
        headers: { Authorization: apiKey },
    });
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    const games = await response.json();
    return games.data;
}


async function fetchGames() {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    try {
        let games = await getGames(`${apiUrl}/games?start_date=${apiDate(weekAgo)}&end_date=${apiDate(today)}`);

        if (games.length === 0) {
            const playoffs = await getGames(`${apiUrl}/games?seasons[]=2025&postseason=true&per_page=100`);
            games = playoffs
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 7);
        }

        liveGames.innerHTML = games.map(game => {
            const { date, status, home_team, visitor_team, home_team_score, visitor_team_score } = game;

            return `
        <li>
          <p>${displayDate(date)}</p>
          <p>${visitor_team.abbreviation} ${visitor_team_score}</p>
          <p>${home_team.abbreviation} ${home_team_score}</p>
          <p>${status}</p>
        </li>
      `;
        }).join('');
    } catch (error) {
        console.log(error);
    }
}

fetchGames();