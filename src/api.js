export const BASEURL = "http://localhost:8080/";

export function callApi(reqmethod, url, data, responseHandler) {
  var option;
  if (reqmethod === "GET" || reqmethod === "DELETE")
    option = { method: reqmethod, headers: { 'Content-Type': 'application/json' } };
  else
    option = { method: reqmethod, headers: { 'Content-Type': 'application/json' }, body: data };

  fetch(url, option)
    .then(response => {
      if (!response.ok)
        throw new Error(response.status + " " + response.statusText);
      return response.text(); // change to .json() if backend returns JSON
    })
    .then(data => responseHandler(data))
    .catch(error => alert(error));
}

export function setSession(sesname, sesvalue, expday) {
  let D = new Date();
  D.setTime(D.getTime() + expday * 86400000);
  document.cookie = `${sesname}=${sesvalue};expires=${D.toUTCString()};path=/;secure`;
}

export function getSession(sesname) {
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookiedata = decodedCookie.split(';');
  for (let c of cookiedata) {
    c = c.trim();
    if (c.startsWith(sesname + '=')) {
      return c.substring(sesname.length + 1);
    }
  }
  return "";
}
