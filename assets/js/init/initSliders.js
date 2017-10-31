if ('undefined' !== typeof module) {

    module.exports = function initSliders(){
        // Sliders for demo purpose in refine cards section
        if($('#slider-range').length != 0){
            $( "#slider-range" ).slider({
                range: true,
                min: 0,
                max: 500,
                values: [ 75, 300 ],
            });
        }
        if($('#refine-price-range').length != 0){
             $( "#refine-price-range" ).slider({
                range: true,
                min: 0,
                max: 999,
                values: [ 100, 850 ],
                slide: function( event, ui ) {
                    min_price = ui.values[0];
                    max_price = ui.values[1];
                    $(this).siblings('.price-left').html('&euro; ' + min_price);
                    $(this).siblings('.price-right').html('&euro; ' + max_price)
                }
            });
        }

        if($('#slider-default').length != 0 || $('#slider-default2').length != 0){
            $( "#slider-default, #slider-default2" ).slider({
                    value: 70,
                    orientation: "horizontal",
                    range: "min",
                    animate: true
            });
        }
    }
}
