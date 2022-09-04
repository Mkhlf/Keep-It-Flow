const optionsTabs = document.getElementById("select")
const choicePicked = document.querySelector("#picked")
var checkbox = document.querySelector("#myCheck")
let mainTab = null;
startUp();
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
	checkbox.checked = false;
	buttonOnPro();
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
	await browser.tabs.query({})
		.then(async (tabs) => {
					//Adding a null value at the begining so the user could pick the tab even if it was the first tab.
					let newOption = document.createElement('option');
					newOption.value = "-Pick a tab-"
					newOption.text ="Select a tab:"
	
	
					optionsTabs.appendChild(newOption);

			for (let tab of tabs) { // loop over all the tabs
				await addNewOption(tab);
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
//get all the tabs
checkbox.addEventListener('change', function() {
	//If checkbox is on 
	if (checkbox.checked == true) {
		buttonOffPro();
	} else {
		buttonOnPro();
	}
  });
  async function startUp(){
	let muteButton = await browser.storage.local.get('status');
	muteButton = muteButton['status'];

	if(muteButton=="On"){
		document.body.classList = "bodyOnNot";

	}
	else{
		document.body.classList = "bodyOffNot";
	}

	if(muteButton=='Off'){
		checkbox.checked = true;
		
	}else{
	
		checkbox.checked = false;
		
	}

}  

function buttonOnPro(){
	browser.storage.local.set({ status:"On" });
	document.body.classList = "bodyOn";
	
}


function buttonOffPro(){
	browser.storage.local.set({ status:"Off" });
	document.body.classList = "bodyOff";
	
}
