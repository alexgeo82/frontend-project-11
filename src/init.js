import validateUrl from './validator.js'
import axios from 'axios'
import i18next from 'i18next'
import ru from './locales/ru.js'
import view from './view.js'
import parse from './parser.js'
import { uniqueId } from 'lodash';
import updatePosts from './updateposts.js'

export default () => {
    const initialState = {
        form: {
            state: 'filling',
            error: null,
            valid: true,
        },
        feeds: [],
        posts: [],
    }

    const i18n = i18next.createInstance();
    i18n.init({
        lng: 'ru',
        debug: true,
        resources: {
            ru,
        },
    })

    const elements = {
        form: document.querySelector('form'),
        input: document.getElementById('url-input'),
        submitButton: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
    }

    const watchedState = view(initialState, elements, i18n);

    elements.submitButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const url = elements.input.value
        const urlsList = watchedState.feeds.map((feed) => feed.url)
        try {
            await validateUrl(url, urlsList, i18n)
            watchedState.form.state = 'processing'
            await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
                .then(response => {
                    if (response.data.status.error) {
                        watchedState.form.error = 'form.errors.notValidRss'
                        return
                    }
                    const [feed, posts] = parse(response.data.contents)
                    const newFeed = { id: uniqueId(), feed, url }
                    watchedState.feeds.push(newFeed)
                    const newPosts = posts.map((post) => ({ id: uniqueId(), feedId: newFeed.id, ...post }))
                    watchedState.posts.push(...newPosts)
                    watchedState.form.state = 'success'
                })
                .catch(error => {
                    console.error(error)
                })
        } catch (error) {
            watchedState.form.error = error.message
            watchedState.form.state = 'filling'
        }
    })
    setTimeout(() => updatePosts(watchedState), 1000)
}