<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Ci\RestClientBundle\Services\RestClient;
use Ci\RestClientBundle\Services\Curl;
use Ci\RestClientBundle\Services\CurlOptionsHandler;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class MmiApiController extends Controller
{
    
    /**
     * @Route("/info_page")
     */
    public function info_page(Request $request)
    {
        //http://localhost:8000/info_page?id_zona=1&id_usuario=1344&id_informe=1
        $request_data = array('id_usuario','id_zona','id_informe');
        foreach ($request_data as $request_value) {
            if (strlen($request->query->get($request_value)) > 0) {
                $$request_value = $request->query->get($request_value);
            }
            else {
                $$request_value = 0;
            }
        }
        
        $base_url = 'http://api.mmi-e.com/mmiapi.php/';
        $apikey = 'DFKGMKLJOIRJNG';
        $getusuarios_perfil = $base_url.'getusuarios_perfil/'.$apikey.'/'.$id_zona.'/'.$id_usuario;
            //$response_decode[0]->{'IDPERFIL'}
        $getperfiles_categorias = $base_url.'getperfiles_categorias/'.$apikey.'/'.$id_zona.'/';
        $getcategoria_detalle = $base_url.'getcategoria_detalle/'.$apikey.'/'.$id_zona.'/';
            //$response_decode[0]->{'NOMBREWEB'}
        $getvistanombres = $base_url.'getvistanombres/'.$apikey.'/'.$id_zona.'/'.$id_usuario;
        
        $usuario_categorias_id = array();
        $usuario_categorias_nombre = array();
        $informes = '';
        if ($id_zona > 0 && $id_usuario > 0) {
            $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));
            
    // inicio conseguir idperfil
            $response = $restClient->get($getusuarios_perfil);
            $response_decode = json_decode($response->getContent());
            if (gettype($response_decode[0]) != 'boolean') {
                $idperfil = $response_decode[0]->{'IDPERFIL'};
    // fin conseguir idperfil
                
    // inicio conseguir id categorias
                $response = $restClient->get($getperfiles_categorias.$idperfil);
                $response_decode = json_decode($response->getContent());
                if (count($response_decode)> 0) {
                    foreach ($response_decode as $value_category) {
                        if (!in_array($value_category->{'IDCATEGORIA'},$usuario_categorias_id)) {
                            $usuario_categorias_id[] = $value_category->{'IDCATEGORIA'};
                        }
                    }
                    sort($usuario_categorias_id);
    // fin conseguir id categorias
                    
    // inicio conseguir nombre categorias
                    foreach ($usuario_categorias_id as $categoria_id) {
                        $response = $restClient->get($getcategoria_detalle.$categoria_id);
                        $response_decode = json_decode($response->getContent());
                        $usuario_categorias_nombre[] = $response_decode[0]->{'NOMBREWEB'};
                    }
    // fin conseguir nombre categorias
                }
    // inicio conseguir datos vistas
/*
                $response = $restClient->get($getvistanombres);
                $response_decode = json_decode($response->getContent());
                if (count($response_decode)> 0) {
                }
*/
                $informes = '{"id_informe": 1, "nombre_informe": "Vista de cubrimiento 1", "tipo_informe" : "grafica1"}, {"id_informe": 2, "nombre_informe": "vista de cubrimiento 2", "tipo_informe": "grafica2"}';
    // fin conseguir datos vistas
            }
        }

        return $this->render('mmiapi/template1.html.twig', array(
            'id_usuario' => $id_usuario,
            'id_zona' => $id_zona,
            'id_informe' => $id_informe,

            'nombre_categorias' => '"'.implode('","', $usuario_categorias_nombre).'"',
            'id_categorias' => implode(",", $usuario_categorias_id),
            'informes' => $informes,
            
        ));
        /*
                $url = $getnoticiasprensa_categoria_precio;

                $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));
                $response = $restClient->get($url);
                $response_decode = json_decode($response->getContent());
                return $response;
                return new Response($response_decode[0]->{'NUM'});
        */
    }

    /**
     * @Route("/manage_page")
     */
    public function manage_page(Request $request)
    {
        //http://localhost:8000/manage_page?id_zona=1&id_usuario=1344&id_informe=1
        $request_data = array('id_usuario','id_zona','id_informe');
        foreach ($request_data as $request_value) {
            if (strlen($request->query->get($request_value)) > 0) {
                $$request_value = $request->query->get($request_value);
            }
            else {
                $$request_value = 0;
            }
        }

        $base_url = 'http://api.mmi-e.com/mmiapi.php/';
        $apikey = 'DFKGMKLJOIRJNG';
        $getusuarios_perfil = $base_url.'getusuarios_perfil/'.$apikey.'/'.$id_zona.'/'.$id_usuario;
            //$response_decode[0]->{'IDPERFIL'}
        $getperfiles_categorias = $base_url.'getperfiles_categorias/'.$apikey.'/'.$id_zona.'/';
        $getcategoria_detalle = $base_url.'getcategoria_detalle/'.$apikey.'/'.$id_zona.'/';
            //$response_decode[0]->{'NOMBREWEB'}
        $getinforme_grupos = $base_url.'getinforme_grupos/'.$apikey.'/'.$id_zona.'/'.$id_informe;

        $usuario_categorias_id = array();
        $usuario_categorias_nombre = array();
        $informe = '';
        if ($id_zona > 0 && $id_usuario > 0) {
            $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));

    // inicio conseguir idperfil
            $response = $restClient->get($getusuarios_perfil);
            $response_decode = json_decode($response->getContent());
            if (gettype($response_decode[0]) != 'boolean') {
                $idperfil = $response_decode[0]->{'IDPERFIL'};
    // fin conseguir idperfil

    // inicio conseguir id categorias
                $response = $restClient->get($getperfiles_categorias . $idperfil);
                $response_decode = json_decode($response->getContent());
                if (count($response_decode) > 0) {
                    foreach ($response_decode as $value_category) {
                        if (!in_array($value_category->{'IDCATEGORIA'}, $usuario_categorias_id)) {
                            $usuario_categorias_id[] = $value_category->{'IDCATEGORIA'};
                        }
                    }
                    sort($usuario_categorias_id);
    // fin conseguir id categorias

    // inicio conseguir nombre categorias
                    foreach ($usuario_categorias_id as $categoria_id) {
                        $response = $restClient->get($getcategoria_detalle . $categoria_id);
                        $response_decode = json_decode($response->getContent());
                        $usuario_categorias_nombre[] = $response_decode[0]->{'NOMBREWEB'};
                    }
    // fin conseguir nombre categorias

    // inicio conseguir datos vista
/*
                    if ($id_informe > 0) {
                        $response = $restClient->get($getinforme_grupos);
                        $response_decode = json_decode($response->getContent());
                        if (count($response_decode)> 0) {
                        }
                    }
*/
                    $informe = '{"tipo_informe": "Grafica_barras1",
"nombre_informe": "TOTAL DE NOTICIAS POR CUBRIMIENTO",
"grupo_de_categorias": [{ "nombre_grupo_de_categorias": "Regional", "categorias": [2,3,4]},
{ "nombre_grupo_de_categorias": "Nacional", "categorias": [5,6,7]}]}';
    // fin conseguir datos vista
                }
            }
        }

        return $this->render('mmiapi/template2.html.twig', array(
            'id_usuario' => $id_usuario,
            'id_zona' => $id_zona,
            'id_informe' => $id_informe,

            'informe' => $informe,
            'nombre_categorias' => '"'.implode('","', $usuario_categorias_nombre).'"',
            'id_categorias' => implode(",", $usuario_categorias_id),
        ));
    }

    /**
     * @Route("/graph_page")
     */
    public function graph_page(Request $request)
    {
        //http://localhost:8000/graph_page?id_zona=1&id_usuario=1344&id_informe=1&desde=01092014&hasta=02092014&id_categoria=24
        $request_data = array('id_usuario','id_zona','id_informe','desde','hasta','id_categoria');
        foreach ($request_data as $request_value) {
            if (strlen($request->query->get($request_value)) > 0) {
                $$request_value = $request->query->get($request_value);
            }
            else {
                $$request_value = 0;
            }
        }

        $base_url = 'http://api.mmi-e.com/mmiapi.php/';
        $apikey = 'DFKGMKLJOIRJNG';
        $getcategoria_detalle = $base_url.'getcategoria_detalle/'.$apikey.'/'.$id_zona.'/';
            //$response_decode[0]->{'NOMBREWEB'}
        $getinforme_grupos = $base_url.'getinforme_grupos/'.$apikey.'/'.$id_zona.'/'.$id_informe;
        $getcontadornoticias_categorias = $base_url.'getcontadornoticias_categorias/'.$apikey.'/'.$id_zona;
        $getcontadorvalor_categorias = $base_url.'getcontadorvalor_categorias/'.$apikey.'/'.$id_zona;
        $getnoticiasprensa_categoria_contador = $base_url.'getnoticiasprensa_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$desde.'/'.$hasta;
            //$response_decode[0]->{'NUM'}
        $getnoticiasradio_categoria_contador = $base_url.'getnoticiasradio_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$desde.'/'.$hasta;
            //$response_decode[0]->{'NUM'}
        $getnoticiastv_categoria_contador = $base_url.'getnoticiastv_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$desde.'/'.$hasta;
            //$response_decode[0]->{'NUM'}
        $getnoticiasinternet_categoria_contador = $base_url.'getnoticiasinternet_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$desde.'/'.$hasta;
            //$response_decode[0]->{'NUM'}
        $getnoticiasprensa_categoria_precio = $base_url.'getnoticiasprensa_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$desde.'/'.$hasta;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiasradio_categoria_precio = $base_url.'getnoticiasradio_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$desde.'/'.$hasta;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiastv_categoria_precio = $base_url.'getnoticiastv_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$desde.'/'.$hasta;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiasinternet_categoria_precio = $base_url.'getnoticiasinternet_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$desde.'/'.$hasta;
            //$response_decode[0]->{'PRECIO'}

        $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));

        $nombre_categoria = '';
    // inicio conseguir nombre categoria
        if ($id_zona > 0 && $id_categoria > 0) {
            $response = $restClient->get($getcategoria_detalle . $id_categoria);
            $response_decode = json_decode($response->getContent());
            $nombre_categoria = $response_decode[0]->{'NOMBREWEB'};
        }
    // fin conseguir nombre categoria

        $nombre_informe = '';
        $tipo_informe = '';
        $grupos_nombre = array();
        $grupos_contador = array();
        $grupos_precio = array();
