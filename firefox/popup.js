const optionsTabs = document.getElementById("select")
const choicePicked = document.querySelector("#picked")
let mainTab = null;
queryTabs();

async function getTab(tabId) {
  if (tabId === null) return null;
  let tab = await browser.tabs.get(parseInt(tabId));
  return tab;
}

//To check which tab did the user picked:

optionsTabs.addEventListener('change', async (event) => {
  // console.log(event.target.value);
  let newOptionId = event.target;
  console.log(newOptionId.value);
  mainTab = newOptionId.value;
  let myTab = await getTab(mainTab);
  choicePicked.innerText = myTab.title;
  // console.log(getTab(mainTab).title);
  browser.storage.local.set({ choice: mainTab, choiceTitle: myTab.title }, function () {
    console.log('Picked Tab is :', choicePicked.innerText);
  });
})

async function addNewOption(tab) {
  // console.log(`Adding a new tab : ${tab.title}`);
  // console.log('---------');
  mainTab = await browser.storage.local.get('choice');
  mainTab = mainTab['choice'];
  // console.log(typeof (mainTab));
  // console.log(mainTab);
  if (mainTab !== null)
    mainTab = parseInt(mainTab);

  // console.log('hereeee', mainTab, tab.id);
  let newOption = document.createElement('option');
  newOption.value = tab.id;
  newOption.text = tab.title;
  if (mainTab !== null && mainTab === tab.id) {
    // console.log('here');
    newOption.selected = true;
    // alert(mainTab)
  }
  // console.log('---------');
  optionsTabs.appendChild(newOption);

}

async function queryTabs() {

  let mainTabTitle = await browser.storage.local.get('choiceTitle');

  if (mainTabTitle !== null)
    choicePicked.innerText = mainTabTitle['choiceTitle'];
  // console.log()
  if (optionsTabs.innerHTML !== '')
    optionsTabs.innerHTML = '';
  browser.tabs.query({})
    .then((tabs) => {
      for (let tab of tabs) {
        addNewOption(tab);
      }
      // console.log('yeah all tabs added !!');
    });
}

//update the current tablist
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
