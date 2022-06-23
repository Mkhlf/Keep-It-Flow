


function queryChrome(){

    chrome.tabs.query(
        {},
            function(tabs){
              console.log(tabs)

            for(let i = 0; i<tabs.length;i++){
             
                  console.log(i.toString()+": "+tabs[i].url)
                  console.log("Is audible : "+tabs[i].audible)
                  console.log("Tab id  : "+tabs[i].id)
                 
                   // toggleMuteState(tabs[4].id)
                  
                  
                  
            }
            tabsReturner(tabs)

            }



      )

}



function toggleMuteState(tabId) {
  chrome.tabs.get(tabId, async (tab) => {
    let muted = true;
    
    await chrome.tabs.update(tabId, { muted });
    console.log(`Should be muted`)
  });
}


function unToggleMuteState(tabId) {
  chrome.tabs.get(tabId, async (tab) => {
    let muted = false;
  
    await chrome.tabs.update(tabId, { muted });
    console.log(`Should be unmuted`)
  });
}









function tabsReturner(listOfTabs){

  chrome.storage.local.set({tabsReturned: listOfTabs}, function() {
    console.log('Value is set to ' + listOfTabs);
  });


}



chrome.tabs.onCreated.addListener(
  function(){
  queryChrome()
 

}
)

chrome.tabs.onRemoved.addListener(
  function(){
  queryChrome()


}
)


chrome.tabs.onMoved.addListener(
  function(){
  queryChrome()
 

}
)

chrome.tabs.onUpdated.addListener(
  function(){
    queryChrome()
    keepItFlow()
  
  }
)


chrome.storage.local.set({choice: " "}, function() {
  console.log('Value of choice : ');
});





chrome.storage.onChanged.addListener(
  (function(changes){

   console.log(changes)
      var newTitle= changes['choice']['newValue']
      


       
        getID(newTitle);

        console.log("Ran getID")
       
 

   



   

  })
)





async function getID(title){



tabsInfo  = await tabsQuery()

for (let i=0; i<tabsInfo.length; i++){
 
  if (tabsInfo[i].title== title){
 
    chrome.storage.local.set({titleID: tabsInfo[i].id}, function() {
      console.log('Value is set to ' + tabsInfo[i].id);
    });

  }


}
keepItFlow()




 
  


}







async function  keepItFlow(){

let lectureID;
 lectureID = await chrome.storage.local.get(['titleID']).then(

result => result.titleID

 )

console.log("The lecture id is : ",lectureID)


let tabsInfo = await tabsQuery()

for(let i =0; i<tabsInfo.length; i++){


if(tabsInfo[i].id == lectureID && tabsInfo[i].audible==true)
{
  console.log("is running")
  muteTabs(lectureID)

}
else{
  console.log("is bruh ")
 // unMuteTabs(lectureID)
}

}







}



async function tabsQuery(){


  let tabs = await chrome.tabs.query({}).then(
    result =>  result
     )
return tabs



}







async function muteTabs(lectureID){


 
tabsInfo = await tabsQuery()

for(let i=0; i <tabsInfo.length; i++){

if(tabsInfo[i].id!=lectureID && tabsInfo[i].audible  == true){

  toggleMuteState(tabsInfo[i].id)


}


}


}


async function unMuteTabs(lectureID){

  tabsInfo = await tabsQuery()

  for(let i=0; i <tabsInfo.length; i++){





  if(tabsInfo[i].id!=lectureID && tabsInfo[i].audible  == true){

    unToggleMuteState(tabsInfo[i].id)
  
  
  }
  
  
  }


}


getID("")
queryChrome()