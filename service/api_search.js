import wkRequest from './index'

export function getSearchHot() {
  return wkRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return wkRequest.get("/search/suggest", {
    keywords,
    type: 'mobile'
  })
}

export function getSearchResult(keywords) {
  return wkRequest.get("/search", {
    keywords
  })
}