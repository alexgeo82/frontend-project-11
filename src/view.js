import onChange from 'on-change'

const renderError = (error, elements, i18n) => {
    if (error) {
        elements.input.classList.add('is-invalid')
        elements.feedback.classList.add('text-danger')
        elements.feedback.textContent = i18n.t(error)
    }
}

const createUlElement = (element, title, i18n, id) => {
    const div = document.createElement('div')
    div.className = 'card border-0'
    element.append(div)

    const divCardBody = document.createElement('div')
    divCardBody.className = 'card-body'
    div.append(divCardBody)

    const h2 = document.createElement('h2')
    h2.className = 'card-title h4'
    h2.textContent = i18n.t(title)
    divCardBody.appendChild(h2)

    const ul = document.createElement('ul')
    ul.className = 'list-group border-0 rounded-0'
    ul.setAttribute('id', id)
    div.append(ul)
}

const renderFeeds = (state, elements, i18n) => {
    elements.form.reset()
    elements.input.focus()
    elements.feeds.innerHTML = ''
    elements.feedback.classList.remove('text-danger')
    elements.feedback.classList.add('text-success')
    elements.input.classList.remove('is-invalid')
    elements.feedback.textContent = i18n.t('form.success')

    createUlElement(elements.feeds, 'feeds.title', i18n, 'feeds')
    const ul = document.getElementById('feeds')

    state.feeds.forEach(({ feed }) => {
        const li = document.createElement('li')
        li.className = 'list-group-item border-0 border-end-0'

        const h3 = document.createElement('h3')
        h3.className = 'h6 m-0'
        h3.textContent = feed.title
        li.append(h3)

        const p = document.createElement('p')
        p.className = 'm-0 small text-black-50'
        p.textContent = feed.description
        li.append(p)
        ul.append(li)
    })
}

const renderPosts = (state, elements, i18n) => {
    elements.posts.innerHTML = ''
    createUlElement(elements.posts, 'posts.title', i18n, 'posts')
    const ul = document.getElementById('posts')

    state.posts.forEach((post) => {
        const li = document.createElement('li')
        li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0'

        const a = document.createElement('a')
        a.setAttribute('href', post.link)
        a.className = !state.viewedPosts.has(post.id) ? 'fw-bold' : 'fw-normal'
        a.dataset.id = post.id
        a.setAttribute('target', '_blank')
        a.setAttribute('rel', 'noopener noreferrer')
        a.textContent = post.title
        li.append(a)

        const button = document.createElement('button')
        button.setAttribute('type', 'button')
        button.className = 'btn btn-outline-primary btn-sm'
        button.dataset.id = post.id
        button.dataset.bsToggle = 'modal'
        button.dataset.bsTarget = '#modal'
        button.textContent = i18n.t('posts.button')
        li.append(button)
        ul.append(li)
    })
}

const showModal = (state, elements, value) => {
    const post = state.posts.find((post) => post.id === value)
    elements.modal.querySelector('h5').textContent = post.title
    elements.modal.querySelector('.modal-body').textContent = post.description
    elements.modal.querySelector('a').href = post.link
    const body = document.querySelector('body')
    body.classList.add('modal-open')
    body.setAttribute('style', 'overflow: hidden;')
    elements.modal.classList.add('show')
    elements.modal.setAttribute('style', 'display: block;')
    elements.modal.removeAttribute('aria-hidden')
    elements.modal.setAttribute('aria-modal', 'true')
    /*const backdrop = document.createElement('div')
    backdrop.className = 'modal-backdrop fade show'
    body.appendChild(backdrop)*/
}

export default (state, elements, i18n) => onChange(state, (path, value) => {
    switch (path) {
        case 'form.error':
            renderError(value, elements, i18n)
            break
        case 'feeds':
            renderFeeds(state, elements, i18n)
            break
        case 'posts':
            renderPosts(state, elements, i18n)
            break
        case 'viewedPosts':
            renderPosts(state, elements, i18n)
            break
        case 'modalId':
            showModal(state, elements, value)
            break
    }
})
