


function queryChrome(){

  chrome.tabs.query(
      {},
          function(tabs){
          

          for(let i = 0; i<tabs.length;i++){
           
           
               
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

});
}


function unToggleMuteState(tabId) {
chrome.tabs.get(tabId, async (tab) => {
  let muted = false;

  await chrome.tabs.update(tabId, { muted });
  

});
}









function tabsReturner(listOfTabs){

chrome.storage.local.set({tabsReturned: listOfTabs}, function() {

});


}



chrome.tabs.onCreated.addListener(
function(){
queryChrome()
keepItFlow()
console.log("created")


}
)

chrome.tabs.onRemoved.addListener(
function(){
queryChrome()
keepItFlow()

}
)


chrome.tabs.onMoved.addListener(
function(){
queryChrome()
keepItFlow()

}
)

chrome.tabs.onUpdated.addListener(
function(){
  queryChrome()
  keepItFlow()
  console.log("muted")
}
)


chrome.storage.local.set({choice: " "}, function() {

});





chrome.storage.onChanged.addListener(
(function(changes){


    let newTitle= changes['choice']['newValue']
    let oldTitle= changes['choice']['oldValue']
    
    if(newTitle!= oldTitle){

      unMuteTabs()

    }


     
      getID(newTitle);

    
     


 



 

})
)





async function getID(title){



tabsInfo  = await tabsQuery()

for (let i=0; i<tabsInfo.length; i++){

if (tabsInfo[i].title== title){

  chrome.storage.local.set({titleID: tabsInfo[i].id}, function() {

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




let tabsInfo = await tabsQuery()

for(let i =0; i<tabsInfo.length; i++){


if(tabsInfo[i].id == lectureID && tabsInfo[i].audible==true)
{

muteTabs(lectureID)

}
else if(tabsInfo[i].id == lectureID && tabsInfo[i].audible==false){

unMuteTabs(lectureID)
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


async function unMuteTabs(){

tabsInfo = await tabsQuery()

for(let i=0; i <tabsInfo.length; i++){


  unToggleMuteState(tabsInfo[i].id)




}


}


getID("")
queryChrome()