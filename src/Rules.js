const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
export default {
    required: function (value) {
        return !!value || "Requis"
    },
    email: function (value) {
        /* eslint-disable */
        if (!value) {
            return true
        }
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || "Courriel invalide"
    },
    min8Char: function (value) {
        if (!value) {
            return true;
        }
        return value.length >= 8 || "Minimum 8 caractères";
    },
    max255Char: function (value) {
        if (!value) {
            return true;
        }
        return value.length <= 255 || "Maximum 255 caractères";
    },
    isFloat: function (value) {
        if (!floatRegex.test(value)) {
            return false;
        }
        const val = parseFloat(value);
        return isNaN(val);
    }
}
