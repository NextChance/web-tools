export default (
    text:string
): string => Buffer.from(encodeURI(text.replace(/ /g, '+'))).toString('base64')
