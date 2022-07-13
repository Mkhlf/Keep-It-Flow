const optionsTabs = document.getElementById("select")
const choicePicked = document.querySelector("#picked")
let mainTab = null;
queryTabs();

// get the tab from the current tab id
async function getTab(tabId) {
	if (tabId === null) return null;
	let tab = await browser.tabs.get(parseInt(tabId));
	return tab;
}

//To check which tab did the user picked

optionsTabs.addEventListener('change', async (event) => {
	let newOptionId = event.target;
	mainTab = newOptionId.value;
	let myTab = await getTab(mainTab);
	browser.storage.local.set({ choice: mainTab, choiceTitle: myTab.title });
})

// helper function that takes a tab and add it to current tab list
async function addNewOption(tab) {

	mainTab = await browser.storage.local.get('choice');
	mainTab = mainTab['choice'];
	if (mainTab !== null)
		mainTab = parseInt(mainTab);

	let newOption = document.createElement('option');
	newOption.value = tab.id;
	newOption.text = tab.title;
	if (mainTab !== null && mainTab === tab.id) {
		newOption.selected = true;
	}
	optionsTabs.appendChild(newOption);

}

//check the current tabs and add them to the dropdown menu
async function queryTabs() {
	
	optionsTabs.innerHTML = ''; // reset the dropdown menue
	browser.tabs.query({})
		.then((tabs) => {
			for (let tab of tabs) { // loop over all the tabs
				addNewOption(tab);
			}
		});
}

//update the current tablist if a tab was added, removed, or changed by any mean.
browser.tabs.onRemoved.addListener(
	() => {
		queryTabs();
	});
browser.tabs.onCreated.addListener(
	() => {
		queryTabs()
	});
browser.tabs.onUpdated.addListener(
	() => {
		queryTabs()
	});

//get all the tabs
