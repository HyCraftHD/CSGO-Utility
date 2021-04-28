function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=')
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
    }
    return query
}

function replaceHistory(key, value) {
    window.history.replaceState('', '', updateQueryParameter(window.location.href, key, value))
}

function addHistory(key, value) {
    window.history.pushState('', '', updateQueryParameter(window.location.href, key, value))
}

function updateQueryParameter(url, key, value) {
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != key){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + key + "=" + value;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}