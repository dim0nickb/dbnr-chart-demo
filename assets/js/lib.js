/**
 * Created by Николай on 14.04.2017.
 */
if ('undefined' !== typeof module) {

    module.exports.test = function test() {

        /*
        var t = $('#collapse1');
        alert(t.attr("aria-expanded"));

        $("#collapse1").collapse("toggle");
        alert(t.attr("aria-expanded"));

        if(t) {
            $("#collapse1").collapse("show");
        }
        else{
            $("#collapse1").collapse("hide");
        }
        */
        //window.alert($('#collapse1').hasClass('in'));
        //window.alert($('#collapse1').hasClass('collapse'));

    };

    module.exports.isExpanded = function isExpanded(idPanel) {
        var panel = $('#' + idPanel);
        var isExpanded = panel.attr("aria-expanded") == "true";
        return isExpanded;
    };

    module.exports.expandPanel = function expandPanel(idPanel) {
        var panel = $('#' + idPanel);
        panel.collapse("show");
    };

    module.exports.collapsePanel = function collapsePanel(idPanel) {
        var panel = $('#' + idPanel);
        panel.collapse("hide");
    };

}