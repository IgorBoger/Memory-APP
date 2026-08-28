// import './styles/style.scss';

init();


function init() {
    startSettingsPage();
    renderPlayingFieldCards();
}


function showPage(currentPage: HTMLElement, nextPage: HTMLElement) {
    currentPage.classList.remove('page--active');
    setTimeout(() => {
        currentPage.hidden = true;
        nextPage.hidden = false;
        requestAnimationFrame(() => {
            nextPage.classList.add('page--active');
        });
    }, 300);
}


function startSettingsPage() {
    const playBtn = document.getElementById('playButton');
    playBtn?.addEventListener('click', () => {
        const settingsPage = document.getElementById('settingsPage');
        const startPage = document.getElementById('startPage');
        if (startPage && settingsPage) {
            showPage(startPage, settingsPage);
        }
    });
}


function renderPlayingFieldCards() {
    const playingFieldBoard = document.getElementById("playingFieldBoard");
    if (playingFieldBoard) {
        for (let cardIndex = 0; cardIndex < 16; cardIndex++) {
            const memoryCard = document.createElement("button");
            memoryCard.className = "memory-card";
            memoryCard.innerHTML = `
            <div class="memory-card__inner">
                <div class="memory-card__face memory-card__face--front">
                    <img class="memory-card__image"
                    src="/img/settings-page/dev-logo.png"
                    alt="Code vibes card">
                </div>
                <div class="memory-card__face memory-card__face--back">
                    <img class="memory-card__image"
                    src="/img/settings-page/git-logo.png"
                    alt="Git card">
                </div>
            </div>`;
            playingFieldBoard.appendChild(memoryCard);
        }
    }
}
