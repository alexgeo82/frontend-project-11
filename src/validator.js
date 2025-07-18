import * as yup from 'yup';

export default (url, feeds) => {
    yup.setLocale({
        string: {
            url: 'Ссылка должна быть валидным URL',
        },
        mixed: {
            required: 'Не должно быть пустым',
            notOneOf: 'RSS уже существует',
        },
    })

    const schema = yup
        .string()
        .required()
        .url()
        .notOneOf(feeds)

    return schema.validate(url)
}
