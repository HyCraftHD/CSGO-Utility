var maps = document.querySelector("#maps")

var infernoMap = document.querySelector("#map .inferno")

infernoMap.hidden = true

// Inferno stuff
document.querySelector("#maps .inferno").onclick = function() {
    maps.hidden = true
    infernoMap.hidden = false

    loadInferno()
}

async function loadInferno() {
    var ctx = document.querySelector("#map .inferno canvas").getContext("2d")

    var background = new Image;    
    background.onload = function() {
        ctx.drawImage(this, 0, 0, 1000, 1000);

        var smoke = new Image;    
        smoke.onload = function() {
            ctx.drawImage(this, 100, 0, 30, 30);
        };
        smoke.onclick = function() {
            console.log("CLICKeD")
        }
        smoke.src = "./assets/img/smoke.png";
    };
    background.src = "./assets/img/de_inferno_map.png";

    let apps = await loadJson("inferno/smokes/apps")
    console.log(apps)
}


async function loadJson(file) {
    let url = "./assets/json/" + file + ".json"
    let obj = await (await fetch(url)).json()
    return obj
}