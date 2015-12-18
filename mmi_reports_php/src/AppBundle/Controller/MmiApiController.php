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
        $request_data = array('idusuario','idzona','idvista');
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
        $getusuarios_perfil = $base_url.'getusuarios_perfil/'.$apikey.'/'.$idzona.'/'.$idusuario;
            //$response_decode[0]->{'IDPERFIL'}
        $getperfiles_categorias = $base_url.'getperfiles_categorias/'.$apikey.'/'.$idzona.'/';
        $getcategoria_detalle = $base_url.'getcategoria_detalle/'.$apikey.'/'.$idzona.'/';
            //$response_decode[0]->{'NOMBREWEB'}
        $getvistanombres = $base_url.'getvistanombres/'.$apikey.'/'.$idzona.'/'.$idusuario;
        
        $usuario_categorias_id = array();
        $usuario_categorias_nombre = array();
        $categorias_usuario = '';
        $views = '';
        if ($idzona > 0 && $idusuario > 0) {
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
                    
//[{name:"Categoria1",id:1},{name:"categoria2",id:2},{name:"categoria3",id:3}];
                    foreach ($usuario_categorias_id as $categoria_id) {
                        # TODO convertir los dos arrays en el texto con ese formato
                    }
                }
    // inicio conseguir datos vistas
/*
                $response = $restClient->get($getvistanombres);
                $response_decode = json_decode($response->getContent());
                if (count($response_decode)> 0) {
                }
*/
                $views = '{"id_informe": 1, "nombre_informe": "Vista de cubrimiento 1", "tipo_informe" : "grafica1"}, {"id_informe": 2, "nombre_informe": "vista de cubrimiento 2", "tipo_informe": "grafica2"}';
                
            }
        }
