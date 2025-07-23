import onChange from 'on-change'
import validateUrl from './validator.js'
import axios from 'axios'
import i18next from 'i18next'
import ru from './locales/ru.js'

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

    const form = document.querySelector('form')
    const input = document.getElementById('url-input')
    const submitButton = document.querySelector('button[type="submit"]')
    const feedback = document.querySelector('.feedback')

    const render = (path, current) => {
        switch (path) {
            case 'form.error':
                input.classList.add('is-invalid')
                feedback.classList.add('text-danger')
                if (current === 'notValidRss') {
                    feedback.textContent = i18n.t('form.errors.notValidRss')
                } else {
                    feedback.textContent = current
                }
                break
            case 'feeds':
                form.reset()
                input.focus()
                feedback.classList.remove('text-danger')
                feedback.classList.add('text-success')
                input.classList.remove('is-invalid')
                feedback.textContent = i18n.t('form.success')
                break
        }
    }

    const watchedState = onChange(initialState, (path, current, previous) => {
        render(path, current)
    })

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const url = input.value
        try {
            await validateUrl(url, watchedState.feeds, i18n)
            //watchedState.form.state = 'processing'
            await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
                .then(response => {
                    if (response.data.status.error) {
                        watchedState.form.error = 'notValidRss'
                        return
                    }
                    watchedState.feeds.push(url)
                })
                .catch(error => {
                    console.error(error.response)
                })
        } catch (error) {
            watchedState.form.error = error.message
        }
    })
}
