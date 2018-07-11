console.log("Designed by Ragy and Seb.");

// User input variables
var firstInput;
var currentInput;
var prevInputs = [];

//Global Playlists
var playlist = []; //stores the generated playlist [radio]
var userPlaylist = []; //stores current user top tracks

// Settings Variables
var minFollowers = 0;
var maxFollowers = 10000000;
var showNames = false;

// Player variables
var playerOpen = false;
var currentTrackId;
var currentIndex;
var addedListener = false;
var userMode = false;
var playlistMode = false;
var navigationMode = false;
var globalTrackIndex;
var currentPlayingArtist;
//Global node index
var nodeIndex = 0;

// Main nodes
var source;
var followings = [];

//Cache variables
var cachedArray = [];

// Random artist loading
var recommendedArtists = [
  "ragyhaddad",
  "im-seb",
  "fkj-2",
  "samgellaitry",
  "soulection",
  "stillwoozy",
  "kaytranada",
  "polo-pan",
  "flamingosis",
  "masegomusic",
  "harvey-sutherland",
  "phazzmusic",
  "bobby-analog",
  "kerokerobonito",
  "giraffage",
  "starro",
  "ofwgkta-official",
  "tommisch",
  "noname",
  "mujobeatz",
  "astronautico",
  "phonogramme"
];

//send mail

function sendMail(){
   window.location.href = "mailto:ragy202@gmail.com";
}


// Contact
function openContact(){
  $(".contact").css("opacity", "1").css("visibility", "visible");
  setTimeout(() => {
    $('.contact-modal').css('opacity', '1');
    $('.contact-modal').css('transform', 'translate(0px,0px)');
  }, 200);
}
$(".contact-background").on("click", () => {
  $(".contact").css("opacity", "0").css("visibility", "hidden");
  setTimeout(() => {
    $(".contact-form-input").val("");
    $(".contact-form textarea").val("");
    $('.contact-modal').css('opacity', '0');
    $('.contact-modal').css('transform', 'translate(0px, -15px)');
  }, 500);
});


// Tutorial
let divOrder = ["#sidebar", "#search-button", "#favorite-button", "#random-button", "#radio-button", "#player-button", "#settings-button", "#contact-button"];
let divAlignV = ["bottom", "bottom", "bottom", "bottom", "bottom", "bottom", "top", "top"];
let divAlignH = ["left", "left", "left", "left", "left", "left", "right", "right"];
let pointerAlignV = ["top", "bottom", "bottom", "bottom", "bottom", "bottom", "top", "top"];
let pointerAlignH = ["left", "left", "left", "left", "left", "left", "right", "right"];
let divPosX = ["204", "430", "430", "430", "430", "14", "75", "75"];
let divPosY = ["275", "15", "65", "115", "215", "325", "65", "15"];
let pointerPosX = ["30", "-5", "-5", "-5", "-5", "15", "-5", "-5"];
let pointerPosY = ["-5", "15", "15", "15", "15", "-5", "15", "15"];
let divText = [
  "Here you can see the artist you are currently viewing.",
  "You can search for various soundcloud artists using this button.",
  "You can view our favorite hand-picked artists using this button.",
  "You can navigate to a random soundcloud user using this button",
  "This button starts a continuous radio based on the current artists likes.",
  "This button opens and closes the music player.",
  "This button allows you to adjust the settings of the graph.",
  "Please feel free to ask us anything by sending us an email!"
]
let tutorialCount = 0;
let prevZIndex;
$(".start-tutorial").on("click", startTutorial);
$(".skip-tutorial").on("click", () => {
  $(".tutorial").css("opacity", "0").css("visibility", "hidden");
  $(".tutorial-background").css("opacity", "0").css("visibility", "hidden");
});
function startTutorial() {
  $("#click-block").css("display", "inline-block");
  $(".tutorial-intro").css("display", "none");
  $(".tutorial-block").css("display", "inline-block");
  nextSection();
}
$("#tutorial-next").on("click", nextSection);
function nextSection(){
  if(tutorialCount >= divOrder.length-1){
    $("#tutorial-next")[0].innerHTML = "Finish";
    $("#tutorial-next-2")[0].innerHTML = "";
  }
  if(tutorialCount >= divOrder.length){
    $(".tutorial").css("display", "none");
    $(".tutorial-background").css("display", "none");
  }
  $(".tutorial-block").css("left", "");
  $(".tutorial-block").css("right", "");
  $(".tutorial-block").css("top", "");
  $(".tutorial-block").css("bottom", "");
  $(".tutorial-pointer").css("left", "");
  $(".tutorial-pointer").css("right", "");
  $(".tutorial-pointer").css("top", "");
  $(".tutorial-pointer").css("bottom", "");
  if(tutorialCount > 0){
    $(divOrder[tutorialCount-1]).css("z-index", prevZIndex);
    $(divOrder[tutorialCount-1]).removeClass("shadow");
  }
  $(".tutorial-text")[0].innerHTML = divText[tutorialCount];
  $(".tutorial-block").css(divAlignH[tutorialCount], divPosY[tutorialCount]);
  $(".tutorial-block").css(divAlignV[tutorialCount], divPosX[tutorialCount]);
  $(".tutorial-pointer").css(pointerAlignH[tutorialCount], pointerPosY[tutorialCount]);
  $(".tutorial-pointer").css(pointerAlignV[tutorialCount], pointerPosX[tutorialCount]);
  prevZIndex = $(divOrder[tutorialCount]).css("z-index");
  $(divOrder[tutorialCount]).css("z-index", "500");
  $(divOrder[tutorialCount]).addClass("shadow");
  console.log($(divOrder[tutorialCount]));
  tutorialCount++;
}

