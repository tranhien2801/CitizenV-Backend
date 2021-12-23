module.exports = {
    yearFormat: function(date) {
        if (date == null)   return "0000/00/00";
        var day = date.getDate();
        if (day < 10) day = '0' + day;
        var month = date.getMonth() + 1;
        if ( month < 10) month = '0' + month;
        var year = date.getFullYear();
        const yearFormat = year + '-' + month + '-' + day;
        return yearFormat;
    },
    dateFormat: function(date) {
        if (date == null)   return "0000/00/00";
        var day = date.getDate();
        if (day < 10) day = '0' + day;
        var month = date.getMonth() + 1;
        if ( month < 10) month = '0' + month;
        var year = date.getFullYear();
        const dateFormat = day + '-' + month + '-' + year;
        return dateFormat;
    },
}