import axios from 'axios'
import parse from './parser.js'
import { differenceBy, uniqueId } from 'lodash';

const updatePosts = (watchedState) => {
    const { feeds, posts } = watchedState
    const promise = feeds.map(({ id, url }) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
        .then(({ data }) => {
            const [, receivedPosts] = parse(data.contents);
            const addedPosts = posts.filter((post) => post.feedId === id);
            const postsToAdd = differenceBy(receivedPosts, addedPosts, 'link')
            if (postsToAdd.length !== 0) {
                const newPosts = postsToAdd.map((post) => ({ id: uniqueId(), feedId: id, ...post }))
                watchedState.posts = [...newPosts, ...posts]
            }
        })
        .catch(error => {
            console.error(error)
        }))
    Promise.all(promise)
    // .finally(() => setTimeout(() => updatePosts(watchedState), 5000))
}
export default updatePosts