function getFromAPI(url) {
  return new Promise(function (resolve, reject) {
    let req = new XMLHttpRequest()
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
        if (req.status == 200) {
          resolve(req.responseText)
        } else {
          reject(req)
        }
      }
    };
    req.open('GET', url, true);
    req.send(null);
  })
}

function postToAPI(url, product) {
  return new Promise(function (resolve, reject) {
    let req = new XMLHttpRequest()
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
        if (this.readyState = 201) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(req)
        }
      }
    }
    req.open('POST', url, true);
    request.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(product));
  })

}