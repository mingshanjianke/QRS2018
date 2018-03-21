/**
 * Created by user on 2017/6/21.
 */
function onWindowLoad(){
    var root=document.getElementById('root');
    var url;
    chrome.tabs.getSelected(null, function(tab){
        url=tab.url;
    });
    root.innerHTML=url;
    //function myFunction(tablink) {
    //    // do stuff here
    //    root.innerHTML=url;
    //}
}
window.onload=onWindowLoad;