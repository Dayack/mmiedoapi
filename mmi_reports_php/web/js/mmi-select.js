var days=[ "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ];
var dayNamesShort= [ "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab" ];
var categories=[];

//generate the datepickers
function createDateSelectors(){

    $('#daterange').daterangepicker({
        "locale": {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "Desde",
            "toLabel": "Hasta",
            "customRangeLabel": "Personalizado",
            "daysOfWeek": [
                "Do",
                "Lu",
                "Ma",
                "Mi",
                "Ju",
                "Vi",
                "Sa"
            ],
            "monthNames": [
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
            ],
            "firstDay": 1
        },
        "linkedCalendars": false
    });

    /*jQuery( "#startDate" ).datepicker({
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
     });*/
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
        if (views[i].id_informe.toString() === id) {
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
    //generate categories array
    for (var i=0;i<nombre_categorias.length;i++) {
        categories.push({
            id: id_categorias[i],
            name: nombre_categorias[i]
        })
    }

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