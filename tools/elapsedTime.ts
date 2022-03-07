export const getElapsedTime = (time:number, locale:string) => {
    let formatTime
    const diff = ((Date.now() / 1000) - time)
    if (diff < 60 * 60) {
        const value = diff / 60
        formatTime = value <= 1 ? {msg: 'date_minute_ago' } : {msg: 'date_minutes_ago', variable1: parseInt(value.toString())}
    } else if (diff < 24 * 60 * 60) {
        const value = Math.floor(diff / 60 / 60)
        formatTime = value <= 1 ? {msg: 'date_hour_ago' } : {msg: 'date_hours_ago', variable1: parseInt(value.toString())}
    } else if (diff < 7 * 24 * 60 * 60) {
        const value = Math.floor(diff / 24 / 60 / 60)
        formatTime = value <= 1 ? {msg: 'date_day_ago' } : {msg: 'date_days_ago', variable1: parseInt(value.toString())}
    } else {
        const date = new Date(time * 1000)
        const options = {
            month: 'long',
            day: 'numeric'
        }
        if (diff >= 364 * 24 * 60 * 60) {
            // @ts-ignore
            options.year = 'numeric'
        }
        // @ts-ignore
        formatTime = date.toLocaleDateString(locale, options)
    }
    return formatTime
}