function skipTutorial(){
  $(".tutorial").css("display", "none");
  $(".tutorial-background").css("display", "none");
}
/* ON PAGE LOAD */
var randomNum = (Math.floor(Math.random() * recommendedArtists.length));
getBloomFavorites();




//MAIN

/* get a favorite from database */
function getBloomFavorites(username) {
  prevInputs = [];
  var randomNum = (Math.floor(Math.random() * recommendedArtists.length));
        $.get('https://bloom-api.tk/favorites',function(data,status){
            if (status == 'success'){
                getUser(data[0].username);
            }
            else{
                getUser(recommendedArtists[randomNum]);

            }

        })
}

/*
 *   Generate song urls from network
 */
function generatePlaylist() {
  playlistMode = true;
  userMode = false;
  playlist = [];
  $(".fast-forward")
    .css("transform", "translate(0px, 0px)")
    .css("opacity", "1");
  $('.current-playing')
    .css("transform","translate(0px,0px)")
    .css("opacity","1");
    generatePlaylistLikes(); //grab some tracks from source likes

}

/*
 * Generate a playlist from the source user likes
 */
function generatePlaylistLikes() {
  userMode = false;
  playlistMode = true;
  // playlist = [];
  var proxy = 'https://cors-anywhere.herokuapp.com/';
  var userURL = 'https://api-v2.soundcloud.com/users/' + source.id + '/likes?client_id=eiY2lrXv0r5RR6UXfyjrfdwxzmgKqreK&limit=20&offset=0&linked_partitioning=1&app_version=1528191385&app_locale=en';
  var fullURL = proxy + userURL;
  $.get(fullURL, function(data, status) {
    for (var x = 0; x < data.collection.length; x++) {
      if (data.collection[x].playlist) {
        continue;
      }
      var trackID = data.collection[x].track.id;
      if (!(trackID === null)) {

          var trackObject = {
          track_id: data.collection[x].track.id.toString(),
          node_id: data.collection[x].track.user.permalink
        };
        playlist.push(trackObject);
      }
    }
    playPlaylist();

  });
}


