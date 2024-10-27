

function openTab(event, tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // Remove active class from all tabs
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    // Show the clicked tab's content and add active class to the clicked tab
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.classList.add('active');

    // Kiểm tra xem tab 2 được mở thì gọi hàm loadPlayerData
    if (tabName === 'tab2') {
        loadAllPlayers();
    }
}

// Open the first tab by default
document.addEventListener("DOMContentLoaded", function() {
    document.getElementsByClassName('tab')[0].click();
});


