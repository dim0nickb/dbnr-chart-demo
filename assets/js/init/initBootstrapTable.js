if ('undefined' !== typeof module) {

    module.exports = function initBootstrapTable(){
        window.operateEvents = {
            'click .view': function (e, value, row, index) {
                info = JSON.stringify(row);

                swal('You click view icon, row: ', info);
                console.log(info);
            },
            'click .edit': function (e, value, row, index) {
                info = JSON.stringify(row);

                swal('You click edit icon, row: ', info);
                console.log(info);
            },
            'click .remove': function (e, value, row, index) {
                console.log(row);
                $('#bootstrap-table').bootstrapTable('remove', {
                    field: 'id',
                    values: [row.id]
                });
            }
        };

        $('#bootstrap-table').bootstrapTable({
            // console.log('aici');
            toolbar: ".toolbar",
            clickToSelect: true,
            showRefresh: true,
            search: true,
            showToggle: true,
            showColumns: true,
            pagination: true,
            searchAlign: 'left',
            pageSize: 8,
            clickToSelect: false,
            pageList: [8,10,25,50,100],

            formatShowingRows: function(pageFrom, pageTo, totalRows){
                //do nothing here, we don't want to show the text "showing x of y from..."
            },
            formatRecordsPerPage: function(pageNumber){
                return pageNumber + " rows visible";
            },
            icons: {
                refresh: 'fa fa-refresh',
                toggle: 'fa fa-th-list',
                columns: 'fa fa-columns',
                detailOpen: 'fa fa-plus-circle',
                detailClose: 'fa fa-minus-circle'
            }
        });

        // //activate the tooltips after the data table is initialized
        // $('[rel="tooltip"]').tooltip();

        $(window).resize(function () {
            $('#bootstrap-table').bootstrapTable('resetView');
        });

    }
}
