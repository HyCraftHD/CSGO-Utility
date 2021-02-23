var maps = document.querySelector("#maps")

var infernoMap = document.querySelector("#map .inferno")

infernoMap.hidden = true

// Inferno image action
document.querySelector("#maps .inferno").onclick = function() {
    maps.hidden = true
    infernoMap.hidden = false
}