


function queryChrome(){

    chrome.tabs.query(
        {currentWindow: true},
            function(tabs){
              console.log(tabs)

            for(let i = 0; i<tabs.length;i++){
             
                  console.log(i.toString()+": "+tabs[i].url)
                  console.log("Is audible : "+tabs[i].audible)
                  console.log("Tab id  : "+tabs[i].id)
                 
                   // toggleMuteState(tabs[4].id)
                    tabsInfo(tabs)
                  
            }


            }



      )

}



function toggleMuteState(tabId) {
    chrome.tabs.get(tabId, async (tab) => {
      let muted = !tab.mutedInfo.muted;
      await chrome.tabs.update(tabId, { muted });
    });
  }







function tabsInfo(listOfTabs){

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
   
  
  }
)


chrome.storage.local.set({choice: " "}, function() {
  console.log('Value of choice : ');
});





chrome.storage.onChanged.addListener(
  (function(changes){


    console.log(changes['choice'])

   
      var newTitle= changes['choice']['newValue']
      var oldTitle= changes['choice']['oldValue']
   console.log(`New title is : ${newTitle}`)
   console.log(`Old title is : ${oldTitle}`)

       if(newTitle != oldTitle){
        getID(newTitle);

        console.log("Ran getID")
       }
 

   



   

  })
)





function getID(title){









    chrome.tabs.query(
      {},
          function(tabs){
            console.log(tabs)
          for(let i = 0; i<tabs.length;i++){
            
            if (tabs[i].title== title){
             const lmfao = 'chrome'
            
              chrome.storage.local.set({titleID: tabs[i].id}, function() {
                console.log('Value is set to ' + tabs[i].id);
              });




           
          
  
            }
           
                
          }
          keepItFlow()
          
  
          }
  
  
  
    )






 
  


}





async function  keepItFlow(){

let value;
 value = await chrome.storage.local.get(['titleID']).then(

result => result.titleID

 )


console.log(value)









}



getID("")
queryChrome()