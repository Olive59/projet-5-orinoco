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