/*
* Navigate to current artist playing
*/
function goToCurrentPlaying (){
  getUser(currentPlayingArtist);
}

/*
 *   Plays the generated playlist from the graph
 */
function playPlaylist() {
  var newTrackId = playlist[0].track_id;
  /* Set current track ID */
  currentTrackId = newTrackId;
  globalTrackIndex = 0;
  var currentIndex = playlist.map(function(e) {
    return e.track_id;
  }).indexOf(currentTrackId);
  currentPlayingArtist = playlist[currentIndex].node_id;
  var numItems = $('.onPlay').length;
  var newPLayerSrc = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + newTrackId + '&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true';
  $(".player iframe")[0].src = newPLayerSrc;
  setTimeout(openPlayer, 500);
  playerOpen = true;
}

/*
 * Switch to next song in global variable playlist and color the node playing currently
 */
function nextSong() {
  if (userMode == true) {
    var currentIndex = userPlaylist.map(function(e) {
      return e.track_id;
    }).indexOf(currentTrackId);
    var nextSongId = userPlaylist[currentIndex + 1].track_id;

  } else if (playlistMode == true) {
    var currentIndex = playlist.map(function(e) {
      return e.track_id;
    }).indexOf(currentTrackId);
    var nextSongId = playlist[currentIndex + 1].track_id;
    globalTrackIndex = currentIndex + 1;

  }
  if (nextSongId) {
    var newPLayerSrc = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + nextSongId + '&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true';
    currentTrackId = nextSongId;
    currentPlayingArtist = playlist[currentIndex + 1].node_id; //set current artist
    $(".player iframe")[0].src = newPLayerSrc;
    setTimeout(openPlayer, 500);
    playerOpen = true;
    return;
  } else {
    currentTrackId = nextSongId;

  }
}

/*
 * Switch to previous song in global variable playlist and color the node playing currently
 */
function previousSong() {
  if (userMode == true) {
    var currentIndex = userPlaylist.map(function(e) {
      return e.track_id;
    }).indexOf(currentTrackId);
    var nextSongId = userPlaylist[currentIndex - 1].track_id;
  } else if (playlistMode == true) {
    var currentIndex = playlist.map(function(e) {
      return e.track_id;
    }).indexOf(currentTrackId);
    var nextSongId = playlist[currentIndex - 1].track_id;
  }
  if (nextSongId) {
    var newPLayerSrc = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + nextSongId + '&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true';
    currentTrackId = nextSongId;
    $(".player iframe")[0].src = newPLayerSrc;
    setTimeout(openPlayer, 500);
    playerOpen = true;
    return;
  } else {
    currentTrackId = nextSongId;
  }
}

/*
 * Store in cache
 * @param {followings} - a followings object
 */
function setCache(followingsObject) {
  try {
    cachedArray.push(followingsObject);
    localStorage.setItem('cachedArray', JSON.stringify(cachedArray));
  }
  //If storage is full
  catch (error) {
    console.log('free some room in cache!>>>');
    cachedArray = [];
    localStorage.setItem('cachedArray', JSON.stringify(cachedArray));
  }
}

/*
 * Get cachedArray from cache
 * returns all cachedArray - array of objects
 */
function getCache() {
  var retrievedCache = localStorage.getItem('cachedArray');
  return retrievedCache;
}



/*
 *   Using fetch to get the user data.
 *   @param username - The username of the user.
 */
function getUser(username) {
  count = 0;
  // Pushing username to prevInputs tack
  prevInputs.push(username);
  // Resetting front end and user data
  resetUser();
  closeExplore();
  // Adjusting current input
  currentInput = username;
  // Fetching user data
  fetch('https://api.soundcloud.com/users/' + username + '?client_id=3Goi9X5NOF7g1ofGbmYEkpveejwvlqjd')
    .then((response) => {
      return response.json();
    })
    .then((userData) => {
      // Storing the source data in a global variable
      source = userData;
      // Updating user data.
      updateUser();
      // Searching followers

      //First check if user exists in cache before trigerring requets
      for (var x = 0; x < cachedArray.length; x++) {
        if (userData.id == cachedArray[x].cacheID) {
          followings = cachedArray[x];
          drawGraph();
          return;
        }
      }
      getFollowings('https://api.soundcloud.com/users/' + userData.id + '/followings?client_id=3Goi9X5NOF7g1ofGbmYEkpveejwvlqjd&limit=200');
    })
    .catch((error) => {
      console.log(error);
    });
}

