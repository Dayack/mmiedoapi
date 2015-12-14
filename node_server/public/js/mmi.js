window.onload = createChart()
//all cities loaded



/************ VARS TO BE OVERWRITTEN ************/
var cities = ['Bogotá','Barranquilla','Santa Marta','Cali','Armenia','Pereira','Medellín'];
//arrays of series
//graph1, the MEDIA must be in the same order: press, radio, tv, internet
var news_graph1 = [17,12,8,21];
var valor_graph1 = [198009548,243861317,37836670,22051715];
//second graph, nacional vs regional
var news_graph2 = [ 17,20];
var valor_graph2 = [243861317,198009548];
//third graph news by cities //same order that the city array
var news_graph3 = [1,2,3,4,5,6,7];
var valor_graph3 = [243861317,198009548,243861317,243861317,243861317,243861317,243861317];


/***************************************/
//vars for internal functionality
var selectedCities = [];

var data;
function createCitiesSelector() {


        jQuery.each(cities, function (i, item) {
            jQuery('#citySelector').append(jQuery('<option>', {
                value: item,
                text : item
            }));
        });
    //max 12 items

    //IF NOT CITIES ARE SELECTED: AUTOSELECT THE FIRST 12
    if (selectedCities.length ===0) {
        selectedCities = cities.slice(0,12);
    }
    jQuery('#citySelector').chosen({max_selected_options: 12}).change(function(){
        selectedCities= jQuery("#citySelector").chosen().val();
        if (selectedCities === null) {
            selectedCities = [];
        }
        drawChart_3();
    });



}