/*
*/
        
        return $this->render('mmiapi/template1.html.twig', array(
            'idusuario' => $idusuario,
            'idzona' => $idzona,
            
            'categorias_usuario' => $categorias_usuario,
            'views' => $views,
            
        ));
        //return new Response(json_encode($categorias_usuario));
    }
    
    //http://localhost:8000/graph_media?idzona=1&idcategoria=24&fechainicial=01092015&fechafinal=01102015
    //http://localhost:8000/graph_groups1?idzona=1&fechainicial=01092015&fechafinal=01102015&idusuario=1344
    //http://localhost:8000/graph_groups2?idzona=1&fechainicial=01092015&fechafinal=01102015&idusuario=1344
    
    /**
     * @Route("/graph_media")
     */
    public function graph_media(Request $request)
    {
        //http://localhost:8000/graph_media?idzona=1&idcategoria=24&fechainicial=01092015&fechafinal=01102015
        $web_title = "Mmi Graphs";
        
        $request_data = array('idzona','idcategoria','fechainicial','fechafinal','idusuario');
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
        $getcategorias = $base_url.'getcategorias/'.$apikey.'/'.$idzona;
        $getcategoria_detalle = $base_url.'getcategoria_detalle/'.$apikey.'/'.$idzona.'/'.$idcategoria;
            //$response_decode[0]->{'NOMBREWEB'}
        $getnoticiasprensa_categoria_contador = $base_url.'getnoticiasprensa_categoria_contador/'.$apikey.'/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasradio_categoria_contador = $base_url.'getnoticiasradio_categoria_contador/'.$apikey.'/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiastv_categoria_contador = $base_url.'getnoticiastv_categoria_contador/'.$apikey.'/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasinternet_categoria_contador = $base_url.'getnoticiasinternet_categoria_contador/'.$apikey.'/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasprensa_categoria_precio = $base_url.'getnoticiasprensa_categoria_precio/'.$apikey.'/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiasradio_categoria_precio = $base_url.'getnoticiasradio_categoria_precio/'.$apikey.'/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiastv_categoria_precio = $base_url.'getnoticiastv_categoria_precio/'.$apikey.'/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiasinternet_categoria_precio = $base_url.'getnoticiasinternet_categoria_precio/'.$apikey.'/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        
/*
        $url = $getnoticiasprensa_categoria_precio;
        
        $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));
        $response = $restClient->get($url);
        $response_decode = json_decode($response->getContent());
        return $response;
        return new Response($response_decode[0]->{'NUM'});
*/
        $prensa_categoria_contador = 0;
        $radio_categoria_contador = 0;
        $tv_categoria_contador = 0;
        $internet_categoria_contador = 0;
        $prensa_categoria_precio = 0;
        $radio_categoria_precio = 0;
        $tv_categoria_precio = 0;
        $internet_categoria_precio = 0;
            
        if ($idzona > 0 && $idcategoria > 0 && $fechainicial > 0 && $fechafinal > 0) {
            $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));
            
            $response = $restClient->get($getnoticiasprensa_categoria_contador);
            $response_decode = json_decode($response->getContent());
            $prensa_categoria_contador = $response_decode[0]->{'NUM'};
            
            $response = $restClient->get($getnoticiasradio_categoria_contador);
            $response_decode = json_decode($response->getContent());
            $radio_categoria_contador = $response_decode[0]->{'NUM'};
            
            $response = $restClient->get($getnoticiastv_categoria_contador);
            $response_decode = json_decode($response->getContent());
            $tv_categoria_contador = $response_decode[0]->{'NUM'};
            
            $response = $restClient->get($getnoticiasinternet_categoria_contador);
            $response_decode = json_decode($response->getContent());
            $internet_categoria_contador = $response_decode[0]->{'NUM'};
            
            $response = $restClient->get($getnoticiasprensa_categoria_precio);
            $response_decode = json_decode($response->getContent());
            $prensa_categoria_precio = 0;
            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                $prensa_categoria_precio = $response_decode[0]->{'PRECIO'};
            }
            
            $response = $restClient->get($getnoticiasradio_categoria_precio);
            $response_decode = json_decode($response->getContent());
            $radio_categoria_precio = 0;
            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                $radio_categoria_precio = $response_decode[0]->{'PRECIO'};
            }
            
            $response = $restClient->get($getnoticiastv_categoria_precio);
            $response_decode = json_decode($response->getContent());
            $tv_categoria_precio = 0;
            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                $tv_categoria_precio = $response_decode[0]->{'PRECIO'};
            }
            
            $response = $restClient->get($getnoticiasinternet_categoria_precio);
            $response_decode = json_decode($response->getContent());
            $internet_categoria_precio = 0;
            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                $internet_categoria_precio = $response_decode[0]->{'PRECIO'};
            }
            
            $response = $restClient->get($getcategoria_detalle);
            $response_decode = json_decode($response->getContent());
            $nombre_categoria = $response_decode[0]->{'NOMBREWEB'};
        }
        
        return $this->render('mmiapi/index1.html.twig', array(
            'web_title' => $web_title,
            
            'g1_categoria_contador' => implode(",", [$prensa_categoria_contador,$radio_categoria_contador,$tv_categoria_contador,$internet_categoria_contador]),
            'g1_categoria_precio' => implode(",", [$prensa_categoria_precio,$radio_categoria_precio,$tv_categoria_precio,$internet_categoria_precio]),
            
            'nombre_categoria' => $nombre_categoria,
            
            'g2_categorias_nombre' => implode(",", [0,0]),
            'g2_categorias_contador' => implode(",", [0,0]),
            'g2_categorias_precio' => implode(",", [0,0]),
            
            'g3_categorias_nombre' => implode(",", [0,0]),
            'g3_categorias_contador' => implode(",", [0,0]),
            'g3_categorias_precio' => implode(",", [0,0]),
        ));
    }
    
    /**
     * @Route("/graph_groups1")
     */
    public function graph_groups1(Request $request)
    {
        //http://localhost:8000/graph_groups1?idzona=1&fechainicial=01092015&fechafinal=01102015&idusuario=1344
        $web_title = "Mmi Graphs";
        
        $request_data = array('idzona','idcategoria','fechainicial','fechafinal','idusuario');
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
        $getusuarios_perfil = $base_url.'getusuarios_perfil/'.$apikey.'/'.$idzona.'/'.$idusuario;
            //$response_decode[0]->{'IDPERFIL'}
        $getperfiles_categorias = $base_url.'getperfiles_categorias/'.$apikey.'/'.$idzona.'/';
        $getcategoria_detalle = $base_url.'getcategoria_detalle/'.$apikey.'/'.$idzona.'/';
            //$response_decode[0]->{'NOMBREWEB'}
        $getnoticiasprensa_categoria_contador = $base_url.'getnoticiasprensa_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasradio_categoria_contador = $base_url.'getnoticiasradio_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiastv_categoria_contador = $base_url.'getnoticiastv_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasinternet_categoria_contador = $base_url.'getnoticiasinternet_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasprensa_categoria_precio = $base_url.'getnoticiasprensa_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiasradio_categoria_precio = $base_url.'getnoticiasradio_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiastv_categoria_precio = $base_url.'getnoticiastv_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiasinternet_categoria_precio = $base_url.'getnoticiasinternet_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        
        $g2_categorias_nombre = [];
        $g2_categorias_contador = [];
        $g2_categorias_precio = [];
        if ($idzona > 0 && $idusuario > 0) {
            $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));
            
            $response = $restClient->get($getusuarios_perfil);
            $response_decode = json_decode($response->getContent());
            if (gettype($response_decode[0]) != "boolean") {
                $idperfil = $response_decode[0]->{'IDPERFIL'};
                
                $response = $restClient->get($getperfiles_categorias.$idperfil);
                $response_decode = json_decode($response->getContent());
                if (count($response_decode)> 0) {
                    $user_categories = array();
                    foreach ($response_decode as $value_category) {
                        if (!in_array($value_category->{'IDCATEGORIA'},$user_categories)) {
                            $user_categories[] = $value_category->{'IDCATEGORIA'};
                        }
                    }
                    sort($user_categories);
                    
                    foreach ($user_categories as $specific_category) {
                        // nombre
                        $response = $restClient->get($getcategoria_detalle.$specific_category);
                        $response_decode = json_decode($response->getContent());
                        $g2_categorias_nombre[] = $response_decode[0]->{'NOMBREWEB'};
                        
                        // contador
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasprensa_categoria_contador));
                        $response_decode = json_decode($response->getContent());
                        $prensa_categoria_contador = $response_decode[0]->{'NUM'};
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasradio_categoria_contador));
                        $response_decode = json_decode($response->getContent());
                        $radio_categoria_contador = $response_decode[0]->{'NUM'};
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiastv_categoria_contador));
                        $response_decode = json_decode($response->getContent());
                        $tv_categoria_contador = $response_decode[0]->{'NUM'};
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasinternet_categoria_contador));
                        $response_decode = json_decode($response->getContent());
                        $internet_categoria_contador = $response_decode[0]->{'NUM'};
                        
                        $g2_categorias_contador[] = $prensa_categoria_contador+$radio_categoria_contador+$tv_categoria_contador+$internet_categoria_contador;
                        
                        // precio
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasprensa_categoria_precio));
                        $response_decode = json_decode($response->getContent());
                        $prensa_categoria_precio = 0;
                        if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                            $prensa_categoria_precio = $response_decode[0]->{'PRECIO'};
                        }
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasradio_categoria_precio));
                        $response_decode = json_decode($response->getContent());
                        $radio_categoria_precio = 0;
                        if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                            $radio_categoria_precio = $response_decode[0]->{'PRECIO'};
                        }
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiastv_categoria_precio));
                        $response_decode = json_decode($response->getContent());
                        $tv_categoria_precio = 0;
                        if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                            $tv_categoria_precio = $response_decode[0]->{'PRECIO'};
                        }
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasinternet_categoria_precio));
                        $response_decode = json_decode($response->getContent());
                        $internet_categoria_precio = 0;
                        if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                            $internet_categoria_precio = $response_decode[0]->{'PRECIO'};
                        }
                        
                        $g2_categorias_precio[] = $prensa_categoria_precio+$radio_categoria_precio+$tv_categoria_precio+$internet_categoria_precio;
                    }
                }
            }
        }
        
        return $this->render('mmiapi/index2.html.twig', array(
            'web_title' => $web_title,
            
            'g2_categorias_nombre' => implode(",", $g2_categorias_nombre),
            'g2_categorias_contador' => implode(",", $g2_categorias_contador),
            'g2_categorias_precio' => implode(",", $g2_categorias_precio),
            
            'nombre_categoria' => '',
            
            'g1_categoria_contador' => implode(",", [0,0,0,0]),
            'g1_categoria_precio' => implode(",", [0,0,0,0]),
            
            'g3_categorias_nombre' => implode(",", [0,0]),
            'g3_categorias_contador' => implode(",", [0,0]),
            'g3_categorias_precio' => implode(",", [0,0]),
        ));
    }
    
    /**
     * @Route("/graph_groups2")
     */
    public function graph_groups2(Request $request)
    {
        //http://localhost:8000/graph_groups2?idzona=1&fechainicial=01092015&fechafinal=01102015&idusuario=1344
        $web_title = "Mmi Graphs";
        
        $request_data = array('idzona','idcategoria','fechainicial','fechafinal','idusuario');
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
        $getusuarios_perfil = $base_url.'getusuarios_perfil/'.$apikey.'/'.$idzona.'/'.$idusuario;
            //$response_decode[0]->{'IDPERFIL'}
        $getperfiles_categorias = $base_url.'getperfiles_categorias/'.$apikey.'/'.$idzona.'/';
        $getcategoria_detalle = $base_url.'getcategoria_detalle/'.$apikey.'/'.$idzona.'/';
            //$response_decode[0]->{'NOMBREWEB'}
        $getnoticiasprensa_categoria_contador = $base_url.'getnoticiasprensa_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasradio_categoria_contador = $base_url.'getnoticiasradio_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiastv_categoria_contador = $base_url.'getnoticiastv_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasinternet_categoria_contador = $base_url.'getnoticiasinternet_categoria_contador/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasprensa_categoria_precio = $base_url.'getnoticiasprensa_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiasradio_categoria_precio = $base_url.'getnoticiasradio_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiastv_categoria_precio = $base_url.'getnoticiastv_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        $getnoticiasinternet_categoria_precio = $base_url.'getnoticiasinternet_categoria_precio/'.$apikey.'/'.$idzona.'/#idcategoria#/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'PRECIO'}
        
        $g3_categorias_nombre = [];
        $g3_categorias_contador = [];
        $g3_categorias_precio = [];
        if ($idzona > 0 && $idusuario > 0) {
            $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));
            
            $response = $restClient->get($getusuarios_perfil);
            $response_decode = json_decode($response->getContent());
            if (gettype($response_decode[0]) != "boolean") {
                $idperfil = $response_decode[0]->{'IDPERFIL'};
                
                $response = $restClient->get($getperfiles_categorias.$idperfil);
                $response_decode = json_decode($response->getContent());
                if (count($response_decode)> 0) {
                    $user_categories = array();
                    foreach ($response_decode as $value_category) {
                        if (!in_array($value_category->{'IDCATEGORIA'},$user_categories)) {
                            $user_categories[] = $value_category->{'IDCATEGORIA'};
                        }
                    }
                    sort($user_categories);
                    
                    foreach ($user_categories as $specific_category) {
                        // nombre
                        $response = $restClient->get($getcategoria_detalle.$specific_category);
                        $response_decode = json_decode($response->getContent());
                        $g3_categorias_nombre[] = $response_decode[0]->{'NOMBREWEB'};
                        
                        // contador
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasprensa_categoria_contador));
                        $response_decode = json_decode($response->getContent());
                        $prensa_categoria_contador = $response_decode[0]->{'NUM'};
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasradio_categoria_contador));
                        $response_decode = json_decode($response->getContent());
                        $radio_categoria_contador = $response_decode[0]->{'NUM'};
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiastv_categoria_contador));
                        $response_decode = json_decode($response->getContent());
                        $tv_categoria_contador = $response_decode[0]->{'NUM'};
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasinternet_categoria_contador));
                        $response_decode = json_decode($response->getContent());
                        $internet_categoria_contador = $response_decode[0]->{'NUM'};
                        
                        $g3_categorias_contador[] = $prensa_categoria_contador+$radio_categoria_contador+$tv_categoria_contador+$internet_categoria_contador;
                        
                        // precio
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasprensa_categoria_precio));
                        $response_decode = json_decode($response->getContent());
                        $prensa_categoria_precio = 0;
                        if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                            $prensa_categoria_precio = $response_decode[0]->{'PRECIO'};
                        }
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasradio_categoria_precio));
                        $response_decode = json_decode($response->getContent());
                        $radio_categoria_precio = 0;
                        if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                            $radio_categoria_precio = $response_decode[0]->{'PRECIO'};
                        }
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiastv_categoria_precio));
                        $response_decode = json_decode($response->getContent());
                        $tv_categoria_precio = 0;
                        if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                            $tv_categoria_precio = $response_decode[0]->{'PRECIO'};
                        }
                        
                        $response = $restClient->get(str_replace("#idcategoria#",$specific_category,$getnoticiasinternet_categoria_precio));
                        $response_decode = json_decode($response->getContent());
                        $internet_categoria_precio = 0;
                        if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                            $internet_categoria_precio = $response_decode[0]->{'PRECIO'};
                        }
                        
                        $g3_categorias_precio[] = $prensa_categoria_precio+$radio_categoria_precio+$tv_categoria_precio+$internet_categoria_precio;
                    }
                }
            }
        }
        
        return $this->render('mmiapi/index3.html.twig', array(
            'web_title' => $web_title,
            
            'g3_categorias_nombre' => implode(",", $g3_categorias_nombre),
            'g3_categorias_contador' => implode(",", $g3_categorias_contador),
            'g3_categorias_precio' => implode(",", $g3_categorias_precio),
            
            'nombre_categoria' => '',
            
            'g1_categoria_contador' => implode(",", [0,0,0,0]),
            'g1_categoria_precio' => implode(",", [0,0,0,0]),
            
            'g2_categorias_nombre' => implode(",", [0,0]),
            'g2_categorias_contador' => implode(",", [0,0]),
            'g2_categorias_precio' => implode(",", [0,0]),
        ));
    }
}