//import initDataTableWithSort2 from ;

if ('undefined' !== typeof module) {


    module.exports.initDataTableWithSort2 = function initDataTableWithSort2(idTable, sort) {


        //Безопасный инит, если уже есть такой
        if ($.fn.dataTable.isDataTable('#' + idTable)) {
            table = $('#' + idTable).DataTable();
            table.destroy();
        }


        $('#' + idTable).DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Все"]],
            responsive: true,
            order: sort,//[[ 3, "desc" ]]
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Поиск строк",
                lengthMenu: "Показать _MENU_ строк",
                zeroRecords: "Нет данных",
                info: "Страница _PAGE_ из _PAGES_",
                infoEmpty: "Нет доступных данных",
                infoFiltered: "(Отфильтровано из _MAX_ всего строк)",
                paginate: {
                    first: "|<",
                    last: ">|",
                    next: ">",
                    previous: "<"
                }
            }

        });

        /*
         {
         "decimal":        "",
         "emptyTable":     "No data available in table",
         "info":           "Showing _START_ to _END_ of _TOTAL_ entries",
         "infoEmpty":      "Showing 0 to 0 of 0 entries",
         "infoFiltered":   "(filtered from _MAX_ total entries)",
         "infoPostFix":    "",
         "thousands":      ",",
         "lengthMenu":     "Show _MENU_ entries",
         "loadingRecords": "Loading...",
         "processing":     "Processing...",
         "search":         "Search:",
         "zeroRecords":    "No matching records found",
         "paginate": {
         "first":      "First",
         "last":       "Last",
         "next":       "Next",
         "previous":   "Previous"
         },
         "aria": {
         "sortAscending":  ": activate to sort column ascending",
         "sortDescending": ": activate to sort column descending"
         }
         }
        * */


        var table = $('#' + idTable).DataTable();

        //table.draw();

        /*
        // Edit record
        table.on('click', '.edit', function () {
            $tr = $(this).closest('tr');

            var data = table.row($tr).data();
            alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
        });

        // Delete a record
        table.on('click', '.remove', function (e) {
            $tr = $(this).closest('tr');
            table.row($tr).remove().draw();
            e.preventDefault();
        });

        //Like record
        table.on('click', '.like', function () {
            alert('You clicked on Like button');
        });
        */
    }

    module.exports.initDataTable2 = function initDataTable2(idTable) {
        module.exports.initDataTableWithSort2(idTable, []);
    }


    module.exports.loadDataTable2 = function loadDataTable2(idTable, dataSource, columnHeaders) {

        if ($.fn.dataTable.isDataTable('#' + idTable)) {
            table = $('#' + idTable).DataTable();
            table.destroy();
        }

        $('#' + idTable).DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            data: dataSource,
            columns: columnHeaders,
            responsive: true,
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search records",
            }

        });


        var table = $('#' + idTable).DataTable();

        // Edit record
        table.on('click', '.edit', function () {
            $tr = $(this).closest('tr');

            var data = table.row($tr).data();
            alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
        });

        // Delete a record
        table.on('click', '.remove', function (e) {
            $tr = $(this).closest('tr');
            table.row($tr).remove().draw();
            e.preventDefault();
        });

        //Like record
        table.on('click', '.like', function () {
            alert('You clicked on Like button');
        });

    }


    module.exports.destroyDataTable2 = function destroyDataTable2(idTable) {
        if ($.fn.dataTable.isDataTable('#' + idTable)) {
            table = $('#' + idTable).DataTable();
            //table.fnClearTable(true);
            table.destroy();
        }
    }

    module.exports.clearDataTable2 = function clearDataTable2(idTable) {
        table = $('#' + idTable).DataTable();
        table.clear();
    }

    module.exports.deleteSelectedRow2 = function deleteSelectedRow2(idTable) {
        //TODO - не работает
        table = $('#' + idTable).DataTable();
        table.rows('.selected').remove().draw();
    }

    module.exports.deleteRowById2 = function deleteRowById2(idTable, idRow) {
        table = $('#' + idTable).DataTable();
        table.row('#' + idRow).remove().draw();
    }

    module.exports.changeById2 = function changeById2(idTable, idRow, columnIndex, value) {
        table = $('#' + idTable).DataTable();
        table.cell('#' + idRow, columnIndex).data(value).draw();
    }


    module.exports.loadFromDOMDataTable2 = function loadFromDOMDataTable2(idTable)
    {
        if ($.fn.dataTable.isDataTable('#' + idTable)) {
            //Если есть такая таблица - загружаем
            table = $('#' + idTable).DataTable();
        }
        else {
            //Если нет - то создаем и загружаем
            initDataTable2('#' + idTable);
        }
    }

}