chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
        clickPlanet();
    }
  }
);

var refreshTime = 60000
var calculationDelay = 10000

function clickPlanet() {
    clickButton();
    var myInterval = setInterval(function(){
        clickButton(myInterval);
    },refreshTime);
}

function clickButton(myInterval = null) {
    var planets = document.getElementsByClassName("pin-search-btn"),
        randomplanet = Math.floor(Math.random() * planets.length),
        clickplanet = planets[randomplanet];
    clickplanet.click();

    var now = new Date();
    setTimeout(function(){
        var availableSlots = document.querySelectorAll('div.slots-box:not(.no-available):not(.no-seat)').length;
        var not_allocated = document.getElementsByClassName('slots-box no-available').length;
        var booked = document.getElementsByClassName('slots-box no-seat').length;

        var print = new Print(convertUTCDateToLocalDate(now), availableSlots, not_allocated, booked);
        console.table(print);

        if(availableSlots > 0){
            if(myInterval != null){
                clearInterval(myInterval);
            }
            myPlay();
            console.log("Execution Stopped")
        }
    }, calculationDelay);
}

function myPlay(){
    var myAudio = new Audio(chrome.runtime.getURL("siren.mp3"));
    myAudio.loop = true
    myAudio.play();
}

function convertUTCDateToLocalDate(date) {
    let options = {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    },
    formatter = new Intl.DateTimeFormat([], options);
    return formatter.format(date).toUpperCase()
}

function Print(time, available, unallocated, booked) {
  this.time = time;
  this.available = available;
  this.unallocated = unallocated;
  this.booked = booked;
}
