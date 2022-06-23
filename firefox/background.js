let mainTab = null;

// get the current tabs and mute them if the maintab is active, and if not unmute them 
async function querybrowser() {
  tab = await getTab(mainTab);
  if (tab) {
    tab = tab.title;
  }
  console.log("here inside", tab);

  browser.tabs.query({})
    .then(async (tabs) => {
      let mainTabState = await getTab(mainTab);
      if (mainTabState === null) return;
      mainTabState = mainTabState.audible;
      console.log(mainTabState);
      for (let tab of tabs) {
        if (tab.id !== mainTab && mainTabState) {
          toggleMute(tab.id, true);
        } else {
          toggleMute(tab.id, false);
        }
      }
    });
}

// get the tab from the tab id
async function getTab(tabId) {
  if (tabId === null) return null;
  if (typeof (tabId) !== `string` && typeof (tabId) !== `number`) { console.log(typeof (tabId)); return null; }
  let tab = await browser.tabs.get(parseInt(tabId));
  return tab;
}

// take the tab to be toggled, and its newstate
async function toggleMute(tabId, state = true) {
  let currTab = await getTab(tabId);
  if (currTab === null || currTab.muted === state) return;
  await browser.tabs.update(tabId, { muted: state });
}

// Set the initial empty tab
browser.storage.local.set({ choice: null });

// when the user select a new tab, chage it to the current tab
browser.storage.onChanged.addListener(async function (changes) {

  console.log(changes['choice']);
  var newTitle = changes['choice']['newValue'];
  var oldTitle = changes['choice']['oldValue'];
  console.log(`New title is : ${newTitle}`);
  console.log(`Old title is : ${oldTitle}`);
  if (newTitle !== oldTitle) {
    if (mainTab !== null) {
      return;
    }
    mainTab = parseInt(newTitle);
    console.log('mainTap is :', mainTab);
    toggleMute(mainTab, false);
    await querybrowser();
  }
});


// calling if a new tab is created, add it and mute it if needed.
browser.tabs.onCreated.addListener(async function () {
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
  console.log('updated', tabid, mainTab);
  await querybrowser();
}, {
  properties: ["audible"]
});

// calling the main functions
querybrowser();
