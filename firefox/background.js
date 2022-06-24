let mainTab = null; //mainTab Id

// get the current tabs and mute them if the maintab is active, and if not unmute them 
async function querybrowser() {
  console.log("hehehehehheheheheh")
  browser.tabs.query({})
    .then(async (tabs) => {
      let mainTabState = await getTab(mainTab);
      if (mainTabState === null) return;
      mainTabState = mainTabState.audible;
      for (let tab of tabs) {
        if (tab.id !== mainTab && mainTabState) {
          toggleMute(tab.id, true);
        } else {
          if (tab.muted || tab.MutedInfoReason !== 'user')
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

  let newTitle = changes['choice']['newValue'];
  let oldTitle = changes['choice']['oldValue'];
  if (newTitle !== oldTitle) {
    mainTab = parseInt(newTitle);
    toggleMute(mainTab, false);
    await querybrowser();
  }
});


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
}, {
  properties: ["audible"]
});

// calling the main functions
querybrowser();
