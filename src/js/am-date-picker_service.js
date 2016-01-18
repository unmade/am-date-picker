function AmDatePickerService(config, $mdDialog, $q) {
    var properties = ['allowClear', 'backButtonText', 'cancelButton', 'showInputIcon',
        'inputLabel', 'maxDate', 'minDate', 'maxYear', 'minYear', 'locale',
        'inputDateFormat', 'popupDateFormat', 'todayButton', 'calendarIcon',
        'prevIcon', 'nextIcon', 'clearIcon'];

    for (var property in properties) {
        createProperty(this, properties[property], config[properties[property]]);
    }

    function createProperty(obj, name, value) {
        Object.defineProperty(obj, name, {
            __proto__: null,
            get: function () {
                return value;
            }
        });
    }
}
