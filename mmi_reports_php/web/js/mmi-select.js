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
    jQuery.each(informes,function(){
        viewList.append('<li><div id="view_id_'+this.id_informe+'" onclick="selectView(\''+this.id_informe+'\')">'+this.nombre_informe+'</div></li>');
    });
}




//select a view in the list
function selectView(id) {
    jQuery("#viewList li").removeClass("selected-graph");//may not work
    var graphType=null;
    for (var i=0;i<informes.length;i++) {
        jQuery("#view_id_"+informes[i].id_informe).removeClass("selected-graph");
        if (informes[i].id_informe.toString() === id.toString()) {
            graphType = informes[i].tipo_informe;
        }
    }
    jQuery("#view_id_"+id).addClass("selected-graph");
    //disable category selector if graph is type 1
    if (graphType ==="grafica1") {
        jQuery("#categorySelectorBlock").show();
    } else {
        jQuery("#categorySelectorBlock").hide();
    }

}

//got to defined graph
function goToGraph(){
    //configure a new URL to go
    var viewId=jQuery(".selected-graph").attr("id");
    //the id is 'view_id_XX' where XX is the ID view
    viewId = viewId.substr(8);
    var categoryId = null;//category is necessary if the graph is type1
    jQuery.each(informes,function(){
        if (this.id_informe.toString() === viewId.toString()) {
            if (this.tipo_informe === "grafica1") {
                categoryId = jQuery("#categorySelect").val();
            }
        }
    });
    //extract dates
var range = jQuery("#daterange").val();
    var startDate = start = range.substr(0,10).split("/").join("");
    var endDate = range.substr(13,10).split("/").join("");

    window.open(mmiconfig.baseUrl+'/graph_page?id_informe='+viewId+(categoryId ===null ? "": "&id_categoria="+categoryId)+
        "&desde="+startDate+"&hasta="+endDate+"id_usuario="+userId+"&id_zona="+zonaId,'_blank');
}

//got to create web
function goToCreate(data) {
    window.location.href = mmiconfig.baseUrl+'/manage_page?id_usuario='+userId+'&id_zona='+zonaId;
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
    jQuery("#categorySelectorBlock").hide();
    createDateSelectors();
    createCategorySelector();
    createViewList();
    //if a default view is selected, trigger selection
    if (id_informe != null && id_informe>0) {
        selectView(id_informe);
    }
});