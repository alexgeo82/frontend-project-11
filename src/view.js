import onChange from 'on-change';
import validateUrl from './validator.js'
import axios from 'axios'

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

    const form = document.querySelector('form')
    const input = document.getElementById('url-input')
    const submitButton = document.querySelector('button[type="submit"]')

    const watchedState = onChange(initialState, (path, current, previous) => { })

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const url = input.value
        try {
            await validateUrl(url, watchedState.feeds)
            axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => {
                    console.error(error)
                })
            initialState.feeds.push(url)
            form.reset()
            input.focus()
        } catch (error) {
            //console.log(error)
            initialState.form.error = error
            input.classList.add('is-invalid')
        }
    })
}
