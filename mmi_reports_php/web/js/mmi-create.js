//var of selections

var selected_categories=[];
var groups= [];
var free_categories=[];
var actual_group={};
var editing = false;//is editing a view?

var graph_types=[{"type":"grafica1", "name":"Gráfica de Medios"},
    {"type":"grafica2", "name":"Gráfica de Barras verticales"},
    {"type":"grafica3", "name":"Gráfica de horizontales"}];


function checkGroupEditor() {
    if (jQuery("#graph_selector").val() ==="grafica1") {
        jQuery("#group_editor").hide();

        jQuery("#group_name_alert").hide();
        jQuery("#category_creator_alert").hide();
    } else {
        jQuery("#group_editor").show();
    }

}
function load_categories(){

    if (informe !==null) {

        createPreDefinedGroups();
    }
    //the categories selector is created with the free_categories only
    createFreeCategoriesList();

    jQuery.each(free_categories, function (i, item) {
        jQuery('#cat_selector').append(jQuery('<option>', {
            value: item.id,
            text: item.name
        }));
    });
    jQuery("#cat_selector").chosen();
}

function load_graph_selector(){
    jQuery.each(graph_types, function (i, item) {
        jQuery('#graph_selector').append(jQuery('<option>', {
            value: item.type,
            text: item.name
        }));
    });
}

/**
 * create the groups of the actual view
 */
function createPreDefinedGroups(){
    if (typeof informe !== "undefined" && informe !==null  && informe !=="") {

        if (informe.length >0) {
            informe= informe[0];
        }
        if (informe instanceof  Array && informe.length == 0) {
            return;
        }
        editing=true;
        jQuery.each(informe.grupo_de_categorias, function (i, grupo) {
            var new_group = {
                name: grupo.nombre_grupo_de_categorias,
                categories: []
            }
            var new_categories = [];
            jQuery.each(grupo.categorias, function (j, categoria_id) {
                for (var k = 0; k < id_categorias.length; k++) {
                    if (id_categorias[k].toString() === categoria_id.toString()) {
                        //create the categorie
                        new_categories.push({
                            id: categoria_id,
                            name: nombre_categorias[k]
                        });
                    }
                }
            });
            new_group.categories = new_categories;
            groups.push(new_group);
            fillList(new_group,jQuery("#grupo_list"));
        });
        jQuery("#graph-selector").val(informe.tipo_informe);
        jQuery("#nombre_informe").val(informe.nombre_informe);
        checkGroupEditor();
    }
}
/**
 * Create a group, create the list of categories associated and check all data is OK
 */
function create_group(){
    //Cant create group with the same name
    var exit= false;
    group_name = jQuery("#nombre_grupo").val();
    var selector_cat=jQuery("#cat_selector").chosen({
        no_results_text:"No se han encontrado resultados",
        placeholder_text_multiple: "selecione Categorías"
    }).val();
    if (selector_cat===null) {
        jQuery("#category_creator_alert").show();
        exit=true;
    }
    if (group_name.length ===0) {
        jQuery("#group_name_alert").show();
        exit=true;
    }

    jQuery.each(groups,function(i,item){
        if (item.name === group_name) {
            jQuery("#group_name_alert").show();
            exit=true;
        }
    });
    if (exit) {
        return exit;
    } else {

        jQuery("#group_name_alert").hide();
        jQuery("#category_creator_alert").hide();
    }
    selected_categories=[];
    jQuery.each(selector_cat,function(i,item){
        for (var j =0;j<id_categorias.length;j++) {
            if (id_categorias[j].toString() === item) {
                selected_categories.push({
                    name: nombre_categorias[j],
                    id: item
                });
            }
        }
    });
    actual_group = {
        name: group_name,
        categories: selected_categories
    };
    fillList(actual_group,jQuery("#grupo_list"));
    groups.push(actual_group);
    //delete the chosen and re-create it
    //must re-create only with the free items
    updateChosen();
    jQuery("#nombre_grupo").val("");
}


/**
 * createItem in the inform list
 */
