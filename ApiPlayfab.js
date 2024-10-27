let config;

async function loadConfig() {
    const response = await fetch('config.json');
    config = await response.json();
}

async function checkConnection() {
    if (!config) {
        await loadConfig();
    }

    const { titleId, secretKey } = config;

    const response = await fetch(`https://${titleId}.playfabapi.com/Server/GetTitleData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-SecretKey": secretKey
        },
        body: JSON.stringify({})
    });

    if (response.ok) {
        alert("Successfully connected to Server!");
    } else {
        alert("Failed to connect to Server.");
    }
}
async function loadAllPlayers() {
    if (!config) {
        await loadConfig(); // Load PlayFab configuration
    }

    const { titleId, secretKey,SegmentId } = config;
    const url = `https://${titleId}.playfabapi.com/Server/GetPlayersInSegment`;

    const requestData = {
        "SegmentId": SegmentId, // Thay bằng ID của phân khúc người chơi
        "MaxBatchSize": 100, // Số lượng người chơi tối đa trả về trong một lần gọi API
        "ContinuationToken": null // Token tiếp tục nếu có nhiều hơn 100 người chơi
    };

    try {
        let allPlayers = [];
        let hasMorePlayers = true;

        while (hasMorePlayers) {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-SecretKey': secretKey
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('API Response:', data);
            if (data.error) {
                throw new Error(data.error.message);
            }

            // Lưu người chơi vào danh sách
            allPlayers = allPlayers.concat(data.data.PlayerProfiles);
            console.log('API Response:', allPlayers);

            // Kiểm tra token tiếp tục (nếu có) để lấy thêm người chơi
            if (data.data.ContinuationToken) {
                requestData.ContinuationToken = data.data.ContinuationToken;
            } else {
                hasMorePlayers = false;
            }
        }
         displayPlayers(allPlayers); // Hiển thị người chơi ra giao diện
    } catch (error) {
        console.error('Error loading players:', error);
    }
}

// Hiển thị danh sách người chơi ra giao diện
function displayPlayers(players) {
    const playerListContainer = document.getElementById('playerList');
    if(players.length === 0) {
        playerListContainer.textContent = "No players to display.";
        return;
    }
    players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.classList.add('player-item');
        playerItem.innerHTML = `
            <p>Player ID: ${player.PlayerId}</p>
            <p>Last Login: ${player.LastLogin}</p>
            <p>Created: ${player.Created}</p>
            <hr/>
        `;
        playerListContainer.appendChild(playerItem);
    });
}


// Load the config when the script starts
loadConfig();