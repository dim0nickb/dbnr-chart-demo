if ('undefined' !== typeof module) {
    inNotify = true;
    type = ['','info','success','warning','danger'];
    module.exports = function initNotify(from, align){
        color = Math.floor((Math.random() * 4) + 1);
        if(inNotify){
            $.notify({
                icon: "pe-7s-gift",
                message: "<b>111Light Bootstrap Dashboard PRO Angular 2</b> - forget about boring dashboards."

            },{
                type: 'danger',
                timer: 4000,
                placement: {
                    from: from,
                    align: align
                }
            });
            inNotify = false;
        }
    }
}
