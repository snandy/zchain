(function (glob, factory) {
    // AMD support
    if (typeof define === "function" && define.amd) {
        // Define as an anonymous module
        
    } else {
        // Browser globals (glob is window)
        // Raphael adds itself to window
        factory(glob)
    }
}(this, function (window) {

    // define Z
    var Z = {}

    // EXPOSE
    // Even with AMD, Z should be defined globally
    window.Z = Z

    return Z
});
