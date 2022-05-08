const commonAutoConfigParams = {
  async fetchData(searchTerm) {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: 'd9835cc5',
        s: searchTerm
      }
    })
    if (response.data.Error) return []
    return response.data.Search;
  },
  renderRow(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
    <img src="${imgSrc}" />
    <h1>${movie.Title} (${movie.Year})</h1>
    `
  },
  setInputValue(movie) { return movie.Title }
}


createAutoComplete({
  root: document.querySelector('#left-input'),
  onRowSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    movieDetail(movie, '#left-summary')
  },
  ...commonAutoConfigParams
})
createAutoComplete({
  root: document.querySelector('#right-input'),
  onRowSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    movieDetail(movie, '#right-summary')
  },
  ...commonAutoConfigParams
})

let leftMovie
let rightMovie
const movieDetail = async (movie, summaryID) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: movie.imdbID
    }
  })
  document.querySelector(summaryID).innerHTML = movieHTML(response.data)
  if (summaryID.includes('left')) leftMovie = response.data
  if (summaryID.includes('right')) rightMovie = response.data
  if (leftMovie && rightMovie) compareMovies()
}

const compareMovies = () => {
  const leftStats = document.querySelectorAll('#left-summary .notification')
  const rightStats = document.querySelectorAll('#right-summary .notification')
  leftStats.forEach((leftStat, index) => {
    const rightStat = rightStats[index]
    if (Number(leftStat.dataset.value) < Number(rightStat.dataset.value)) {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    } else {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  })
}

const movieHTML = movie => {
  const dollars = movie.BoxOffice.replace('$', '').replaceAll(',', '')
  const metascore = movie.Metascore
  const imdbRating = movie.imdbRating
  const imdbVotes = movie.imdbVotes.replaceAll(',', '')

  let awards = movie.Awards.split(' ')
  const wins = Number(awards[awards.indexOf('wins') - 1])
  const nominations = Number(awards[awards.indexOf('nominations') - 1])
  awards = `${wins}.${nominations}`


  return `
  <article class="media">
  <figure class="media-left">
    <p class="image">
      <img src="${movie.Poster}" />
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <h1>${movie.Title}</h1>
      <h4>${movie.Year}</h1>
      <h4>${movie.Genre}</h4>
      <p>${movie.Plot}</p>
    </div>
  </div>
</article>
<article data-value=${awards} class="notification is-primary">
  <p class="title">${movie.Awards}</p>
  <p class="subtitle">Awards</p>
</article>
<article data-value=${dollars} class="notification is-primary">
  <p class="title">${movie.BoxOffice}</p>
  <p class="subtitle">BoxOffice</p>
</article>
<article data-value=${metascore} class="notification is-primary">
  <p class="title">${movie.Metascore}</p>
  <p class="subtitle">Metascore</p>
</article>
<article data-value=${imdbRating} class="notification is-primary">
  <p class="title">${movie.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
</article>
<article data-value=${imdbVotes} class="notification is-primary">
  <p class="title">${movie.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
</article>
  `
}



