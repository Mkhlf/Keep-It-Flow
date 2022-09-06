let mainTab = null; //mainTab Id

// get the current tabs and mute them if the maintab is active, and if not unmute them 
async function querybrowser() {
	browser.tabs.query({})
		.then(async (tabs) => {
			let muteButton = await browser.storage.local.get('status');
			muteButton = muteButton['status'];
			let mainTabState = await getTab(mainTab);
			if (mainTabState === null) return;
			mainTabState = mainTabState.audible;
			if (muteButton == 'On') {
				for (let tab of tabs) {
					if (tab.id !== mainTab && mainTabState && muteButton == "On") {
						toggleMute(tab.id, true);
					} else {
						if (tab.muted || tab.MutedInfoReason !== 'user')
							toggleMute(tab.id, false);
					}
				}
			}
			else if (muteButton == 'Off') {
				for (let tab of tabs) {
					toggleMute(tab.id, false);
				}

			}
		});
}

// get the tab from the tab id
async function getTab(tabId) {
	if (tabId !== null && (typeof (tabId) === "string" || typeof (tabId) === "number")) {
		if (isNaN(tabId))
			return null;
		let tab = await browser.tabs.get(parseInt(tabId));
		return tab;
	}
	return null;
}


// take the tab to be toggled, and its newstate
async function toggleMute(tabId, state = true) {
	let currTab = await getTab(tabId);
	if (currTab === null || currTab.muted === state) return;
	await browser.tabs.update(tabId, { muted: state });
}

// Set the initial empty tab
async function getStatus() {
	try {
		mainTab = await browser.storage.local.get('choice');
	}
	catch (err) {
		browser.storage.local.set({ choice: null });
	}
}

// when the user select a new tab, chage it to the current tab
browser.storage.onChanged.addListener(async function (changes) {
	let muteButton = await browser.storage.local.get('status');
	muteButton = muteButton['status'];

	if (changes['choice']) {
		let newTitle = changes['choice']['newValue'];
		let oldTitle = changes['choice']['oldValue'];
		if (newTitle !== oldTitle) {
			mainTab = parseInt(newTitle);
			toggleMute(mainTab, false);
			await querybrowser();
		}
	}
	else if (changes['status']) {
		await querybrowser();
	}
});

// calling the main functions
getLatTab()
querybrowser();

// calling if a new tab is created, add it and mute it if needed.
browser.tabs.onCreated.addListener(async function () {
	mainTab = await browser.storage.local.get('choice');
	mainTab = mainTab['choice'];
	if (mainTab === null) return;
	mainTab = parseInt(mainTab);
	await querybrowser();
});
// @TODO: 
browser.tabs.onRemoved.addListener(function () {
	// check if the deleted tab is the mainTab
});

// only check if the maintab were chenged
browser.tabs.onUpdated.addListener(async function (tabid) {
	mainTab = await browser.storage.local.get('choice');
	mainTab = mainTab['choice'];
	if (mainTab === null) return;
	mainTab = parseInt(mainTab);
	await querybrowser();
});

