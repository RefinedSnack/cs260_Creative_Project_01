var database_url = "/json/Massive-Database.json";
//var database_url = "/json/Small-Database.json";
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
  gameTable = json.gameIdTable;
  updateResult(json.text);
});

function lookup(name) {
  var stripped = name.replace(/\s+/g, '');
  stripped = stripped.toLowerCase();
    for (let i = 0; i < gameTable.length; i++) {
        //console.log(gameList[i]);
        var strippedTrueName = gameTable[i].name.replace(/\s+/g, '');;
        strippedTrueName = strippedTrueName.toLowerCase();
        //console.log(stripped);
        if (strippedTrueName === stripped) {
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
    //url = "https://bgg-json.azurewebsites.net/boardgame/" + gameID;
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

  function pick30RandomGames()
  {
    var out = [];
    let i = 0;
    while (i < 30)
    {
      var num = Math.floor(Math.random() * gameTable.length);
      for (let y in out)
      {
        if (num === y) {
          continue;
        }
      }
      out.push(num);
      i++;
    }
    return out;
  }

  function suggestGames(guess) {
      var result = "";
      if (guess != "")
        result += "<center><p><strong>" + guess + "</strong> wasn't a valid game title<br>Try one of these instead!</p></center>";
      else
        result += "<center><p>Here are some random games to take a look at!</p>";
      result += "<center><table style=\"border-collapse: unset;\">";
      const NUM_COLS = 3;
      let SuggestedGames = pick30RandomGames();
      for (let i = 0; i < SuggestedGames.length; i += NUM_COLS) {
          result += "<tr>";
          for (let j = 0; j < NUM_COLS; j++) {
            result += "<td>"+gameTable[SuggestedGames[i+j]].name+"</td>";
          }
          result += "</tr>";
      }
      result += "</center></table>";

      document.getElementById('result').innerHTML = result;
  }


