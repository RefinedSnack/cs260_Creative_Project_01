const CLIENT_ID = "0DFaMhGHCJ";

function onClick(e) {
    e.preventDefault();
    
    // setup URL
    let url = "https://api.boardgameatlas.com/api/" + "search?name=Catan&client_id=" + CLIENT_ID;
    url = "https://api.boardgameatlas.com/api/search?name=Catan&client_id=0DFaMhGHCJ"
    // call API
    fetch(url)
      .then(function(response) {
        // make sure the request was successful
        if (response.status != 200) {
          return {
            text: "Error calling the API service: " + response.statusText
          }
        }
      }).then(function(json) {
        // update DOM with response
        updateResult(json.text);
      });
  }
  
  function updateResult(info) {
    document.getElementById('result').textContent = info;
  }
  window.onload=function(){
    document.getElementById("gameSubmit").addEventListener("click", onClick);
}
  