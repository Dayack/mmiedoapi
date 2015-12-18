window.onload = createChart()
//all cities loaded
////GLOBAL VARS TO ALL FILES
var graf_types=["grafica1","grafica2","grafica3"];
var baseUrl = "http://localhost:8000/"

/************ VARS TO BE OVERWRITTEN ************
 var cities = ['Bogotá','Barranquilla','Santa Marta','Cali','Armenia','Pereira','Medellín'];
 //arrays of series
 //graph1, the MEDIA must be in the same order: press, radio, tv, internet
 //var contador = [17,12,8,21];
 var precio = [198009548,243861317,37836670,22051715];
 var links_graph1 = ['test.com','test.com','test.com','test.com','test.com'];
 //second graph, nacional vs regional
 var news_graph2 = [ 17,20];
 var valor_graph2 = [243861317,198009548];
 var links_graph2 = ['test.com','test.com'];
 //third graph news by cities //same order that the city array
 var news_graph3 = [1,2,3,4,5,6,7];
 var valor_graph3 = [243861317,198009548,243861317,243861317,243861317,243861317,243861317];
 var links_graph3 = ['test.com','test.com','test.com','test.com','test.com','test.com','test.com'];


 /***************************************/

//vars for internal functionality
var selectedCities = [];
var group_categories = [];

var data;
function createCitiesSelector(id_chart,id_table) {


    jQuery.each(cities, function (i, item) {
        jQuery('#citySelector').append(jQuery('<option>', {
            value: item,
            text: item
        }));
    });
    //max 12 items

    //IF NOT CITIES ARE SELECTED: AUTOSELECT THE FIRST 12
    if (selectedCities.length === 0) {
        selectedCities = cities.slice(0, 12);
    }
    jQuery('#citySelector').chosen({max_selected_options: 12}).change(function () {
        selectedCities = jQuery("#citySelector").chosen().val();
        if (selectedCities === null) {
            selectedCities = [];
        }
        drawChart_3(id_chart,id_table);
    });


}
/******
 *
 *
 * SELECT VIEW FUNCTIONS
 *
 *
 *
 * *******/
