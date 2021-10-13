var database_url = "/game-database.json";
var gameList;
var gameTable;
fetch(database_url).then(function(response) {
    if (response.status != 200) {
        return {
          text: "Error Loading the list of games: " + response.statusText
        }
      }
    return response.json(); 
}).then(function(json) {
  // update DOM with response
  gameList = json.gameList;
  gameTable = json.gameIdTable;
  updateResult(json.text);
});

function lookup(name) {
    for (let i = 0; i < gameList.length; i++) {
        //console.log(gameList[i]);
        var stripped = name.replace(/\s+/g, '');
        stripped = stripped.toLowerCase();
        //console.log(stripped);
        if ((gameList[i].toLowerCase() === stripped)) {
            return gameTable[i].gameId;
        }
    }
    return "not found";
}

function onClick(e) {
    let gameWanted = document.getElementById('gameInput').value;
    e.preventDefault();

    //ensure that game is in bounds
    var gameID = lookup(gameWanted);
    if (gameID === "not found") {
        console.log(gameWanted, gameID);
        suggestGames(gameWanted);
        return "try again";
    }

    // setup URL
    url = "https://bgg-json.azurewebsites.net/thing/" + gameID;
    // call API
    fetch(url)
      .then(function(response) {
        // make sure the request was successful
        if (response.status != 200) {
          return {
            text: "Error calling the API service: " + response.statusText
          }
        }
        return response.json(); 
      }).then(function(json) {
        updateResult(json);
      });      
}
  
//TODO add the stuff here. Info
  function updateResult(info) {
    console.log(info);
    var result = "";
    document.getElementById('result').innerHTML = result;
  }


  window.onload=function(){
    document.getElementById("gameSubmit").addEventListener("click", onClick);
  }

  function suggestGames(guess) {
      var result = "";
      result += "<center><p>" + guess + " wasn't a valid game title, try one of these instead!</p></center>";
      result += "<center><table style=\"border-collapse: unset;\">";
      const NUM_COLS = 3;
      for (let i = 0; i < gameList.length; i += NUM_COLS) {
          result += "<tr>";
          for (let j = 0; j < NUM_COLS; j++) {
              if (i+j < gameList.length)
                result += "<td>"+gameList[i+j]+"</td>";
            }
            result += "</tr>";
      }
      result += "</center></table>";

      document.getElementById('result').innerHTML = result;
  }
