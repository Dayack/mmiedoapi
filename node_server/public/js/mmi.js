window.onload = createChart()
//all cities loaded
var cities = ['Bogotá',
    'Barranquilla',
    'Santa Marta',
    'Cali',
    'Armenia',
    'Pereira',
    'Medellín'];


var selectedCities = [];

function createCitiesSelector() {


        jQuery.each(cities, function (i, item) {
            jQuery('#citySelector').append(jQuery('<option>', {
                value: item,
                text : item
            }));
        });
    jQuery('#citySelector').chosen().change(function(){
        selectedCities= jQuery("#citySelector").chosen().val();
    });



}

createCitiesSelector();
//Graph 1
function createChart() {
    // Load the Visualization API and the piechart package.
    google.load('visualization', '1.0', {'packages': ['corechart', 'table']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.setOnLoadCallback(drawCharts);
}

var data;

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart_1() {

    // Create the data table.
    data = new google.visualization.arrayToDataTable([
        ['Media', 'noticias', 'valor'],
        ['Prensa', 17, 198009548],
        ['Radio', 17, 243861317],
        ['Television', 8, 37836670],
        ['Internet', 21, 22051715]
    ]);

    // Set chart options
    var options = {
        title: 'CATEGORIA: FORD',
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
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    //add links
    var axisItems = jQuery("#chart_div text[text-anchor='middle']");
    for (i = 0; i < axisItems.length; i++) {
        //add the specific link
        //jQuery(axisItems[i]).wrap(" <a xlink:href='http://www.w3schools.com/svg/' target='_blank'>");
        jQuery(axisItems[i]).click(function () {
            window.open('http://www.siglodata.co/s/observatorio/PrensaBaxtereneroadic2014.PDF', '_blank');
        });
        jQuery(axisItems[i]).css("cursor", "pointer");
    }


    google.visualization.events.addListener(chart, 'click', selectHandler)

    var dataArray = [['PRENSA', '17', '27%', '$198.009', '39%'],
        ['RADIO', '17', '27%', '$243.861.317', '49%'],
        ['TELEVISION', '8', '13%', '$37.836.670', '8%'],
        ['INTERNET', '21', '33%', '$22.051.715', '4%'],
        ['TOTAL', '63', '100%', '$501.759.250', '100%']];

    drawTable('table_div', ['MEDIO', 'Nº Noticias', '%', 'VALOR', '%'], dataArray);
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart_2() {

    // Create the data table.
    data = new google.visualization.arrayToDataTable([
        ['Media', 'noticias', 'valor'],
        ['Nacional', 17, 198009548],
        ['Regional', 20, 243861317]
    ]);

    // Set chart options
    var options = {
        title: 'CATEGORIA: FORD',
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
    var chart = new google.visualization.ComboChart(document.getElementById('chart2_div'));
    chart.draw(data, options);
    //add links
    var axisItems = jQuery("#chart2_div text[text-anchor='middle']");
    for (i = 0; i < axisItems.length; i++) {
        //add the specific link
        //jQuery(axisItems[i]).wrap(" <a xlink:href='http://www.w3schools.com/svg/' target='_blank'>");
        jQuery(axisItems[i]).click(function () {
            window.open('http://www.siglodata.co/s/observatorio/PrensaBaxtereneroadic2014.PDF', '_blank');
        });
        jQuery(axisItems[i]).css("cursor", "pointer");
    }


    google.visualization.events.addListener(chart, 'click', selectHandler)


    var dataArray = [['Nacional', '45', '71%', '220.009', '44%'],
        ['Regional', '18', '29%', '$281.861.317', '56%'],
        ['TOTAL', '63', '100%', '$501.759.250', '100%']];

    drawTable('table2_div', ['CUBRIMIENTO', 'Nº Noticias', '%', 'VALOR', '%'], dataArray);
}


function drawChart_3() {

    var colors = ['red','blue','yellow','green','brown','purple','orange'];
//all cities with its data
    var cityData = [
        ['Ciudad', 'noticias', {role: 'style'}],
        ['Barranquilla', 17, 'red'],
        ['Santa Marta', 20, 'blue'],
        ['Cali', 20, 'green'],
        ['Pereira', 20, 'yellow'],
        ['Medellín', 20, 'blue']
    ];

    //create the data for graph


    // Create the data table.
    data = new google.visualization.arrayToDataTable(cityData);

    // Set chart options
    var options = {
        title: 'CATEGORIA: FORD',
        width: 800,
        height: 600,
        vAxis: {},
        hAxis: {minValue: 0}

    };


    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('chart3_div'));
    chart.draw(data, options);
    //add links
    var axisItems = jQuery("#chart3_div text[text-anchor='end']");
    for (i = 0; i < axisItems.length; i++) {
        //add the specific link
        //jQuery(axisItems[i]).wrap(" <a xlink:href='http://www.w3schools.com/svg/' target='_blank'>");
        jQuery(axisItems[i]).click(function () {
            window.open('http://www.siglodata.co/s/observatorio/PrensaBaxtereneroadic2014.PDF', '_blank');
        });
        jQuery(axisItems[i]).css("cursor", "pointer");
    }
//all data
    var totalDataArray = [['Bogotá', '45', '71%', '220.009', '44%'],
        ['Barranquilla', '18', '29%', '$281.861.317', '56%'],
        ['Santa Marta', '18', '29%', '$281.861.317', '56%'],
        ['Cali', '18', '29%', '$281.861.317', '56%'],
        ['Armenia', '18', '29%', '$281.861.317', '56%'],
        ['Pereira', '18', '29%', '$281.861.317', '56%'],
        ['Medellín', '18', '29%', '$281.861.317', '56%'],
        ['TOTAL', '63', '100%', '$501.759.250', '100%']];

    drawTable('table3_div', ['CIUDAD', 'Nº', '%', 'VALOR', '%'], totalDataArray);

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

function drawCharts() {
    drawChart_1();
    drawChart_2();
    drawChart_3();
    createCitiesSelector();
}
function selectHandler(e) {
    var parts = e.targetID.split('#');
    if (parts.indexOf('label') >= 0) {
        var idx = parts[parts.indexOf('label') + 1];
        console.log(data.getValue(parseInt(idx), 0));
    }
}