//---delcared var
var views=[{ nombre_informe:"vista1", id_informe: "1", tipo_informe: "grafica1"},{ nombre_informe:"vista2", id_informe: "2", tipo_informe: "grafica2"},{ nombre_informe:"vista3", id_informe: "3", tipo_informe: "grafica3"}];
var grafTypes=["grafica1","grafica2","grafica3"];
var defaultView=3;//-defined a default selected view
//nombre_categorias TODO separar categorias
var categories=[{name:"Categoria1",id:1},{name:"categoria2",id:2},{name:"categoria3",id:3}];
//id_categorias
var userId=1;
var perfilId=2;
var zonaId= 1;
//---Local vars
var days=[ "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ];
var dayNamesShort= [ "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab" ];


//generate the datepickers
function createDateSelectors(){
    jQuery( "#startDate" ).datepicker({
        showButtonPanel: true,
        dateFormat: "dd-mm-yy",
        dayNames:days,
        dayNamesShort:dayNamesShort,
        defaultDate: -7
    });

    jQuery( "#endDate" ).datepicker({
        showButtonPanel: true,
        dateFormat: "dd-mm-yy",
        dayNames:days,
        dayNamesShort:dayNamesShort,
        defaultDate: new Date()
    });
}


//create the category selector
function createCategorySelector(){
    var selector = jQuery("#categorySelect");
    jQuery.each(categories, function() {
        selector.append('<option value="'+this.id+'" >'+this.name+'</option>');
    });
}

function createViewList(){
    var viewList = jQuery("#viewList");
    jQuery.each(views,function(){
        viewList.append('<li><div id="view_id_'+this.id_informe+'" onclick="selectView(\''+this.id_informe+'\')">'+this.nombre_informe+'</div></li>');
    });
}




//select a view in the list
function selectView(id) {
    jQuery("#viewList li").removeClass("selected-graph");//may not work
    var graphType=null;
    for (var i=0;i<views.length;i++) {
        jQuery("#view_id_"+views[i].id_informe).removeClass("selected-graph");
        if (views[i].id_informe === id) {
            graphType = views[i].tipo_informe;
        }
    }
    jQuery("#view_id_"+id).addClass("selected-graph");
    //disable category selector if graph is type 1
    if (graphType ==="grafica1") {
        jQuery("#categorySelect").show();
    } else {
        jQuery("#categorySelect").hide();
    }

}

//got to defined graph
function goToGraph(){
    //configure a new URL to go
    var viewId=jQuery(".selected-graph").attr("id");
    //the id is 'view_id_XX' where XX is the ID view
    viewId = viewId.substr(8);
    var categoryId = null;//category is necessary if the graph is type1
    jQuery.each(views,function(){
        if (this.id_informe.toString() === viewId) {
            if (this.tipo_informe === "grafica1") {
                categoryId = jQuery("#categorySelect").val();
            }
        }
    });
    //extract dates

    var startDate = jQuery("#startDate").datepicker( "getDate" );
    var endDate = jQuery("#endDate").datepicker( "getDate" );
    startDate = (startDate.getDay()<10 ? "0": "")+startDate.getDay()+(startDate.getMonth()+1)+startDate.getFullYear();
    endDate = (endDate.getDay()<10 ? "0": "")+endDate.getDay()+(endDate.getMonth()+1)+endDate.getFullYear();
    window.open(baseUrl+'?informe_id='+viewId+(categoryId ===null ? "": "&categoria_id="+categoryId)+
        "&from="+startDate+"&to="+endDate+"usuario_id="+userId,'_blank');
}


//READY PART
jQuery(document).ready(function(){
    //by default hide the category selector
    jQuery("#categorySelect").hide();
    createDateSelectors();
    createCategorySelector();
    createViewList();
    //if a default view is selected, trigger selection
    if (defaultView != null && defaultView>0) {
        selectView(defaultView);
    }
});
/****
 *
 *
 * LOAD GRAPH FILES
 *
 *
 *
 */

var nombre_informe="VISTA DE GRAFICA1";
var tipo_informe="grafica3";
var nombre_categoria="";//in case of graph type 1
var nombres=['Categoria1','Categoria2','Categoria3'];//list of groups for X Axis
var contador=[17,20,21];//list of news for Serie1
var precio=[243861317,198009548,198009548];//list of valors, for Serie2
var fecha_desde="";//TODO: parsear fechas a documento
var fecha_hasta="";

/*
 grafica1 - serie1 - news, serie2 - valors table: news, valors
 grafica2 - serie - news, serie2 - valors table: news, valors
 grafica3 - serie -  news table: news,valors
 */


// generic function to create chart
function createChart() {
    // Load the Visualization API and the piechart package.
    google.load('visualization', '1.0', {'packages': ['corechart', 'table']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.setOnLoadCallback(drawCharts);
}

//generate the correct chart by type
function drawCharts() {

    switch (tipo_informe) {
        case "grafica1":
            drawChart_1('chart_div','table_div');
            break;
        case "grafica2":
            createCategoriesSelector("categoriesSelector", "categoriesInput", "categoriesButton","categoriesTable");
            drawChart_2('chart_div','table_div');
            break;
        case "grafica3":
            drawChart_3('chart_div','table_div');
            createCitiesSelector();
            break;
        default:
            jQuery("#chart_div").append("NO SE HA ENCONTRADO TIPO DE GRAFICA");
    }
    //create title
    jQuery("#graph-title").text(nombre_informe);
}


///---charts code


// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart_1(id_chart,id_table) {

    var colors = ['#ed7d31', '#7f6000', '#548235', '#00b0f0'];
    var graph_data = [['Media', 'noticias', 'valor', {role: 'style'}]];
    var graph_data_table = [['Media', 'noticias', 'valor']];
    var medias = nombres;
    var j = 0; //pos in the input array of data
    for (var i = 0; i < medias.length; i++) {
        graph_data[i + 1] = [medias[i]];
        graph_data[i + 1].push(contador[j]);
        graph_data[i + 1].push(precio[j]);
        graph_data[i + 1].push(colors[i % colors.length]);
        //table
        graph_data_table[i + 1] = [medias[i]];
        graph_data_table[i + 1].push(contador[j]);
        graph_data_table[i + 1].push(precio[j]);
        j++;
    }
    // Create the data table.
    data = new google.visualization.arrayToDataTable(graph_data);

    // Set chart options
    var options = {
        title: 'CATEGORIA: ' + nombre_categoria,
        width: 800,
        height: 600,
        seriesType: 'column',
        series: {
            0: {targetAxisIndex: 0, type: 'line', name: 'noticias'},
            1: {type: 'bars', targetAxisIndex: 1, name: 'valor'}
        },
        vAxis: {
            0: {format: '$#,###.00'}//,
            /*1: {format: ''}*/
        }
    };


    var formatter = new google.visualization.NumberFormat({prefix: '$', negativeColor: 'red', negativeParens: true});
    formatter.format(data, 2);

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ComboChart(document.getElementById(id_chart));
    chart.draw(data, options);
    //add links -- on develop now..
    /*var axisItems = jQuery("#chart_div text[text-anchor='middle']");
    for (i = 0; i < axisItems.length; i++) {
        //add the specific link
        jQuery(axisItems[i]).click(function () {
            window.open(links_graph1[i], '_blank');
        });
        jQuery(axisItems[i]).css("cursor", "pointer");
    }*/


    google.visualization.events.addListener(chart, 'click', selectHandler)

    /* var dataArray = [['PRENSA', '17', '27%', '$198.009', '39%'],
     ['RADIO', '17', '27%', '$243.861.317', '49%'],
     ['TELEVISION', '8', '13%', '$37.836.670', '8%'],
     ['INTERNET', '21', '33%', '$22.051.715', '4%'],
     ['TOTAL', '63', '100%', '$501.759.250', '100%']];*/

    dataTable = generateTableData(graph_data_table, ['', '', '$x']);
    drawTable(id_table, ['MEDIO', 'Nº Noticias', '%', 'VALOR', '%'], dataTable);
}



// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart_2(id_chart,id_table) {

    var graph_data = [['Media', 'noticias', 'valor', {role: 'style'}]];
    var graph_data_table = [['Media', 'noticias', 'valor']];
    var divisions = nombres;
    // Create the data table.
    var j = 0;
    for (var i = 0; i < divisions.length; i++) {
        graph_data[i + 1] = [divisions[i]];
        graph_data[i + 1].push(contador[j]);
        graph_data[i + 1].push(precio[j]);
        graph_data[i + 1].push('#ed7d31');
        //table

        graph_data_table[i + 1] = [divisions[i]];
        graph_data_table[i + 1].push(contador[j]);
        graph_data_table[i + 1].push(precio[j]);
        j++;
    }
    // Create the data table.
    data = new google.visualization.arrayToDataTable(graph_data);

    // Set chart options
    var options = {
        //title: 'CATEGORIA: ' + nombre_categoria,
        width: 800,
        height: 600,
        seriesType: 'column',
        series: {
            0: {targetAxisIndex: 0, type: 'line'},
            1: {type: 'bars', targetAxisIndex: 1}
        },
        vAxis: {
            0: {format: '$#,###.00'}//,
            /*1: {format: ''}*/
        }

    };


    var formatter = new google.visualization.NumberFormat({prefix: '$', negativeColor: 'red', negativeParens: true});
    formatter.format(data, 2);

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ComboChart(document.getElementById(id_chart));
    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'click', selectHandler)


    /*var dataArray = [['Nacional', '45', '71%', '220.009', '44%'],
     ['Regional', '18', '29%', '$281.861.317', '56%'],
     ['TOTAL', '63', '100%', '$501.759.250', '100%']];*/

    dataTable = generateTableData(graph_data_table, ['', '', '$x']);
    drawTable(id_table, ['CUBRIMIENTO', 'Nº Noticias', '%', 'VALOR', '%'], dataTable);
}


