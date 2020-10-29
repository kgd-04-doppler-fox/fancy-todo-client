function getDate (date) {
    let editDate = new Date (date)
    return new Intl.DateTimeFormat('en-GB').format(editDate)
}