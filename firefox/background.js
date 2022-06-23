let mainTab = null;

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

async function getTab(tabId) {
  if (tabId === null) return null;
  if (typeof (tabId) !== `string` && typeof (tabId) !== `number`) { console.log(typeof (tabId)); return null; }
  let tab = await browser.tabs.get(parseInt(tabId));
  return tab;
}

async function toggleMute(tabId, state = true) {
  let currTab = await getTab(tabId);
  if (currTab === null || currTab.muted === state) return;
  if (tabId === mainTab) return;
  await browser.tabs.update(tabId, { muted: state });
}

function tabsInfo(listOfTabs) {
  browser.storage.local.set({ tabsReturned: listOfTabs }, function () {
    console.log('Value is set to ' + listOfTabs);
  });
}


function keepItFlow() {
  id = browser.storage.local.get(['titleID'], function (result) {
    browser.tabs.query({ audible: true }, function (tabs) {
      console.log(tabs);
    });
  });
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
      // mainTab.removeEventListener('onUpdated');
    }
    console.log('***************');
    console.log(mainTab);
    console.log('***************');
    mainTab = parseInt(newTitle);
    // mainTab.addEventListener('onUpdated', keepItFlow());
    console.log('mainTap is :', mainTab);
    await querybrowser();
  }
});

// calling querybrowser
browser.tabs.onCreated.addListener(async function () {
  await querybrowser();
});
// browser.tabs.onRemoved.addListener(function () {
//   // check if the deleted tab is the mainTab
//   querybrowser();
// });
// browser.tabs.onMoved.addListener(function () {
//   querybrowser();
// });
const filter = {
  properties: ["audible"]
};
// only check if the maintab were chenged
browser.tabs.onUpdated.addListener(async function (tabid) {
  mainTab = await browser.storage.local.get('choice');
  mainTab = mainTab['choice'];
  if (mainTab === null) return;
  mainTab = parseInt(mainTab);
  console.log('updated', tabid, mainTab);
  await querybrowser();
}, filter);
// calling the main functions
querybrowser();
