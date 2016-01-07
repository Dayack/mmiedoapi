window.onload = createChart()
//all cities loaded
////GLOBAL VARS TO ALL FILES
var monthNames= [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];
var graf_types=["grafica1","grafica2","grafica3"];
/*var colors= ["#94368d","#4a87b9","#3daca6","#8877a9","#d25455","#BB98bc","#9cb4d5","#9fceca","#b7accc","#e49d94",
"#e2d1e8","#c5d1e7","#cae2e0","#d3cce1","#efc6be"];*/

//purples
/*var colors= ["#733372","#94368d","#461943","#8c5689","#BB98bc","#62375b","#a57ea5","#e2d1e8","#815f7c","#c1a8c3",
    "#ede3f2","#d0c4d0"];*/

//various colors
var colors= ["#947ab6","#e83b68","#ef906f","#3daca6","#a894c6","#ed6d84","#3a88a","#9fceca","#a894c6","#f297a3",
 "#f6bfa7","#cae2e0"];


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
            //createCategoriesSelector("categoriesSelector", "categoriesInput", "categoriesButton","categoriesTable");
            drawChart_2('chart_div','table_div');
            break;
        case "grafica3":
            drawChart_3('chart_div','table_div');
            //createCitiesSelector();
            break;
        default:
            jQuery("#chart_div").append("NO SE HA ENCONTRADO TIPO DE GRAFICA");
    }
    //create title
    jQuery("#graph-title").html(nombre_informe);
    /*if (nombre_categoria !== null && nombre_categoria !=="") {
        jQuery("#inform-name").html(nombre_categoria);
    }*/
    var from_date = fecha_desde.substr(0,2) + "/" +fecha_desde.substr(2,2)+"/" +fecha_desde.substr(4,4);
    var to_date = fecha_hasta.substr(0,2) + "/" +fecha_hasta.substr(2,2)+"/" +fecha_hasta.substr(4,4);
    jQuery("#from").html(from_date); jQuery("#to").html(to_date);
}


///---charts code


// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart_1(id_chart,id_table) {

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
        backgroundColor: { fill:'transparent' },
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
        //graph_data[i + 1].push('#ed7d31');

        graph_data[i + 1].push(colors[i % colors.length]);
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
        backgroundColor: { fill:'transparent' },
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
        backgroundColor: { fill:'transparent' },
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
                var num = 0;
                if (dataArray[i + 1][pos - 1]  !==0) {
                    var num = ( (dataArray[i + 1][pos - 1] * 100) / totals[totalPos]);
                    num = Math.round(num * 100) / 100;
                }
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

function edit_inform(){

    window.location.href = '/manage_page?id_usuario='+id_usuario+'&id_zona='+id_zona+'&id_informe='+id_informe;

}