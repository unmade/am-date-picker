function amDatePickerConfigProvider() {
    var config = {};
    config.allowClear = true;
    config.backButtonText = "Back";
    // config.cancelButtonText = "Cancel";
    config.inputDateFormat = 'LL';
    config.maxYear = 2020;
    config.minYear = 1920;
    config.locale = 'en';
    config.popupDateFormat = 'ddd, MMM D';
    config.showInputIcon = false;

    /* Icons */
    config.calendarIcon = '/dist/images/icons/ic_today_24px.svg';
    config.clearIcon = '/dist/images/icons/ic_close_24px.svg';
    config.nextIcon = '/dist/images/icons/ic_chevron_right_18px.svg';
    config.prevIcon = '/dist/images/icons/ic_chevron_left_18px.svg';

    this.setIcons = function (icons) {
        for (var key in icons) {
            config[key] = icons[key];
        }
    }

    this.setOptions = function (options) {
        for (var key in options) {
            config[key] = options[key];
        }
    }

    var props = ['allowClear', 'backButtonText', 'cancelButton', 'inputDateFormat', 'inputLabel', 
    'maxYear', 'maxDate', 'minDate', 'minYear', 'locale', 'popupDateFormat', 'showInputIcon', 'todayButton', 'calendarIcon',
    'clearIcon', 'nextIcon', 'prevIcon'];
    
    props.forEach(function(prop) {
        var name = prop.charAt(0).toUpperCase() + prop.substr(1);
        this['set' + name] = function(value){
            config[prop] = value;
            return this;
        };
    }, this);

    this.$get = function ($mdDialog, $q) {
        return new AmDatePickerService(config, $mdDialog, $q);
    };
    this.$get.$inject = ["$mdDialog", "$q"];
}