createCitiesSelector(); //generate the citie's selector for the 3rd graph
//Graph 1
function createChart() {
    // Load the Visualization API and the piechart package.
    google.load('visualization', '1.0', {'packages': ['corechart', 'table']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.setOnLoadCallback(drawCharts);
}



// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart_1() {
	var graph_data= [ ['Media', 'noticias', 'valor']];
	var medias = ['Prensa','Radio','Televisión','Internet'];
	var j = 0; //pos in the input array of data
	for (var i=0; i< medias.length;i++) {
		graph_data[i+1] = [medias[i]];
		graph_data[i+1].push(news_graph1[j]);
		graph_data[i+1].push(valor_graph1[j]);
		j++;
	}
    // Create the data table.
    data = new google.visualization.arrayToDataTable(graph_data);

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
        jQuery(axisItems[i]).click(function () {
            window.open('http://www.siglodata.co/s/observatorio/PrensaBaxtereneroadic2014.PDF', '_blank');
        });
        jQuery(axisItems[i]).css("cursor", "pointer");
    }


    google.visualization.events.addListener(chart, 'click', selectHandler)

   /* var dataArray = [['PRENSA', '17', '27%', '$198.009', '39%'],
        ['RADIO', '17', '27%', '$243.861.317', '49%'],
        ['TELEVISION', '8', '13%', '$37.836.670', '8%'],
        ['INTERNET', '21', '33%', '$22.051.715', '4%'],
        ['TOTAL', '63', '100%', '$501.759.250', '100%']];*/

    dataTable = generateTableData(graph_data,['','','$x']);
    drawTable('table_div',['MEDIO','Nº Noticias','%','VALOR','%'],dataTable);
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart_2() {

    var graph_data = [['Media', 'noticias', 'valor']];
    var divisions = ['Nacional','Regional'];
    // Create the data table.
    var j = 0;
    for (var i=0; i< divisions.length;i++) {
        graph_data[i+1] = [divisions[i]];
        graph_data[i+1].push(news_graph2[j]);
        graph_data[i+1].push(valor_graph2[j]);
        j++;
    }
    // Create the data table.
    data = new google.visualization.arrayToDataTable(graph_data);

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


    /*var dataArray = [['Nacional', '45', '71%', '220.009', '44%'],
        ['Regional', '18', '29%', '$281.861.317', '56%'],
        ['TOTAL', '63', '100%', '$501.759.250', '100%']];*/

    dataTable = generateTableData(graph_data,['','','$x']);
    drawTable('table2_div', ['CUBRIMIENTO', 'Nº Noticias', '%', 'VALOR', '%'], dataTable);
}


function drawChart_3() {


    var colors = ['red','blue','yellow','green','brown','purple','orange'];
    //the array generator must select the cities that are selected by the user, and the rest in one bar
    //at the end of the graph

    //in this case we are going to generate 2 matrix, one with colors and anothers without colors
    // to get the data for the graph, and the data for the table


    var graph_data = [['Ciudad', 'noticias']];
    var graph_data_table = [['Ciudad', 'noticias']];
    var j = 0;
    var other_cities= ['Otras Ciudades',0];
    var other_cities_table= ['Otras Ciudades',0,0];
    //now loop all the cities, asking if are selected or not
    //selected Cities only can contain max 12 items
    var posGraph = 1;
    for (var i=0; i< cities.length;i++) {
        if (selectedCities.indexOf(cities[i]) <0) {
            //city not selected
            other_cities[1] =  other_cities[1]+ news_graph3[i];
            other_cities_table[1] =  other_cities_table[1]+ news_graph3[i];
            other_cities_table[2] =  other_cities_table[2]+ valor_graph3[i];
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
    }
    //now add the last bar, the 'Other Cities'
    if (cities.length> selectedCities.length) {
        graph_data.push(other_cities);
        graph_data_table.push(other_cities_table);

    }

    dataTable = generateTableData(graph_data_table,['','','$x']);
    //now add the colors for the graph:
    graph_data[0].push( {role: 'style'});
    var colorPos = 0;
    for (var k = 1;k<graph_data.length;k++) {
        graph_data[k].push(colors[colorPos % colors.length]);
        colorPos++;
    }




    // Create the data table.
    data = new google.visualization.arrayToDataTable(graph_data);

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
    /*var totalDataArray = [['Bogotá', '45', '71%', '220.009', '44%'],
        ['Barranquilla', '18', '29%', '$281.861.317', '56%'],
        ['Santa Marta', '18', '29%', '$281.861.317', '56%'],
        ['Cali', '18', '29%', '$281.861.317', '56%'],
        ['Armenia', '18', '29%', '$281.861.317', '56%'],
        ['Pereira', '18', '29%', '$281.861.317', '56%'],
        ['Medellín', '18', '29%', '$281.861.317', '56%'],
        ['TOTAL', '63', '100%', '$501.759.250', '100%']];*/
    drawTable('table3_div', ['CIUDAD', 'Nº', '%', 'VALOR', '%'], dataTable);

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

//generate data for tables, with values in string, formated 
//the format is an array with the next format: ['','x%,'$x','']... t
//where the '' is a position without format, the x% is the value with a postfix of %
// and $x is a prefix with $.. DONT ADD THE FORMAT FOR THE GENERATED %
function generateTableData(dataArray,format){
	//the data always add an TOTAL row in the end
	tableData=[];
	percents=[];
	totals = [];
	totals[0]='';//first column empty for name
	for (var i=1; i<dataArray.length;i++){
		tableData[i-1] = [];
		//the first column is the name, push it
		tableData[i-1].push(dataArray[i][0]);	
		var offset = 0;//offset to leave space to the percents
		for (var j=1;j<dataArray[i].length;j++) {
			if (format[j].startsWith('x')) {
				tableData[i-1].push(formatNumber(dataArray[i][j])+format[j].substring(1,format[j].length));				
			} else if (format[j].endsWith('x')) {
				tableData[i-1].push(formatNumber(dataArray[i][j])+ format[j].substring(0,format[j].length-1));				
			}  else {
				tableData[i-1].push(formatNumber(dataArray[i][j]));
			}
			tableData[i-1].push('percent');
			//add a blank space to add later the percent
			if (totals[j] ===undefined) {
				totals[j]=0;
			}
			totals[j] = totals[j] + dataArray[i][j];
		}
	}
	//now we have an data matrix with the spaces in blank to be filled with the percents
	for (var i=0;i<tableData.length;i++){
		//position in the totals array
		var pos=0;
		var totalPos = 1;
		for (var j = 0;j<tableData[i].length;j++) {
			if (tableData[i][j] === 'percent') {
				var num = ( (dataArray[i+1][pos-1]*100)/ totals[totalPos]);
				num = Math.round(num * 100) / 100;
				tableData[i][j] = formatNumber(num)+'%';
				totalPos++;
			} else {
				pos++;
			}
		}
	}
	//now add the last row, the TOTALS
	tableData.push(['TOTAL']);
	for (var j = 1; j< totals.length;j++) {
		var value = totals[j].toString();
		if (format[j].startsWith('x')) {
			value = formatNumber(totals[j])+format[j].substring(1,format[j].length);				
		} else if (format[j].endsWith('x')) {
			value=formatNumber(totals[j])+ format[j].substring(0,format[j].length-1);				
		}  
		tableData[tableData.length-1].push(value);
		tableData[tableData.length-1].push('100%');
	}
	return tableData;
}
//format numbers to xx,xxx.xx
function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}