function drawChart_3(id_chart,id_table) {


    var colors = ['#8fa2d4', '#FFD184', '#BFBFBF', '#F1A78A', '#97B9E0', '#62993E', '#3B64AD', '#E2AA00', '#929292', '#D26E2A', '#4D89BD'];
    //the array generator must select the cities that are selected by the user, and the rest in one bar
    //at the end of the graph

    //in this case we are going to generate 2 matrix, one with colors and anothers without colors
    // to get the data for the graph, and the data for the table
    var divisions = nombres;

    var graph_data = [['Ciudad', 'noticias']];
    var graph_data_table = [['Ciudad', 'noticias']];
    var j = 0;
    /*var other_cities = ['Otras Ciudades', 0];
    var other_cities_table = ['Otras Ciudades', 0, 0];*/
    //now loop all the cities, asking if are selected or not
    //selected Cities only can contain max 12 items
    var posGraph = 1;
    /*for (var i = 0; i < nombres.length; i++) {
        if (selectedCities.indexOf(cities[i]) < 0) {
            //city not selected
            other_cities[1] = other_cities[1] + news_graph3[i];
            other_cities_table[1] = other_cities_table[1] + news_graph3[i];
            other_cities_table[2] = other_cities_table[2] + valor_graph3[i];
        } else {
            graph_data[posGraph] = [cities[i]];
            graph_data[posGraph].push(news_graph3[j]);
            //for table
            graph_data_table[posGraph] = [cities[i]];
            graph_data_table[posGraph].push(news_graph3[j]);
            graph_data_table[posGraph].push(valor_graph3[j]);
            posGraph++;
       }
        j++;
    }*/
    for (var i = 0; i < divisions.length; i++) {
        graph_data[i + 1] = [divisions[i]];
        graph_data[i + 1].push(contador[j]);
        //graph_data[i + 1].push(precio[j]);
        //table

        graph_data_table[i + 1] = [divisions[i]];
        graph_data_table[i + 1].push(contador[j]);
       graph_data_table[i + 1].push(precio[j]);
        j++;
    }

    //now add the last bar, the 'Other Cities'
    /*if (cities.length > selectedCities.length) {
        graph_data.push(other_cities);
        graph_data_table.push(other_cities_table);

    }*/

    dataTable = generateTableData(graph_data_table, ['', '', '$x']);
    //now add the colors for the graph:
    graph_data[0].push({role: 'style'});
    var colorPos = 0;
    for (var k = 1; k < graph_data.length; k++) {
        graph_data[k].push(colors[colorPos % colors.length]);
        colorPos++;
    }


    // Create the data table.
    data = new google.visualization.arrayToDataTable(graph_data);

    // Set chart options
    var options = {
       // title: 'CATEGORIA: ' + nombre_categoria,
        width: 800,
        height: 600,
        vAxis: {},
        hAxis: {minValue: 0}
    };


    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById(id_chart));
    chart.draw(data, options);
    //add links
    var axisItems = jQuery("#chart3_div text[text-anchor='end']");
    for (i = 0; i < axisItems.length; i++) {
        //add the specific link
        //jQuery(axisItems[i]).wrap(" <a xlink:href='http://www.w3schools.com/svg/' target='_blank'>");
        jQuery(axisItems[i]).click(function (item) {
            console.log(this);
            window.open(links_graph3[i], '_blank');
        });
        jQuery(axisItems[i]).css("cursor", "pointer");
    }