/*
 *   Recursively getting user followings.
 *   @param url - The user url used to find followings.
 */
function getFollowings(url) {
  // Fetching follower data
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((followingData) => {
      // Pushing each follower
      for (var i = 0; i < followingData.collection.length; i++) {
        followings.push(followingData.collection[i]);
      }
      // Still need to fetch
      if (followingData.next_href != null) {
        ++count;
        if (count > 5) {
          followings.cacheID = source.id; //Set a cache id for comparison
          setCache(followings);
          drawGraph();
          return;
        }
        // Recursive call
        getFollowings(followingData.next_href);
      } else {
        //Set Cache using the followings [Ragy]
        followings.cacheID = source.id; //Set a cache id for comparison
        setCache(followings);
        // Done fetching, update svg
        drawGraph();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

/*
 *   Back button functionality
 */
function back() {
  if (prevInputs.length > 1) {
    prevInputs.pop();
    getUser(prevInputs.pop());
    $('.current-playing')
    .css("transform","translate(0px, 0px)")
    .css("opacity","1");
  }
}

/*
 *   Resets front end when searching a new user.
 */
function resetUser() {
  $(".current-user-label").css("opacity", "0");
  $(".current-user-label")[0].innerHTML = "";
  d3.select("svg").remove();
  if (prevInputs.length <= 1) {
    $('.back-button').css('transform', 'translate(-100px, 0px)');
    $('.back-button').css('opacity', '0');
  } else {
    $('.back-button').css('transform', 'translate(0px, 0px)');
    $('.back-button').css('opacity', '1');
  }
  $('.loading').css('display', 'flex');
  $('.user-info').css('visibility', 'hidden');
  $('.user-info').css('opacity', '0');
  $('.user-name')[0].innerHTML = "";
  $(".top-tracks").empty();
  d3.select("svg").remove();
  $('.tooltip').remove();
}

/*
 *   Takes data from search and updates user info.
 */
function updateUser() {
  $(".current-user-label")[0].innerHTML = 'Showing who <span class="label-bold">' + source.username + '</span> follows.';
  followings = [];
  $('.user-img').css('background-image', 'url(' + source.avatar_url + ')');
  $('.user-name')[0].innerHTML = source.username;
  $('.user-followers')[0].innerHTML = parseFollowers(source.followers_count) + " Followers";
  setTimeout(() => {
    $('.user-info').css('visibility', 'visible');
    $('.user-info').css('opacity', '1');
    $(".current-user-label").css("opacity", "1");
  }, 500);
  getTracks();
}


/*
 *   Parsing follower count.
 *   @param count - The number of followers.
 *   @return output - String representation of number.
 */
function parseFollowers(count) {
  var output;
  if (count < 1000) {
    output = Number(count).toFixed(0);
  } else if (count < 1000000) {
    output = Number(count / 1000).toFixed(1);
    output += "k";
  } else {
    output = Number(count / 1000000).toFixed(1);
    output += "m";
  }
  return output;
}



/*
 *   Getting user songs and adding them to the sidebar.
 */
function getTracks() {
  userPlaylist = [];
  // Getting track id's
  var userTracksUrl = 'https://api.soundcloud.com/users/' + source.id + '/tracks?client_id=3Goi9X5NOF7g1ofGbmYEkpveejwvlqjd';
  fetch(userTracksUrl)
    .then((response) => {
      return response.json();
    })
    .then((userData) => {
      // More than 3 songs
      if (userData.length > 3) {
        for (var i = 0; i < 3; i++) {
          var trackID = userData[i].id;
          var trackObject = {
            track_id: trackID.toString(),
            node_id: source.permalink
          };
          /* Populate playlist array [Ragy] */
          userPlaylist.push(trackObject);

          $('.top-tracks').append('<div class="track" trackid="' + trackID + '">' +
            '<div class="track-fade" trackid="' + trackID + '"></div>' +
            '<img src="./images/play.svg" trackid="' + trackID + '" draggable="false">' +
            '<p trackid="' + trackID + '">' + userData[i].title + '</p>' +
            '</div>');
        }
      } else { // Less than 3 songs
        for (var i = 0; i < userData.length; i++) {
          var trackID = userData[i].id;
          var trackObject = {
            track_id: trackID.toString(),
            node_id: source.permalink
          };
          userPlaylist.push(trackObject);
          $('.top-tracks').append('<div class="track"  trackid="' + trackID + '">' +
            '<div trackid="' + trackID + '" class="track-fade"></div>' +
            '<img src="./images/play.svg" trackid="' + trackID + '" draggable="false"/>' +
            '<p trackid="' + trackID + '">' + userData[i].title + '</p>' +
            '</div>');
        }
      }
    });
}

/*
 *   Loads the track into the player
 */
$('.top-tracks').on("click", (e) => {
  userMode = true;
  $(".fast-forward")
    .css("transform", "translate(-50px, 0px)")
    .css("opacity", "0");

  var newTrackId = $(e.target)[0].attributes.trackid.nodeValue;
  /* Set current track ID */
  currentTrackId = newTrackId;
  currentPlayingArtist = source.id;
  var newPLayerSrc = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + newTrackId + '&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true';
  $(".player iframe")[0].src = newPLayerSrc;
  setTimeout(openPlayer, 500);
  playerOpen = true;
  // turn off playlist mode
});

function openPlayer() {
  addListener();
  $(".player").css("transform", "translate(0, 0)");
  $(".player").css("opacity", "1");
}
function closePlayer() {
  $(".player").css("transform", "translate(0, 400px)");
  $(".player").css("opacity", "0");
}
$('.player-button').on("click", (e) => {
  if (!playerOpen) {
    openPlayer();
    playerOpen = true;
  } else {
    closePlayer();
    playerOpen = false;
  }
});

/*
 *   Random button functionality
 */
function random() {
  resetUser();
  // Reset prev inputs
  prevInputs = [];
  // Random user number
  var randomID = (Math.floor(Math.random() * 9999) + 90000);
  // Find new user
  fetch('https://api.soundcloud.com/users/' + randomID + '?client_id=3Goi9X5NOF7g1ofGbmYEkpveejwvlqjd')
    .then((response) => {
      return response.json();
    })
    .then((userData) => {
      // Search that user
      if (userData.followings_count > 10) {
        getUser(userData.permalink);
      } else {
        random();
      }
    })
    .catch((error) => {
      console.log(error);
      random();
    });
}

/*
 *   Handled the click to go to the artists profile.
 */
function goToProfile() {
  window.open('https://soundcloud.com/' + source.permalink, '_blank');
}

/*
 *   Explore users
 */
function explore() {
  $('.explore').css('display', 'flex');
  setTimeout(() => {
    $('.explore').css('opacity', '1');
  }, 10);
  setTimeout(() => {
    $('.input-2')[0].focus();
    $('.explore-modal').css('opacity', '1');
    $('.explore-modal').css('transform', 'translate(0px,0px)');
  }, 200);
}

/*
 *   Close the explore page.
 */
function closeExplore() {
  $('.explore').css('opacity', '0');
  setTimeout(() => {
    $('.explore').css('display', 'none');
    $('.explore-modal').css('opacity', '0');
    $('.explore-modal').css('transform', 'translate(0px,-15px)');
    $('.input-2')[0].value = "";
    $('.explore-results').empty();
  }, 500);
}

/*
 *   Fetches data from the cloud.
 *   @param searchTerm - The term to search.
 */
function searchCloud(searchTerm) {
  var proxy = 'https://cors-anywhere.herokuapp.com/';
  var url = 'https://api-v2.soundcloud.com/search/users?q=' + searchTerm + '&sc_a_id=1331a031-e3c8-415e-894d-f1458fcbe40a&variant_ids=1053&facet=place&user_id=851332-319840-3643-205054&client_id=lj8dF0xi5RcKDD1dLa6IOY6orLH3uBJW&limit=10&offset=0&linked_partitioning=1&app_version=1527169554&app_locale=en';
  var fullurl = proxy + url;
  fetch(fullurl)
    .then((response) => {
      return response.json();
    })
    .then((searchResults) => {
      if (searchResults.collection.length > 0) {
        displaySearchResults(searchResults.collection);
      } else {
        $('.no-results').css("display", "block");
        $('.explore-loader').css("display", "none");
      }
    })
    .catch((error) => {
      $('.explore-loader').css("display", "none");
      console.log(error);
    });
}

/*
 *   Displaying the search results
 */
function displaySearchResults(results) {
  $('.explore-results').empty();
  for (var i = 0; i < results.length; i++) {
    $('.explore-results').append('<li user=' + results[i].permalink + '>' +
      '<img src="' + results[i].avatar_url + '" draggable="false" user=' + results[i].permalink + '/>' +
      '<div class="search-user-info" user=' + results[i].permalink + '>' +
      '<p class="search-user-name" user=' + results[i].permalink + '>' + results[i].username + '</p>' +
      '<p class="search-user-follows" user=' + results[i].permalink + '>' + parseFollowers(results[i].followers_count) +
      ' Followers</p>' +
      '</div>' +
      '</li>');
  }
  setTimeout(() => {
    $('.explore-loader').css("display", "none");
  }, 500);
}
// Cick event for users
$('.explore-results').on("click", (e) => {
  prevInputs = [];
  getUser($(e.target)[0].attributes.user.nodeValue);
});

/*
 *   Starting the search.
 */
function startSearch() {
  $('.explore-results').empty();
  var searchTerm = $('.input-2')[0].value;
  $('.explore-loader').css("display", "block");
  $('.no-results').css("display", "none");
  searchCloud(searchTerm);
}
$('.input-2').keypress((key) => {
  if (key.which == 13) {
    startSearch();
  }
});

/*
 *   Get similar artists
 */
function getSimilarArtists() {
  fetch('https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=' + source.permalink + '&api_key=2f1cb405c26b74efc78f64e16606448a&format=json')
    .then((response) => {
      return response.json();
    })
    .then((similarArtists) => {
      if (similarArtists.similarartists.artist.length > 0)
        displaySimilarArtists(similarArtists.similarartists.artist);
    })
    .catch((error) => {
      console.log("No similar artist data.")
      console.log(error);
    });
}

/*
 *   Display the similar artists
 *   @param artists - An array of similar artists.
 */
function displaySimilarArtists(artists) {
  for (var i = 0; i < 3; i++) {
    console.log(artists[i].name);
  }
}

/*
 *   Opening settings
 */
function openSettings() {
  $('.settings').css("display", "flex");
  setTimeout(() => {
    $('.settings').css('opacity', '1');
  }, 10);
  setTimeout(() => {
    $('.settings-modal').css('opacity', '1');
    $('.settings-modal').css('transform', 'translate(0px,0px)');
  }, 200);
}

/*
 *   Closing settings
 */
function closeSettings() {
  adjustSettings();
  $('.settings').css('opacity', '0');
  setTimeout(() => {
    $('.settings').css('display', 'none');
    $('.settings-modal').css('opacity', '0');
    $('.settings-modal').css('transform', 'translate(0px,-15px)');
  }, 500);
}

/*
 *   Slider functions
 */
var slider = document.getElementById('range');
noUiSlider.create(slider, {
  start: [0, 10000000],
  connect: true,
  behaviour: 'drag',
  range: {
    'min': [0],
    '25%': [10000],
    '50%': [100000],
    '75%': [1000000],
    'max': [10000000]
  },
});
slider.noUiSlider.on('update', () => {
  var range = slider.noUiSlider.get();
  var min = range[0];
  var max = range[1];
  $(".settings-count")[0].innerHTML = parseFollowers(range[0]) + " - " + parseFollowers(range[1]) + " Followers";
});

/*
 *   Adjusting settings on close of menu.
 */
function adjustSettings() {
  var newSettings = slider.noUiSlider.get();
  if (minFollowers != newSettings[0] || maxFollowers != newSettings[1]) {
    minFollowers = newSettings[0];
    maxFollowers = newSettings[1];
    d3.select("svg").remove();
    drawGraph();
  }
}

/*
 *   show all node names when we need to
 */
function showNames() {

}

/*
 *   Takes all the data aquired by fetching and updates the svg.
 */
function drawGraph() {
  panZoom = 0;

  // Main graph variables
  var graphNodes = [];
  var graphLinks = [];

  // Adding the source node
  var sourceNode = {
    'username': source.username,
    'id': source.permalink,
    'followerCount': source.followers_count,
    'group': Math.floor(Math.random() * 9 * 1000)
  }
  graphNodes.push(sourceNode);

  // Adding following nodes
  for (var i = 0; i < followings.length; i++) {
    // Adding the node
    var followingNode = {
      'username': followings[i].username,
      'id': followings[i].permalink,
      'followerCount': followings[i].followers_count,
      'group': Math.floor(Math.random() * 9)
    }
    graphNodes.push(followingNode);
    // Adding the link
    var nodeLink = {
      'source': source.permalink,
      'target': followings[i].permalink,
      'value': Math.floor(Math.random() * 9)
    }
    graphLinks.push(nodeLink);
  }

  // Putting nodes and links together
  var graph = {
    'nodes': graphNodes,
    'links': graphLinks
  }

  //set array of global artists [Ragy]
  allArtists = graphNodes;

  // Scale for colors
  var colorArray = ['#636363', '#775E5E', '#8C5959', '#A15454', '#B54F4F', '#CA4A4A', '#DF4545', '#F44141'];
  var color = d3.scaleQuantize()
    .domain([0, 10000000])
    .range(colorArray);

  // Scale for sizes
  var myScale = d3.scalePow();
  myScale
    .exponent(0.2)
    .domain([0, 10000000])
    .range([2, 15]);

  // D3 Window size
  var width = window.innerWidth;
  var height = window.innerHeight;

  function zoomed() {
    svg.attr("transform", d3.event.transform);
  }

  // Creating main svg
  var svg = d3.select('.data-display').append('svg').attr('width', '100%').attr('height', '100%').attr('class', 'main-svg')
    .on("zoom", zoomed);

  var zoom = d3.zoom()
    .scaleExtent([0.5, 4])
    .translateExtent([
      [-width * 2, -height * 2],
      [width * 2, height * 2]
    ])
    .on("zoom", zoomed);

  // Define the div for the tooltip
  var tooltip = d3.select('.data-display').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // Adding link svg's
  var link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter().append('line');

  // Adding node svg's
  var node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(graph.nodes)
    .enter().append('circle')

    .attr('id', (d) => {
      return d.id;
    })
    .attr('class', (d) => {
      if (d.id == source.permalink || d.followerCount > minFollowers && d.followerCount < maxFollowers) {
        return 'pointer';
      } else {
        return 'default';
      }
    })
    .attr('onclick', (d) => {
      if(d.id == source.permalink || d.followerCount > minFollowers && d.followerCount < maxFollowers){
        return 'getUser(this.id)';
      }
      else {
        return 'none';
      }
    })
    .on('mouseover', (d) => {
      if (d.id == source.permalink || d.followerCount > minFollowers && d.followerCount < maxFollowers) {
        tooltip.transition()
          .duration(0)
          .style('opacity', .9);
        tooltip.html('<p>' + d.username + '</p>' + '<p class="tooltip-subtext">' + parseFollowers(d.followerCount) + ' Followers</p>')
          .style('left', (d3.event.clientX) + 'px')
          .style('top', (d3.event.clientY - 50) + 'px');
      }
    })
    .on('mousemove', (d) => {
      if (d.id == source.permalink || d.followerCount > minFollowers && d.followerCount < maxFollowers) {
        tooltip.style('left', (d3.event.clientX) + 'px')
          .style('top', (d3.event.clientY - 50) + 'px');
      }
    })
    .on('mouseout', (d) => {
      if (d.id == source.permalink || d.followerCount > minFollowers && d.followerCount < maxFollowers) {
        tooltip.transition()
          .duration(0)
          .style('opacity', 0);
      }
    })
    .attr('r', (d) => {
      if (d.id == source.permalink) {
        return 15;
      } else {
        if (maxFollowers < 50000 && d.followerCount > minFollowers && d.followerCount < maxFollowers)
          return myScale(d.followerCount) * 1.5;
        return myScale(d.followerCount);
      }
    })
    .attr('fill', (d) => {
      if (d.id == source.permalink) {
        return "#4286f4";
      } else if (d.followerCount < minFollowers || d.followerCount > maxFollowers) {
        return "#ccc";
      } else {
        return color(d.followerCount);
      }
    })
    // .call(d3.drag()
    //   .on('start', dragstarted)
    //   .on('drag', dragged)
    //   .on('end', dragended));


  //Simulation force
  var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id((d) => {
      return d.id;
    }))
    .force('charge', d3.forceManyBody())
    .force('forceX', d3.forceX().strength(.1).x(width * .5))
    .force('forceY', d3.forceY().strength(.1).y(height * .5))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width * 0.55, height / 2))

  // Simulation giberish
  simulation
    .nodes(graph.nodes)
    .on('tick', ticked);
  simulation.force('link')
    .links(graph.links)








  function ticked() {
    // stopSimulation();
    link
      .attr('x1', function(d) {
        return d.source.x;
      })
      .attr('y1', function(d) {
        return d.source.y;
      })
      .attr('x2', function(d) {
        return d.target.x;
      })
      .attr('y2', function(d) {
        return d.target.y;
      });

    node
      .attr('cx', function(d) {
        return d.x;
      })
      .attr('cy', function(d) {
        return d.y;
      });

  }

  // Starting dragging
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  // During drag
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  // After drag is finished
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  //Stop simulation code if needed at somepoint [Ragy]
  const simulationDurationInMs = 1000; //
  let startTime = Date.now();
  let endTime = startTime + simulationDurationInMs;


  function stopSimulation() {
    if (Date.now() < endTime) {
      /*update the simulation*/
    } else {
      console.log('Stop simultation...');
      simulation.stop();
    }
  }

  var currentTransform = null;

  function zoomed() {
    node.attr("transform", d3.event.transform);
    link.attr("transform", d3.event.transform);
  }
  svg.call(zoom);

}

/* Add on end event listener for songs */
function addListener() {
  /* Add event listener for new src [Ragy] */
  var iframeElement = document.querySelector('iframe');
  var widget = SC.Widget(iframeElement);
  widget.unbind(SC.Widget.Events.FINISH);
  widget.bind(SC.Widget.Events.FINISH, nextSong);
}



/* Right arrow navigation on playlistMode */
$(document).keydown(function(e) {
  switch (e.which) {

    case 39: // right
      if (navigationMode == true) {
        nextNode();
      } else {
        nextSong();
      }
      break;
    case 37: // left
      previousSong();
      break;


    default:
      return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});
