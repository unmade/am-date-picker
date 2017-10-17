'use strict';


function providerFactory(moduleName, providerName) {
    var provider;
    module(moduleName, [providerName, function(Provider) { provider = Provider; }]);
    return function() { inject(); return provider; }; // inject calls the above
}


function serviceFactory(serviceName){
    var service;
    inject([serviceName,function(Service){ service = Service;}]);
    return service;
}
