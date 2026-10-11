
const liveGames = document.getElementById('games-list');
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;
async function FetchTeams() {
    try {
        const response = await fetch(`${apiUrl}/games`, {
            headers: { Authorization: `${apiKey}` },
        });
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        const teams = await response.json();
        console.log(teams);

    } catch (error) {
        console.log(error);
    }
}

FetchTeams();