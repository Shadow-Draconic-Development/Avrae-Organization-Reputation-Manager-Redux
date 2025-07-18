document.addEventListener('DOMContentLoaded', () => {
    const orgsContainer = document.getElementById('orgsContainer');
    const addOrgButton = document.getElementById('addOrg');
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
            if (value.includes("'") | value.includes("‘") | value.includes("’") | value.includes("‚") | value.includes("‛"))  {
                e.target.value = value.replace(/'/g, "").replace(/‘/g, "").replace(/’/g, "").replace(/‚/, "").replace(/‛/g, "");
                alert("Single quotes (') are not allowed in inputs.");
            }

            updateJSON();
        });
    }

    function updateJSON() {
        const orgs = document.querySelectorAll('.org');
        const output = {};

        orgs.forEach(org => {
            const orgName = org.querySelector('.org-name').value.trim();
            if (!orgName) return;

            const deleteCheckbox = org.querySelector('.delete-org');
            if (deleteCheckbox.checked) {
                output[orgName] = 'delete';
                return;
            }

            const thresholds = org.querySelectorAll('.threshold');
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

            const imgUrl = org.querySelector('.img-url').value.trim();
            const color = org.querySelector('.color').value.trim();
            if (imgUrl) orgData.imgurl = imgUrl;
            if (color) orgData.color = color;

            output[orgName] = orgData;
        });

        // Surround the JSON with single quotes
        const jsonString = JSON.stringify(output).replace(/'/g, "\\'").replace(/‘/g, "\\'").replace(/’/g, "\\'").replace(/‚/, "\\'").replace(/‛/g, "\\'");
        jsonOutput.value = `'${jsonString}'`;
    }

    function toggleInputs(org, disable) {
        const inputs = org.querySelectorAll('input:not(.org-name):not(.delete-org), button:not(#removeOrgButton)');
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
        rewardInput.addEventListener('input', updateJSON);

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

    function createThresholdInput(org) {
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
        org.appendChild(thresholdSection);
    }

    function createOrganization() {
        const org = document.createElement('fieldset');
        org.className = 'org';

        const orgNameInput = document.createElement('input');
        orgNameInput.type = 'text';
        orgNameInput.className = 'org-name';
        orgNameInput.placeholder = 'Organization Name';
        orgNameInput.addEventListener('input', updateJSON);

        const deleteContainer = document.createElement('div');
        deleteContainer.className = 'delete-container';
        const deleteCheckbox = document.createElement('input');
        deleteCheckbox.type = 'checkbox';
        deleteCheckbox.className = 'delete-org';
        deleteCheckbox.id = `delete-org-${Date.now()}`;
        deleteCheckbox.addEventListener('change', () => {
            toggleInputs(org, deleteCheckbox.checked);
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
            createThresholdInput(org);
        });

        const removeOrgButton = document.createElement('button');
        removeOrgButton.id = 'removeOrgButton';
        removeOrgButton.textContent = 'Remove Organization';
        removeOrgButton.addEventListener('click', () => {
            org.remove();
            updateJSON();
        });

        org.appendChild(orgNameInput);
        org.appendChild(deleteContainer);
        org.appendChild(imgUrlInput);
        org.appendChild(colorInput);
        org.appendChild(addThresholdButton);
        org.appendChild(removeOrgButton);

        orgsContainer.appendChild(org);
    }

    addOrgButton.addEventListener('click', createOrganization);

    copyToClipboard.addEventListener('click', () => {
        jsonOutput.select();
        document.execCommand('copy');
        alert('JSON copied to clipboard!');
    });

    
    createOrganization();
});