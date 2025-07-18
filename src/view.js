import onChange from 'on-change';
import validateUrl from './validator.js'

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

    const watchedState = onChange(initialState, (path, current, previous) => {

        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const url = input.value
            try {
                await validateUrl(url, initialState.feeds)
                initialState.feeds.push(url)
                form.reset()
                //input.focus()
            } catch (error) {
                input.classList.add('is-invalid')
            }
        })
    })
}
