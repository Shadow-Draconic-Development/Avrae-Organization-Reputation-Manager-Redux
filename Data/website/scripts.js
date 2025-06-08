document.addEventListener('DOMContentLoaded', () => {
    const decksContainer = document.getElementById('decksContainer');
    const addDeckButton = document.getElementById('addDeck');
    const jsonOutput = document.getElementById('jsonOutput');
    const copyToClipboard = document.getElementById('copyToClipboard');
    const toggleTheme = document.getElementById('toggleTheme');

    // System preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.classList.add('dark-mode');
        toggleTheme.textContent = 'Switch to Light Mode';
    }

    // Theme toggle
    toggleTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleTheme.textContent = document.body.classList.contains('dark-mode')
            ? 'Switch to Light Mode'
            : 'Switch to Dark Mode';
    });

    // Function to prevent single quotes in input
    function preventSingleQuotes(input) {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            updateJSON();
        });
    }

    function updateJSON() {
        const decks = document.querySelectorAll('.deck');
        const output = {};

        decks.forEach(deck => {
            const orgName = deck.querySelector('.org-name').value.trim();
            if (!orgName) return;

            const deleteCheckbox = deck.querySelector('.delete-org');
            if (deleteCheckbox.checked) {
                output[orgName] = 'delete';
                return;
            }

            const thresholds = deck.querySelectorAll('.threshold');
            const orgData = {};
            thresholds.forEach(threshold => {
                const points = threshold.querySelector('.points').value.trim();
                if (points === '') return;

                const rewards = threshold.querySelectorAll('.reward input');
                const rewardArray = [];
                rewards.forEach(reward => {
                    const rewardValue = reward.value.trim();
                    if (rewardValue) rewardArray.push(rewardValue);
                });
                orgData[points] = rewardArray;
            });

            const imgUrl = deck.querySelector('.img-url').value.trim();
            const color = deck.querySelector('.color').value.trim();
            if (imgUrl) orgData.imgurl = imgUrl;
            if (color) orgData.color = color;

            output[orgName] = orgData;
        });

        // Surround the JSON with single quotes
        jsonOutput.value = `'${JSON.stringify(output).replaceAll("'", "\\'")}'`;
    }

    function toggleInputs(deck, disable) {
        const inputs = deck.querySelectorAll('input:not(.org-name):not(.delete-org), button:not(#removeDeckButton)');
        inputs.forEach(input => {
            input.disabled = disable;
            input.style.backgroundColor = disable ? '#d3d3d3' : '';
        });
    }

    function createRewardInput(thresholdSection) {
        const rewardSection = document.createElement('section');
        rewardSection.className = 'reward';
        const rewardInput = document.createElement('input');
        rewardInput.type = 'text';
        rewardInput.placeholder = 'Reward';
        preventSingleQuotes(rewardInput);

        const removeRewardButton = document.createElement('button');
        removeRewardButton.textContent = 'Remove Reward';
        removeRewardButton.addEventListener('click', () => {
            rewardSection.remove();
            updateJSON();
        });

        rewardSection.appendChild(rewardInput);
        rewardSection.appendChild(removeRewardButton);
        thresholdSection.appendChild(rewardSection);
    }

    function createThresholdInput(deck) {
        const thresholdSection = document.createElement('section');
        thresholdSection.className = 'threshold';

        const pointsInput = document.createElement('input');
        pointsInput.type = 'number';
        pointsInput.className = 'points';
        pointsInput.placeholder = 'Points';
        pointsInput.addEventListener('input', updateJSON);

        const addRewardButton = document.createElement('button');
        addRewardButton.textContent = 'Add Reward';
        addRewardButton.addEventListener('click', () => {
            createRewardInput(thresholdSection);
        });

        const removeThresholdButton = document.createElement('button');
        removeThresholdButton.textContent = 'Remove Threshold';
        removeThresholdButton.addEventListener('click', () => {
            thresholdSection.remove();
            updateJSON();
        });

        thresholdSection.appendChild(pointsInput);
        thresholdSection.appendChild(addRewardButton);
        thresholdSection.appendChild(removeThresholdButton);
        deck.appendChild(thresholdSection);
    }

    function createDeck() {
        const deck = document.createElement('fieldset');
        deck.className = 'deck';

        const orgNameInput = document.createElement('input');
        orgNameInput.type = 'text';
        orgNameInput.className = 'org-name';
        orgNameInput.placeholder = 'Organization Name';
        preventSingleQuotes(orgNameInput);

        const deleteContainer = document.createElement('div');
        deleteContainer.className = 'delete-container';
        const deleteCheckbox = document.createElement('input');
        deleteCheckbox.type = 'checkbox';
        deleteCheckbox.className = 'delete-org';
        deleteCheckbox.id = `delete-org-${Date.now()}`;
        deleteCheckbox.addEventListener('change', () => {
            toggleInputs(deck, deleteCheckbox.checked);
            updateJSON();
        });

        const deleteLabel = document.createElement('label');
        deleteLabel.htmlFor = deleteCheckbox.id;
        deleteLabel.textContent = 'Delete Organization';

        deleteContainer.appendChild(deleteCheckbox);
        deleteContainer.appendChild(deleteLabel);

        const imgUrlInput = document.createElement('input');
        imgUrlInput.type = 'url';
        imgUrlInput.className = 'img-url';
        imgUrlInput.placeholder = 'Image URL';
        preventSingleQuotes(imgUrlInput);

        const colorInput = document.createElement('input');
        colorInput.type = 'text';
        colorInput.className = 'color';
        colorInput.placeholder = 'Color (e.g., #FF0000)';
        colorInput.pattern = '^#[0-9A-Fa-f]{6}$';
        preventSingleQuotes(colorInput);

        const addThresholdButton = document.createElement('button');
        addThresholdButton.textContent = 'Add Threshold';
        addThresholdButton.addEventListener('click', () => {
            createThresholdInput(deck);
        });

        const removeDeckButton = document.createElement('button');
        removeDeckButton.id = 'removeDeckButton';
        removeDeckButton.textContent = 'Remove Organization';
        removeDeckButton.addEventListener('click', () => {
            deck.remove();
            updateJSON();
        });

        deck.appendChild(orgNameInput);
        deck.appendChild(deleteContainer);
        deck.appendChild(imgUrlInput);
        deck.appendChild(colorInput);
        deck.appendChild(addThresholdButton);
        deck.appendChild(removeDeckButton);

        decksContainer.appendChild(deck);
    }

    addDeckButton.addEventListener('click', createDeck);

    copyToClipboard.addEventListener('click', () => {
        jsonOutput.select();
        document.execCommand('copy');
        alert('JSON copied to clipboard!');
    });

    // Initialize with one deck
    createDeck();
});