//all data
    /*var totalDataArray = [['Bogotá', '45', '71%', '220.009', '44%'],
     ['Barranquilla', '18', '29%', '$281.861.317', '56%'],
     ['Santa Marta', '18', '29%', '$281.861.317', '56%'],
     ['Cali', '18', '29%', '$281.861.317', '56%'],
     ['Armenia', '18', '29%', '$281.861.317', '56%'],
     ['Pereira', '18', '29%', '$281.861.317', '56%'],
     ['Medellín', '18', '29%', '$281.861.317', '56%'],
     ['TOTAL', '63', '100%', '$501.759.250', '100%']];*/
    drawTable(id_table, ['CIUDAD', 'Nº', '%', 'VALOR', '%'], dataTable);

}


//generate data for tables, with values in string, formated
//the format is an array with the next format: ['','x%,'$x','']... t
//where the '' is a position without format, the x% is the value with a postfix of %
// and $x is a prefix with $.. DONT ADD THE FORMAT FOR THE GENERATED %
function generateTableData(dataArray, format) {
    //the data always add an TOTAL row in the end
    tableData = [];
    percents = [];
    totals = [];
    totals[0] = '';//first column empty for name
    for (var i = 1; i < dataArray.length; i++) {
        tableData[i - 1] = [];
        //the first column is the name, push it
        tableData[i - 1].push(dataArray[i][0]);
        var offset = 0;//offset to leave space to the percents
        for (var j = 1; j < dataArray[i].length; j++) {
            if (format[j].startsWith('x')) {
                tableData[i - 1].push(formatNumber(dataArray[i][j]) + format[j].substring(1, format[j].length));
            } else if (format[j].endsWith('x')) {
                tableData[i - 1].push(formatNumber(dataArray[i][j]) + format[j].substring(0, format[j].length - 1));
            } else {
                tableData[i - 1].push(formatNumber(dataArray[i][j]));
            }
            tableData[i - 1].push('percent');
            //add a blank space to add later the percent
            if (totals[j] === undefined) {
                totals[j] = 0;
            }
            totals[j] = totals[j] + dataArray[i][j];
        }
    }
    //now we have an data matrix with the spaces in blank to be filled with the percents
    for (var i = 0; i < tableData.length; i++) {
        //position in the totals array
        var pos = 0;
        var totalPos = 1;
        for (var j = 0; j < tableData[i].length; j++) {
            if (tableData[i][j] === 'percent') {
                var num = ( (dataArray[i + 1][pos - 1] * 100) / totals[totalPos]);
                num = Math.round(num * 100) / 100;
                tableData[i][j] = formatNumber(num) + '%';
                totalPos++;
            } else {
                pos++;
            }
        }
    }
    //now add the last row, the TOTALS
    tableData.push(['TOTAL']);
    for (var j = 1; j < totals.length; j++) {
        var value = totals[j].toString();
        if (format[j].startsWith('x')) {
            value = formatNumber(totals[j]) + format[j].substring(1, format[j].length);
        } else if (format[j].endsWith('x')) {
            value = formatNumber(totals[j]) + format[j].substring(0, format[j].length - 1);
        }
        tableData[tableData.length - 1].push(value);
        tableData[tableData.length - 1].push('100%');
    }
    return tableData;
}