function fillList(new_group,groupList) {

    jQuery("#group-error").hide();
    var categories_append_list ="<div id='categories_id_"+new_group.name+"'><ul>";

    jQuery.each(new_group.categories,function(i,item){
        categories_append_list += '<li>'+item.name+'</li>';
    });
    categories_append_list +='</ul></div>';
    groupList.append('<li id="group_li_'+new_group.name+'"><div class="glyphicon glyphicon-remove close-group" onclick="deleteGroup(\''+new_group.name+'\');"></div><div class="group-item" id="group_id_'+new_group.name+
        '" onclick="selectView(\''+new_group.name+'\')">'+new_group.name+'</div>'+
        categories_append_list
        +'</li>');

}
//refresh the free cateogires to select array
function createFreeCategoriesList() {
    free_categories = [];

    if (groups.length === 0) {
        //fill free_categories array
        jQuery.each(nombre_categorias, function (i, item) {
            free_categories.push(
                {
                    name: item,
                    id: id_categorias[i]
                }
            );
        });
    } else {
        jQuery.each(id_categorias, function (i, id_cat) {
            var cat_found = false;
            for (var j = 0; j < groups.length; j++) {
                jQuery.each(groups[j].categories, function (k, item) {
                    if (item.id.toString() === id_cat.toString()) {
                        cat_found = true;
                    }
                });
            }
            if (!cat_found) {
                free_categories.push(
                    {
                        id: id_cat,
                        name: nombre_categorias[i]
                    }
                );
            }
        });

    }

}
//delete group from list and refresh the selector
function deleteGroup(name_group) {
    var pos = -1;
    var groups_copy = [];
    for (var i = 0; i <groups.length;i++) {
        if (groups[i].name !== name_group) {
            groups_copy.push(groups[i]);
        }
    }
  groups = groups_copy.slice();
    jQuery("#group_li_"+name_group).remove();
    updateChosen();
}
//re-generate the chosenJs selector
function updateChosen(){
    createFreeCategoriesList();
    jQuery("#cat_selector").empty();
    jQuery.each(free_categories, function (i, item) {
        jQuery('#cat_selector').append(jQuery('<option>', {
            value: item.id,
            text: item.name
        }));
    });
    jQuery("#cat_selector").trigger("chosen:updated");
}

function createInform(){
    var grupos = [];
    var tipo_grafica = jQuery("#graph_selector").val();
    var exit = false;
    if (tipo_grafica !=="grafica1") {
        if (groups.length === 0) {

            jQuery("#group-error").show();
            exit = true;
        } else {

            jQuery("#group-error").hide();
        }
    } else {
        jQuery("#group-error").hide();
    }
    if (jQuery("#nombre_informe").val() ==="") {
        jQuery("#inform-error").show();
        exit = true;
    } else {
        jQuery("#inform-error").hide();
    }
    if (exit) {
        return;
    }
    if (tipo_grafica!=="grafica1") {
        for (var i = 0; i < groups.length; i++) {
            var category_ids = [];
            jQuery.each(groups[i].categories, function (j, item) {
                category_ids.push(item.id);
            });

            grupos.push({
                "nombre_grupo_de_categorias": groups[i].name,
                "categorias": category_ids

            });
        }
    }
    var data = {
        "idusuario": id_usuario,
        "tipo_informe": tipo_grafica,
        "nombre_informe": jQuery("#nombre_informe").val(),
        "grupo_de_categorias": grupos

    };
    if (editing) {
        data.id_informe= id_informe;
    }

    jQuery.ajax({
        type: "POST",
        url: "/save_page?id_zona="+id_zona,
        data: JSON.stringify(data),
        dataType:"json",

    }).done(function(){
        window.location.href = '/info_page?id_usuario='+id_usuario+'&id_zona='+id_zona;
    }
).fail(function(){
        window.location.href = '/info_page?id_usuario='+id_usuario+'&id_zona='+id_zona;
    });
}


jQuery(document).ready(function() {
        jQuery("#inform-error").hide();
        jQuery("#group-error").hide();
        jQuery("#group_editor").hide();
        jQuery("#group_name_alert").hide();
        jQuery("#category_creator_alert").hide();
        load_categories();
        load_graph_selector();


    }
);