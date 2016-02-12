var fs = require('fs'),
    readline = require('readline');
var sqlFile = "";


module.exports = {
    convertCsv: function (user, password) {
        var rd = readline.createInterface({
            input: fs.createReadStream('/Users/robgon/Documents/week.csv'),
            output: process.stdout,
            terminal: false
        });
        var stream = fs.createWriteStream("/tmp/test.txt");
        stream.once('open', function (fd) {
            var i = 0;//cada 5 lineas 1 insert
            newSqlLinePart1 = "insert into week_entry_data(id, win , loss , return_value , return_chart_url," +
                " asset_symbol, main_asset_id , week_number , year , ordering , week_section , week_area ," +
                " week_tab , monday_win , monday_loss , monday_return_value , tuesday_win , tuesday_loss ," +
                " tuesday_return_value , wednesday_win , wednesday_loss , wednesday_return_value , thursday_win ," +
                " thursday_loss , thursday_return_value , friday_win , friday_loss , friday_return_value ) values ";
            stream.write(newSqlLinePart1);
            daysArray="";
            chartUrl ="''";
            weekUp=0;
            weekValue=0;
            weekDown=0;
            weekSymbol="";
            main_asset_id = "";
            ordering = "";
            week_section ="";
            week_area = "";
            week_tab ="";
            weekNumber="";
            weekYear = "";
            updateLine="";
            rd.on('line', function (line) {

                arrayData = line.split(","); // ID 0,up1, year2, week3, day4, down5, value6, symbol7
                if (arrayData[4] === "0")//nueva semana
                {
                    daysArray = "";
                    weekUp = arrayData[1];
                    weekDown = arrayData[5];
                    weekValue = parseFloat(arrayData[6]).toFixed(2);
                    weekSymbol = arrayData[7];
                    weekSymbol = weekSymbol.split("\"").join("");
                    weekNumber = arrayData[3];
                    weekYear = arrayData[2];
                    //extra data
                    chartUrl = "(select return_chart_url from week_entry_data where asset_symbol = '"+weekSymbol+"' and year = 2015 and week_number = "+weekNumber+")";
                    main_asset_id = "(select main_asset_id from week_entry_data where asset_symbol = '"+weekSymbol+"' and year = 2015 and week_number = "+weekNumber+")";
                    //--los main_asset_id seran escritos tal cual de 2015, y luego se hace un update
                    //update week_entry_data set main_asset_id = (select id from
                      week_section = "(select week_section from week_entry_data where asset_symbol = '"+weekSymbol+"' and year = 2015 and week_number = "+weekNumber+")";
                    week_area ="(select week_area from week_entry_data where asset_symbol = '"+weekSymbol+"' and year = 2015 and week_number = "+weekNumber+")";
                    ordering ="(select ordering from week_entry_data where asset_symbol = '"+weekSymbol+"' and year = 2015 and week_number = "+weekNumber+")";
                    week_tab ="(select week_tab from week_entry_data where asset_symbol = '"+weekSymbol+"' and year = 2015 and week_number = "+weekNumber+")";
                } else {
                    daysArray += ","+arrayData[1] + "," + arrayData[5] + "," + parseFloat(arrayData[6]).toFixed(2);
                    console.log("reading " + line + " -----" + arrayData[1] + "," + arrayData[5] + "," + parseFloat(arrayData[6]).toFixed(2));
                }

                if (arrayData[4] ==="5") {//ultimo dia, generar linea
                    console.log("FINAL INSERT - "+daysArray);
                    line = "(nextval('week_entry_data_seq')," + weekUp+","+weekDown+","+weekValue+","+chartUrl+",'"+weekSymbol+"',"+main_asset_id+","+weekNumber+","+weekYear+","+ordering+","+
                            week_section+","+week_area+","+week_tab+daysArray+"),";
                    stream.write(line+"\n");
                }


  //              update week_entry_data as b set main_asset_id = a.id from week_entry_data as a where a.asset_symbol = (select asset_symbol from week_entry_data as c where c.id = b.main_asset_id) and a.week_number= (select week_number from week_entry_data as d where d.id = b.main_asset_id) and a.year = 2016 and a.main_asset_id is null and b.year = 2016;


                //update week_entry_data as b set return_chart_url = a.return_chart_url from week_entry_data as a where a.year = 2016 and a.week_number = 2 and b.year = 2016 and b.week_number = 1 and a.asset_symbol = b.asset_symbol and a.week_tab = b.week_tab and a.week_section = b.week_section and a.week_area= b.week_area;



                /*fs.writeFile("", line + "TEST", function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                });*/
            });
        });
    }
};
/**
 Column         |          Type          | Modifiers
 ------------------------+------------------------+-----------
 id                     | bigint                 | not null
 win                    | integer                | not null
 loss                   | integer                | not null
 return_value           | numeric                | not null
 return_chart_url       | character varying(255) | not null
 asset_symbol           | character varying(255) |
 main_asset_id          | bigint                 |
 week_number            | integer                | not null
 year                   | integer                | not null
 ordering               | integer                | not null
 week_section           | integer                | not null
 week_area              | integer                | not null
 week_tab               | integer                | not null
 monday_win             | integer                | not null
 monday_loss            | integer                | not null
 monday_return_value    | numeric                | not null
 tuesday_win            | integer                | not null
 tuesday_loss           | integer                | not null
 tuesday_return_value   | numeric                | not null
 wednesday_win          | integer                | not null
 wednesday_loss         | integer                | not null
 wednesday_return_value | numeric                | not null
 thursday_win           | integer                | not null
 thursday_loss          | integer                | not null
 thursday_return_value  | numeric                | not null
 friday_win             | integer                | not null
 friday_loss            | integer                | not null
 friday_return_value    | numeric                | not null
 **/