function drawTable(id, names, input_data) {
    var data = new google.visualization.DataTable();
    for (var i = 0; i < names.length; i++) {
        data.addColumn('string', names[i]);
    }
    data.addRows(input_data.length);
    for (var j = 0; j < input_data.length; j++) {
        for (var k = 0; k < input_data[j].length; k++) {
            data.setCell(j, k, input_data[j][k]);
        }
    }
    var view = new google.visualization.DataView(data);
    //view.setColumns([0, 1]);

    var table = new google.visualization.Table(document.getElementById(id));
    table.draw(view, {width: '100%', height: '100%'});

}


function selectHandler(e) {
    var parts = e.targetID.split('#');
    if (parts.indexOf('label') >= 0) {
        var idx = parts[parts.indexOf('label') + 1];
        console.log(data.getValue(parseInt(idx), 0));
    }
}

//format numbers to xx,xxx.xx
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}

/***********
 *
 *
 *
 *
 * **********/
/**
 * Selector of categories to group by name
 * @param id_elem
 */
function createCategoriesSelector(id_elem, id_input_name, id_add_button,id_remove_table) {
    jQuery.each(categories, function (i, item) {
        jQuery('#' + id_elem).append(jQuery('<option >', {
            value: item,
            text: item
        }));
    });
    //max 12 items

    //IF NOT CITIES ARE SELECTED: AUTOSELECT THE FIRST 12
    /*if (selectedCities.length ===0) {
     selectedCities = cities.slice(0,12);
     }
     jQuery('#'+id_elem).chosen({max_selected_options: 12}).change(function(){
     selectedCities= jQuery("#"+id_elem).chosen().val();
     if (selectedCities === null) {
     selectedCities = [];
     }
     });*/
    jQuery('#' + id_elem).chosen();
    jQuery("#" + id_add_button).click(function () {
        var selectedCategories = jQuery("#" + id_elem).chosen().val();
        //first check that the name is not repeated
        var groupName = jQuery("#" + id_input_name).val();
        for (var i = 0; i < group_categories.length; i++) {
            if (groupName === group_categories[i].name) {
                alert("EL NOMBRE YA EXISTE PARA UN GRUPO");
                return;
            }
        }
        //if the name is not repeated in the same graph, add it

        group_categories.push({
            "name": groupName,
            "categories": selectedCategories
        });
        var newItem = jQuery("<li onclick=\"removeItem('"+groupName+"','"+id_elem+"_chosen')\">"+
                '</li>').text(groupName);
        //add the categories list items
        var categoriesString="";
        for (var iCat=0;iCat<selectedCategories.length;iCat++) {
            categoriesString+="<li>"+selectedCategories[iCat]+"</li>";
        }
        jQuery(newItem).append('<ul>' +
            categoriesString +
            '</ul>');
        jQuery('#' + id_remove_table).append(newItem);
        //selectedCategories should check id also

        //Now that we have the group created, must disable the categories in the select
        var listOptions = jQuery("#" + id_elem + "_chosen .chosen-results li");
        for (var j = 0; j < selectedCategories.length; j++) {
            //disable the options manually
            for (var k = 0; k < listOptions.length; k++) {
                if (jQuery(listOptions[k]).html()===selectedCategories[j]) {
                    jQuery(listOptions[k]).removeClass("active-result");
                    jQuery(listOptions[k]).addClass("result-selected");
                }
            }
        }
        selectedCategories = [];
        jQuery("#categoriesSelector_chosen .search-choice").remove();//delete the selecteds
    });
}

function removeItem(groupName,id_selector){
    var categoriesToDelete=[];
    jQuery('#categoriesTable li:contains("'+groupName+'")').remove();
    var pos=-1;
    for (var i = 0; i<group_categories.length;i++) {
        if (group_categories[i].name === groupName) {
            pos = i;
            categoriesToDelete = group_categories[i].categories;
            break;
        }
    }
    if (pos > -1) {
        if (group_categories.length ===1) {
            group_categories =[];
        } else {
            group_categories = group_categories.splice(pos,1);
        }
    }
    for (var j =0;j< categoriesToDelete.length;j++) {
        jQuery('#'+id_selector+' li:contains("' + categoriesToDelete[j] + '")').removeClass("result-selected").addClass("active-result");
    }


}
function deleteCategorieFromGroup(groupname,id_elem) {
//search the group
    for (var i=0;i<group_categories.length;i++) {
        if (group_categories[i].name ===groupname) {
            items= jQuery("#"+id_elem+" .chosen-results .result-selected");
            for (var j =0;j<items.length;j++) {

            }
        }
    }
}
//Graph 1






createCitiesSelector(); //generate the citie's selector for the 3rd graph