/*
    // inicio conseguir datos de la vista
        if ($id_zona > 0 && $id_informe > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get($getinforme_grupos);
            $response_decode = json_decode($response->getContent());
            $nombre_informe = $response_decode[0]->{'nombre_informe'};
            $tipo_informe = $response_decode[0]->{'tipo_informe'};

            if ($tipo_informe == 'grafica1') {
                if ($id_categoria > 0) {
                    // nombres
                    $grupos_nombre[] = "Prensa";
                    $grupos_nombre[] = "Radio";
                    $grupos_nombre[] = "TV";
                    $grupos_nombre[] = "Internet";

                    // contador
                    $response = $restClient->get(str_replace("#idcategoria#",$id_categoria,$getnoticiasprensa_categoria_contador));
                    $response_decode = json_decode($response->getContent());
                    $grupos_contador[] = $response_decode[0]->{'NUM'};

                    $response = $restClient->get(str_replace("#idcategoria#",$id_categoria,$getnoticiasradio_categoria_contador));
                    $response_decode = json_decode($response->getContent());
                    $grupos_contador[] = $response_decode[0]->{'NUM'};

                    $response = $restClient->get(str_replace("#idcategoria#",$id_categoria,$getnoticiastv_categoria_contador));
                    $response_decode = json_decode($response->getContent());
                    $grupos_contador[] = $response_decode[0]->{'NUM'};

                    $response = $restClient->get(str_replace("#idcategoria#",$id_categoria,$getnoticiasinternet_categoria_contador));
                    $response_decode = json_decode($response->getContent());
                    $grupos_contador[] = $response_decode[0]->{'NUM'};


                    // precio
                    $response = $restClient->get(str_replace("#idcategoria#",$id_categoria,$getnoticiasprensa_categoria_precio));
                    $response_decode = json_decode($response->getContent());
                    $prensa_categoria_precio = 0;
                    if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                        $prensa_categoria_precio = $response_decode[0]->{'PRECIO'};
                    }
                    $grupos_precio[] = $prensa_categoria_precio;

                    $response = $restClient->get(str_replace("#idcategoria#",$id_categoria,$getnoticiasradio_categoria_precio));
                    $response_decode = json_decode($response->getContent());
                    $radio_categoria_precio = 0;
                    if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                        $radio_categoria_precio = $response_decode[0]->{'PRECIO'};
                    }
                    $grupos_precio[] = $radio_categoria_precio;

                    $response = $restClient->get(str_replace("#idcategoria#",$id_categoria,$getnoticiastv_categoria_precio));
                    $response_decode = json_decode($response->getContent());
                    $tv_categoria_precio = 0;
                    if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                        $tv_categoria_precio = $response_decode[0]->{'PRECIO'};
                    }
                    $grupos_precio[] = $tv_categoria_precio;

                    $response = $restClient->get(str_replace("#idcategoria#",$id_categoria,$getnoticiasinternet_categoria_precio));
                    $response_decode = json_decode($response->getContent());
                    $internet_categoria_precio = 0;
                    if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                        $internet_categoria_precio = $response_decode[0]->{'PRECIO'};
                    }
                    $grupos_precio[] = $internet_categoria_precio;
                }
            } else {
                // tipo 2 o tipo 3
                $grupo_de_categorias = $response_decode[0]->{'grupo_de_categorias'};
                foreach ($grupo_de_categorias as $grupo) {
                    // nombres
                    $grupos_nombre[] = $grupo->{'nombre_grupo_de_categorias'};

                    $body_contador_noticias_o_valor = '{"categorias": ['.implode(',',$grupo->{'categorias'}).'], "desde": '.$desde.', "hasta": '.$hasta.'}';

                    // contador
                    $response = $restClient->post($getcontadornoticias_categorias, $body_contador_noticias_o_valor);
                    $response_decode = json_decode($response->getContent());
                    $grupos_contador[] = $response_decode[0]->{'NUM'};

                    // precio
                    $response = $restClient->post($getcontadorvalor_categorias, $body_contador_noticias_o_valor);
                    $response_decode = json_decode($response->getContent());
                    $grupos_precio[] = $response_decode[0]->{'NUM'};
                }
            }
        }
*/
        $nombre_informe = 'nombre grafica';
        $tipo_informe = 'grafica1';
        $grupos_nombre = ["nombre1","nombre2","nombre3","nombre4"];
        $grupos_contador = [17,17,8,21];
        $grupos_precio = [1000000,2000000,2500000,1500000];
        if (strlen($request->query->get($request_value)) > 0) {
            $nombre_informe = 'nombre grafica2';
            $tipo_informe = 'grafica2';
            $grupos_nombre = ["nombre1","nombre2","nombre3","nombre4","nombre5"];
            $grupos_contador = [17,17,8,21,50];
            $grupos_precio = [1000000,2000000,2500000,1500000,100];
        }
    // fin conseguir datos de la vista

        return $this->render('mmiapi/template3.html.twig', array(
            'id_usuario' => $id_usuario,
            'id_zona' => $id_zona,
            'id_informe' => $id_informe,
            'fecha_desde' => $desde,
            'fecha_hasta' => $hasta,

            'nombre_categoria' => $nombre_categoria,
            'nombre_informe' => $nombre_informe,
            'tipo_informe' => $tipo_informe,
            'nombres' => '"'.implode('","', $grupos_nombre).'"',
            'contador' => implode(',', $grupos_contador),
            'precio' => implode(',', $grupos_precio),
        ));
    }
}