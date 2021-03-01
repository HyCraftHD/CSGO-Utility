function loadMap(map) {
    map = new UtilityMap("map", "de_inferno")
    map.loadPoints()
}

function disableOverlay() {
    //document.getElementById("overlay").style.display = "none";
    document.querySelector("#overlay").style.display = "none";
}