let config;
let listDataPlayer;
let currentDataPlayer;
let sortDirection = {
    PlayerId: 'asc',
    Created: 'asc',
    LastLogin: 'asc'
};

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
        listDataPlayer=allPlayers;
        currentDataPlayer=allPlayers;
         displayPlayers(allPlayers); // Hiển thị người chơi ra giao diện
    } catch (error) {
        console.error('Error loading players:', error);
    }
}

// Hiển thị danh sách người chơi ra giao diện
function displayPlayers(players) {
    const playerListContainer = document.getElementById('playerList');
    playerListContainer.innerHTML = ""; // Clear previous content

    if(players.length === 0) {
        playerListContainer.textContent = "No players to display.";
        return;
    }

    // Create the table and table header
    const table = document.createElement('table');
    table.classList.add('player-table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
    <th>Player ID <button onclick="sortPlayers('PlayerId')">Sort</button></th>
    <th>Created <button onclick="sortPlayers('Created')">Sort</button></th>
    <th>Last Login <button onclick="sortPlayers('LastLogin')">Sort</button></th>
`;

    table.appendChild(headerRow);

    // Populate the table with player data
    players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.PlayerId}</td>
            <td>${Common.convertISOToDateTime(player.Created)}</td>
            <td>${Common.convertISOToDateTime(player.LastLogin)}</td>
        `;
        table.appendChild(row);
    });

    playerListContainer.appendChild(table);
}
function searchPlayers(searchTerm) {
    const filteredPlayers = listDataPlayer.filter(player =>
        player.PlayerId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    currentDataPlayer=filteredPlayers;
    displayPlayers(filteredPlayers); // Hiển thị kết quả tìm kiếm
}
function sortPlayers(criteria) {
    const direction = sortDirection[criteria];

    // Sắp xếp danh sách người chơi dựa trên tiêu chí
    currentDataPlayer.sort((a, b) => {
        if (criteria === 'Created' || criteria === 'LastLogin') {
            return direction === 'asc' 
                ? new Date(a[criteria]) - new Date(b[criteria])
                : new Date(b[criteria]) - new Date(a[criteria]);
        } else {
            return direction === 'asc'
                ? a[criteria].localeCompare(b[criteria])
                : b[criteria].localeCompare(a[criteria]);
        }
    });

    // Đổi chiều sắp xếp cho lần tiếp theo
    sortDirection[criteria] = direction === 'asc' ? 'desc' : 'asc';

    // Hiển thị lại danh sách sau khi sắp xếp
    displayPlayers(currentDataPlayer);
}

// ------------------------------------------------------
// Load the config when the script starts
loadConfig();

// Cập nhật sự kiện click cho nút tìm kiếm
document.getElementById('searchButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value;
    searchPlayers(searchTerm); // Gọi hàm tìm kiếm
});