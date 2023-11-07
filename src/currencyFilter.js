import Vue from 'vue'

const numberRegex = /^[+-]?\d*\.?\d+(?:[Ee][+-]?\d+)?$/
export default {
    setup: function () {
        Vue.filter('currency', function (value) {
            if (value === null || value === undefined) {
                return value;
            }
            let isNumber = String(value).match(numberRegex);
            if (isNumber === null) {
                return value;
            }
            let formatter = new Intl.NumberFormat('fr-CA', {
                style: 'currency',
                currency: 'CAD',
                minimumFractionDigits: 2
            })
            const formatted = formatter.format(value);
            if (formatted.indexOf("CA") === -1) {
                return formatted;
            } else {
                return formatted.substring(0, formatted.length - 3);
            }
        })
    }
}
