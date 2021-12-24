module.exports = {
    filterPerResidence: (arr, perResidence) => {
        return arr.filter(el =>  el.perResidence.toLowerCase().indexOf(perResidence.toLowerCase()) !== -1)
    },
    filterName: (arr, name) => {
        return arr.filter(el =>  el.name.toLowerCase().indexOf(name.toLowerCase()) !== -1)
    },
    filterDoB: (arr, dob) => {
        return arr.filter(el =>  el.dob == new Date(dob))
    },


}