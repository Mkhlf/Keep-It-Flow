let mainTab = null; //mainTab Id

// get the current tabs and mute them if the maintab is active, and if not unmute them 
async function querychrome() {
	chrome.tabs.query({})
		.then(async (tabs) => {
			let muteButton = await chrome.storage.local.get('status');
			muteButton = muteButton['status'];
			let mainTabState = await getTab(mainTab);
			if (mainTabState === null) return;
			mainTabState = mainTabState.audible;
		if(muteButton == 'On'){	for (let tab of tabs) {
			if (tab.id !== mainTab && mainTabState && muteButton == "On") {
				toggleMute(tab.id, true);
			} else {
				if (tab.muted || tab.MutedInfoReason !== 'user')
					toggleMute(tab.id, false);
			}
		}}
		else if (muteButton == 'Off'){
			for(let tab of tabs){
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
		let tab = await chrome.tabs.get(parseInt(tabId));
		return tab;
	}
	return null;
}


// take the tab to be toggled, and its newstate
async function toggleMute(tabId, state = true) {
	let currTab = await getTab(tabId);
	if (currTab === null || currTab.muted === state) return;
	await chrome.tabs.update(tabId, { muted: state });
}

// Set the initial empty tab
chrome.storage.local.set({ choice: null });

// when the user select a new tab, chage it to the current tab
chrome.storage.onChanged.addListener(async function (changes) {


	let muteButton = await chrome.storage.local.get('status');
	muteButton = muteButton['status'];
	console.log(muteButton+" background js")
	
	if(changes['choice']){
		
		
		let newTitle = changes['choice']['newValue'];
		let oldTitle = changes['choice']['oldValue'];
	

	

	
	if (newTitle !== oldTitle ) {
		mainTab = parseInt(newTitle);
		toggleMute(mainTab, false);
		await querychrome();
	}

}
	else if (changes['status']){ 
		await querychrome();
		

	}


	

	
});


// calling if a new tab is created, add it and mute it if needed.
chrome.tabs.onCreated.addListener(async function () {
	mainTab = await chrome.storage.local.get('choice');
	mainTab = mainTab['choice'];
	if (mainTab === null) return;
	mainTab = parseInt(mainTab);
	await querychrome();
});
// @TODO: 
chrome.tabs.onRemoved.addListener(function () {
	// check if the deleted tab is the mainTab
});

// only check if the maintab were chenged
chrome.tabs.onUpdated.addListener(async function (tabid) {
	mainTab = await chrome.storage.local.get('choice');
	mainTab = mainTab['choice'];
	if (mainTab === null) return;
	mainTab = parseInt(mainTab);
	await querychrome();
});

// calling the main functions
querychrome();
