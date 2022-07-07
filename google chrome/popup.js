let numberOfTabs = document.querySelector("#tabsAvaliable")


let optionsTabs = document.querySelector("#select")





//To check which tab did the user picked:
optionsTabs.addEventListener('change',(event)=>{

console.log(`User picked: ${event.target.value}`)


chrome.storage.local.set({choice:event.target.value}, function() {
  console.log('Value of choice :',event.target.value);
});
})







  function queryChrome(){
    console.log("test")
    chrome.storage.local.get(['tabsReturned'], function(result) {
        console.log('Value currently is ' + result.key);

        showOptionsToUser(result.tabsReturned)

      });
      

}





function showOptionsToUser(options){
  optionsTabs.innerHTML=''






  for(let i=0; i< options.length;i++){

var option = document.createElement('option');
option.value = options[i].title
option.text = options[i].title

optionsTabs.appendChild(option)

  }


}


chrome.tabs.onCreated.addListener(
  function(){
   queryChrome()
   console.log("Done 2!!!")
 
 }
 )


 chrome.tabs.onRemoved.addListener(
   function(){
   queryChrome()
   console.log("Done 2!!!")
 
 }
)


chrome.tabs.onUpdated.addListener(
  function(){
    queryChrome()
   
  
  }
)



 queryChrome()


