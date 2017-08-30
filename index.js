'use strict';

const STORE = {
  query: null,  
  results: {}
}


const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const KEY = 'AIzaSyBhQaLOXnfpvlGO65Nv2oN8YF8jBZU8pD4';

// ?metallica%20&part=snippet&q=metallica&type=video&key=AIzaSyBhQaLOXnfpvlGO65Nv2oN8YF8jBZU8pD4

//CORRECT: https://www.googleapis.com/youtube/v3/search?metallica%20&part=snippet&q=metallica&type=video&key=AIzaSyBhQaLOXnfpvlGO65Nv2oN8YF8jBZU8pD4

//ERROR: https://www.googleapis.com/youtube/v3/search?q=metallica%20in%3Aname&per_page=5&key=AIzaSyBhQaLOXnfpvlGO65Nv2oN8YF8jBZU8pD4


function getDataFromApi(searchTerm, callback) {
  console.log('getDataFromAPI ran');
  const query = {
    q: `${searchTerm}`,
    maxResults: 10,
    part: 'snippet',
    key: KEY
  };
  console.log(query);
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(result) {
  let cT = result.snippet.channelTitle;
  cT = cT.split(/[ ,]+/);
  cT = cT.join('');
  const videoLink = "https://www.youtube.com/watch?v=" + result.id.videoId;
  // const title = result.snippet.channelTitle;
  // const chanTitle = title.split(" ");
  // const channelLink = "https://www.youtube.com/user/" + cT;
  const channelLink = "https://www.youtube.com/user/" + cT;


  //if(result.)
  console.log(videoLink);
  console.log('renderResults ran');
  console.log(result);
  if(result.id.videoId){
    return `
    <div><a href="${videoLink}"><h4>${result.snippet.title}</h4></a>
    </div>
    <div class="lightboxright">
      
        
          <iframe  src="${"https://www.youtube.com/embed/" + result.id.videoId}" frameborder="0" allowfullscreen></iframe>
        
        
      </div>
    `;
  } // <iframe width="100%" height="100%" src="https://www.youtube.com/embed/wswxQ3mhwqQ" frameborder="0" allowfullscreen></iframe>

  if(result.id.channelId){
    //chanTitle.forEach( val => cT += val);
    return `
    <div>
      <a href="${channelLink}">
        <img src="${result.snippet.thumbnails.medium.url}"/>
      </a>
      <div><h4>${result.snippet.title}</h4>
      
      </div>
    </div>
  `;
  }
}

// <a class="js-result-name" href="${result.html_url}" target="_blank">${result.name}</a> by <a class="js-user-name" href="${result.owner.html_url}" target="_blank">${result.owner.login}</a></h2>
// <p>Number of watchers: <span class="js-watchers-count">${result.watchers_count}</span></p>
// <p>Number of open issues: <span class="js-issues-count">${result.open_issues}</span></p>


// CALLBACK
function displayYoutubeSearchData(data) {
  console.log('displayGitHubSearchData ran');
  STORE.appState = 'results';
  STORE.results = data.items.map((item, index) => renderResult(item));
  $('#js-search-results').html(STORE.results);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    console.log('listener ran');
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    STORE.query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(STORE.query, displayYoutubeSearchData);
  });
}

$(watchSubmit);
