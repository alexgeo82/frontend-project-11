export default (data) => {
  const xml = new DOMParser().parseFromString(data, 'application/xml')
  const parsingEerror = xml.querySelector('parsererror')
  if (parsingEerror) {
    const error = new Error(parsingEerror.textContent)
    error.NotValidRss = true
    throw error
  }

  const feed = {
    title: xml.querySelector('channel title').textContent,
    description: xml.querySelector('channel description').textContent,
  }

  const posts = Array.from(xml.querySelectorAll('item')).map(item => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }))
  return [feed, posts]
}
