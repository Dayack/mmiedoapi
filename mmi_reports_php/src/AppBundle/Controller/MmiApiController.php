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
     * @var string
     */
    public $base_url = 'http://api.mmi-e.com/mmiapi.php/';
    /**
     * @var string
     */
    public $apikey = 'DFKGMKLJOIRJNG';

    //http://localhost:8000/info_page?id_zona=1&id_usuario=1344&id_informe=3
    //http://localhost:8000/manage_page?id_zona=1&id_usuario=1344&id_informe=3
    //http://localhost:8000/graph_page?id_zona=1&id_usuario=1344&id_informe=3&desde=01092014&hasta=02092014&id_categoria=24
    /**
     * @Route("/info_page")
     * @param Request $request
     * @return Response
     */
    public function info_page(Request $request)
    {
        //http://localhost:8000/info_page?id_zona=1&id_usuario=1344&id_informe=3
        $request_data = array('id_usuario','id_zona','id_informe');
        foreach ($request_data as $request_value) {
            if (strlen($request->query->get($request_value)) > 0) {
                $$request_value = $request->query->get($request_value);
            }
            else {
                $$request_value = 0;
            }
        }

        $getusuarios_perfil = $this->base_url.'getusuarios_perfil/'.$this->apikey.'/'.$id_zona.'/'.$id_usuario;
        $getperfiles_categorias = $this->base_url.'getperfiles_categorias/'.$this->apikey.'/'.$id_zona.'/';
        $getinforme_nombres = $this->base_url.'getinforme_nombres/'.$this->apikey.'/'.$id_zona.'/'.$id_usuario;

        $usuario_categorias_id = array();
        $usuario_categorias_nombre = array();
        $informes = '';
        if ($id_zona > 0 && $id_usuario > 0) {
            $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));

            $response = $restClient->get($getusuarios_perfil);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
                if (gettype($response_decode[0]) != 'boolean') {
                    $idperfil = $response_decode[0]->{'IDPERFIL'};

                    $response = $restClient->get($getperfiles_categorias.$idperfil);
                    if ($response->isOk()) {
                        $response_decode = json_decode($response->getContent());
                        if (count($response_decode)> 0) {
                            foreach ($response_decode as $value_category) {
                                if (!in_array($value_category->{'IDCATEGORIA'},$usuario_categorias_id)) {
                                    $usuario_categorias_id[] = $value_category->{'IDCATEGORIA'};
                                    $usuario_categorias_nombre[] = $value_category->{'NOMBREWEB'};
                                }
                            }

                            $response = $restClient->get($getinforme_nombres);
                            if ($response->isOk()) {
                                $informes = $response->getContent();
                            } else {
                                return $this->render('mmiapi/error.html.twig', array());
                            }
                        }
                    } else {
                        return $this->render('mmiapi/error.html.twig', array());
                    }
                }
            } else {
                return $this->render('mmiapi/error.html.twig', array());
            }
        }

        return $this->render('mmiapi/template1.html.twig', array(
            'id_usuario' => $id_usuario,
            'id_zona' => $id_zona,
            'id_informe' => $id_informe,

            'nombre_categorias' => '"' . implode('","', $usuario_categorias_nombre) . '"',
            'id_categorias' => implode(",", $usuario_categorias_id),
            'informes' => $informes,

        ));
    }

    /**
     * @Route("/manage_page")
     * @param Request $request
     * @return Response
     */
    public function manage_page(Request $request)
    {
        //http://localhost:8000/manage_page?id_zona=1&id_usuario=1344&id_informe=3
        $request_data = array('id_usuario','id_zona','id_informe');
        foreach ($request_data as $request_value) {
            if (strlen($request->query->get($request_value)) > 0) {
                $$request_value = $request->query->get($request_value);
            }
            else {
                $$request_value = 0;
            }
        }

        $getusuarios_perfil = $this->base_url.'getusuarios_perfil/'.$this->apikey.'/'.$id_zona.'/'.$id_usuario;
        $getperfiles_categorias = $this->base_url.'getperfiles_categorias/'.$this->apikey.'/'.$id_zona.'/';
        $getinforme_grupos = $this->base_url.'getinforme_grupos/'.$this->apikey.'/'.$id_zona.'/'.$id_informe;

        $usuario_categorias_id = array();
        $usuario_categorias_nombre = array();
        $informe = '[]';
        if ($id_zona > 0 && $id_usuario > 0) {
            $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));

            $response = $restClient->get($getusuarios_perfil);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
                if (gettype($response_decode[0]) != 'boolean') {
                    $idperfil = $response_decode[0]->{'IDPERFIL'};

                    $response = $restClient->get($getperfiles_categorias . $idperfil);
                    if ($response->isOk()) {
                        $response_decode = json_decode($response->getContent());
                        if (count($response_decode) > 0) {
                            foreach ($response_decode as $value_category) {
                                if (!in_array($value_category->{'IDCATEGORIA'}, $usuario_categorias_id)) {
                                    $usuario_categorias_id[] = $value_category->{'IDCATEGORIA'};
                                    $usuario_categorias_nombre[] = $value_category->{'NOMBREWEB'};
                                }
                            }

                            if ($id_informe > 0) {
                                $response = $restClient->get($getinforme_grupos);
                                if ($response->isOk()) {
                                    $informe = $response->getContent();
                                } else {
                                    return $this->render('mmiapi/error.html.twig', array());
                                }
                            }
                        }
                    } else {
                        return $this->render('mmiapi/error.html.twig', array());
                    }
                }
            } else {
                return $this->render('mmiapi/error.html.twig', array());
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
     * @param Request $request
     * @return Response
     */
    public function graph_page(Request $request)
    {
        //http://localhost:8000/graph_page?id_zona=1&id_usuario=1344&id_informe=3&desde=01092014&hasta=02092014&id_categoria=24
        $request_data = array('id_usuario','id_zona','id_informe','desde','hasta','id_categoria');
        foreach ($request_data as $request_value) {
            if (strlen($request->query->get($request_value)) > 0) {
                $$request_value = $request->query->get($request_value);
            }
            else {
                $$request_value = 0;
            }
        }

        $getcategoria_detalle = $this->base_url.'getcategoria_detalle/'.$this->apikey.'/'.$id_zona.'/';
        $getinforme_grupos = $this->base_url.'getinforme_grupos/'.$this->apikey.'/'.$id_zona.'/'.$id_informe;

        $getnoticiasprensa_categoria_contador = $this->base_url.'getnoticiasprensa_categoria_contador/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiasradio_categoria_contador = $this->base_url.'getnoticiasradio_categoria_contador/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiastv_categoria_contador = $this->base_url.'getnoticiastv_categoria_contador/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiasinternet_categoria_contador = $this->base_url.'getnoticiasinternet_categoria_contador/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiassocialmedia_categoria_contador = $this->base_url.'getnoticiassocialmedia_categoria_contador/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;

        $getnoticiasprensa_categoria_precio = $this->base_url.'getnoticiasprensa_categoria_precio/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiasradio_categoria_precio = $this->base_url.'getnoticiasradio_categoria_precio/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiastv_categoria_precio = $this->base_url.'getnoticiastv_categoria_precio/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiasinternet_categoria_precio = $this->base_url.'getnoticiasinternet_categoria_precio/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiassocialmedia_categoria_precio = $this->base_url.'getnoticiassocialmedia_categoria_precio/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;

        $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));

        $nombre_categoria = '';
        if ($id_zona > 0 && $id_categoria > 0) {
            $response = $restClient->get($getcategoria_detalle . $id_categoria);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
                $nombre_categoria = $response_decode[0]->{'NOMBREWEB'};
            } else {
                return $this->render('mmiapi/error.html.twig', array());
            }
        }

        $nombre_informe = '';
        $tipo_informe = '';
        $grupos_nombre = array();
        $grupos_contador = array();
        $grupos_precio = array();
        if ($id_zona > 0 && $id_informe > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get($getinforme_grupos);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
                $nombre_informe = $response_decode[0]->{'nombre_informe'};
                $tipo_informe = $response_decode[0]->{'tipo_informe'};

                if ($tipo_informe == 'grafica1') {
                    // tipo 1
                    if ($id_categoria > 0) {
                        // nombres
                        $grupos_nombre[] = "Prensa";
                        $grupos_nombre[] = "Radio";
                        $grupos_nombre[] = "TV";
                        $grupos_nombre[] = "Internet";

                        // contador
                        $response = $restClient->get(str_replace("#idcategoria#", $id_categoria, $getnoticiasprensa_categoria_contador));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $grupos_contador[] = $response_decode[0]->{'NUM'};
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", $id_categoria, $getnoticiasradio_categoria_contador));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $grupos_contador[] = $response_decode[0]->{'NUM'};
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", $id_categoria, $getnoticiastv_categoria_contador));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $grupos_contador[] = $response_decode[0]->{'NUM'};
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", $id_categoria, $getnoticiasinternet_categoria_contador));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $grupos_contador[] = $response_decode[0]->{'NUM'};
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        // precio
                        $response = $restClient->get(str_replace("#idcategoria#", $id_categoria, $getnoticiasprensa_categoria_precio));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $prensa_categoria_precio = 0;
                            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                                $prensa_categoria_precio = $response_decode[0]->{'PRECIO'};
                            }
                            $grupos_precio[] = $prensa_categoria_precio;
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", $id_categoria, $getnoticiasradio_categoria_precio));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $radio_categoria_precio = 0;
                            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                                $radio_categoria_precio = $response_decode[0]->{'PRECIO'};
                            }
                            $grupos_precio[] = $radio_categoria_precio;
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", $id_categoria, $getnoticiastv_categoria_precio));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $tv_categoria_precio = 0;
                            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                                $tv_categoria_precio = $response_decode[0]->{'PRECIO'};
                            }
                            $grupos_precio[] = $tv_categoria_precio;
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", $id_categoria, $getnoticiasinternet_categoria_precio));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $internet_categoria_precio = 0;
                            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                                $internet_categoria_precio = $response_decode[0]->{'PRECIO'};
                            }
                            $grupos_precio[] = $internet_categoria_precio;
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }
                    }
                } else {
                    // tipo 2 o tipo 3
                    $grupo_de_categorias = $response_decode[0]->{'grupo_de_categorias'};

                    foreach ($grupo_de_categorias as $grupo) {
                        // nombres
                        $grupos_nombre[] = $grupo->{'nombre_grupo_de_categorias'};

                        // contador
                        $contador = 0;

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiasprensa_categoria_contador));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $contador += $response_decode[0]->{'NUM'};
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiasradio_categoria_contador));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $contador += $response_decode[0]->{'NUM'};
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiastv_categoria_contador));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $contador += $response_decode[0]->{'NUM'};
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiasinternet_categoria_contador));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $contador += $response_decode[0]->{'NUM'};
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiassocialmedia_categoria_contador));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $contador += $response_decode[0]->{'NUM'};
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        // precio
                        $precio = 0;

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiasprensa_categoria_precio));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $prensa_categoria_precio = 0;
                            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                                $prensa_categoria_precio = $response_decode[0]->{'PRECIO'};
                            }
                            $precio += $prensa_categoria_precio;
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiasradio_categoria_precio));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $radio_categoria_precio = 0;
                            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                                $radio_categoria_precio = $response_decode[0]->{'PRECIO'};
                            }
                            $precio += $radio_categoria_precio;
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiastv_categoria_precio));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $tv_categoria_precio = 0;
                            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                                $tv_categoria_precio = $response_decode[0]->{'PRECIO'};
                            }
                            $precio += $tv_categoria_precio;
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiasinternet_categoria_precio));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $internet_categoria_precio = 0;
                            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                                $internet_categoria_precio = $response_decode[0]->{'PRECIO'};
                            }
                            $precio += $internet_categoria_precio;
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $response = $restClient->get(str_replace("#idcategoria#", implode('-',$grupo->{'categorias'}), $getnoticiassocialmedia_categoria_precio));
                        if ($response->isOk()) {
                            $response_decode = json_decode($response->getContent());
                            $socialmedia_categoria_precio = 0;
                            if (is_null($response_decode[0]->{'PRECIO'}) == false) {
                                $socialmedia_categoria_precio = $response_decode[0]->{'PRECIO'};
                            }
                            $precio += $socialmedia_categoria_precio;
                        } else {
                            return $this->render('mmiapi/error.html.twig', array());
                        }

                        $grupos_contador[] = $contador;
                        $grupos_precio[] = $precio;
                    }
                }
            } else {
                return $this->render('mmiapi/error.html.twig', array());
            }
        }

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

    /**
     * @Route("/save_page")
     * @param Request $request
     * @return Response
     */
    public function save_page(Request $request)
    {
        //http://localhost:8000/save_page?id_zona=1
        $request_data = array('id_zona');
        foreach ($request_data as $request_value) {
            if (strlen($request->query->get($request_value)) > 0) {
                $$request_value = $request->query->get($request_value);
            }
            else {
                $$request_value = 0;
            }
        }

        $setinformegrupo = $this->base_url.'setinformegrupo/'.$this->apikey.'/'.$id_zona;

        $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));

        $body = $request->getContent();

        $response = $restClient->post($setinformegrupo, $body);
        if ($response->isOk()) {
            return new Response($response);
        } else {
            return $this->render('mmiapi/error.html.twig', array());
        }
    }

    /**
     * @Route("/all")
     */
    public function all(Request $request)
    {
        //http://localhost:8000/all?id_usuario=1344&id_zona=1&categoria_id=2185&desde=01012015&hasta=05012015
        $request_data = array('id_usuario','id_zona','categoria_id','desde','hasta');
        foreach ($request_data as $request_value) {
            if (strlen($request->query->get($request_value)) > 0) {
                $$request_value = $request->query->get($request_value);
            }
            else {
                $$request_value = 0;
            }
        }

        $getusuarios_perfil = $this->base_url.'getusuarios_perfil/'.$this->apikey.'/'.$id_zona.'/'.$id_usuario;
        $getperfiles_categorias = $this->base_url.'getperfiles_categorias/'.$this->apikey.'/'.$id_zona.'/';
        $getinforme_nombres = $this->base_url.'getinforme_nombres/'.$this->apikey.'/'.$id_zona.'/'.$id_usuario;

        $getcategoria_detalle = $this->base_url.'getcategoria_detalle/'.$this->apikey.'/'.$id_zona.'/';
        $getinforme_grupos = $this->base_url.'getinforme_grupos/'.$this->apikey.'/'.$id_zona.'/';

        $getcategorias_contador = $this->base_url.'getcategorias_contador/'.$this->apikey.'/'.$id_zona.'/'.$desde.'/'.$hasta;
        $getprecio_categorias = $this->base_url.'getprecio_categorias/'.$this->apikey.'/'.$id_zona.'/'.$desde.'/'.$hasta;
        $getnoticiasprensa_categoria_contador = $this->base_url.'getnoticiasprensa_categoria_contador/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiasradio_categoria_contador = $this->base_url.'getnoticiasradio_categoria_contador/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiastv_categoria_contador = $this->base_url.'getnoticiastv_categoria_contador/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiasinternet_categoria_contador = $this->base_url.'getnoticiasinternet_categoria_contador/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiasprensa_categoria_precio = $this->base_url.'getnoticiasprensa_categoria_precio/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiasradio_categoria_precio = $this->base_url.'getnoticiasradio_categoria_precio/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiastv_categoria_precio = $this->base_url.'getnoticiastv_categoria_precio/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;
        $getnoticiasinternet_categoria_precio = $this->base_url.'getnoticiasinternet_categoria_precio/'.$this->apikey.'/'.$id_zona.'/#idcategoria#/'.$desde.'/'.$hasta;


        $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));

        $idperfil = 0;
        if ($id_zona > 0 && $id_usuario > 0) {
            $response = $restClient->get($getusuarios_perfil);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
                $idperfil = $response_decode[0]->{'IDPERFIL'};
            } else {
                return new Response("Error: " . $getusuarios_perfil . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $idperfil > 0) {
            $response = $restClient->get($getperfiles_categorias.$idperfil);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getperfiles_categorias.$idperfil . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $id_usuario > 0) {
            $response = $restClient->get($getinforme_nombres);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getinforme_nombres . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $categoria_id > 0) {
            $response = $restClient->get($getcategoria_detalle.$categoria_id);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getcategoria_detalle.$categoria_id . " => " . $response->getStatusCode());
            }
        }

        $id_informe = 2;
        if ($id_zona > 0 && $id_informe > 0) {
            $response = $restClient->get($getinforme_grupos.$id_informe);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getinforme_grupos.$id_informe . " => " . $response->getStatusCode());
            }
        }

        /*
        // inicio no implementado
        if ($id_zona > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $body_contador = '{"grupo_de_categorias": [2185,2186,2188]}';

            $response = $restClient->post($getcategorias_contador, $body_contador);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getcategorias_contador ."(".$body_contador.")" . " => " . $response->getStatusCode());
            }

            $body_precio = '{"categorias": [2185,2186,2188]}';
            $response = $restClient->post($getprecio_categorias, $body_precio);
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getprecio_categorias ."(".$body_precio.")" . " => " . $response->getStatusCode());
            }
        }
        // fin no implementado
        */

        if ($id_zona > 0 && $categoria_id > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get(str_replace("#idcategoria#",$categoria_id,$getnoticiasprensa_categoria_contador));
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getnoticiasprensa_categoria_contador . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $categoria_id > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get(str_replace("#idcategoria#",$categoria_id,$getnoticiasradio_categoria_contador));
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getnoticiasradio_categoria_contador . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $categoria_id > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get(str_replace("#idcategoria#",$categoria_id,$getnoticiastv_categoria_contador));
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getnoticiastv_categoria_contador . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $categoria_id > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get(str_replace("#idcategoria#",$categoria_id,$getnoticiasinternet_categoria_contador));
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getnoticiasinternet_categoria_contador . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $categoria_id > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get(str_replace("#idcategoria#",$categoria_id,$getnoticiasprensa_categoria_precio));
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getnoticiasprensa_categoria_precio . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $categoria_id > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get(str_replace("#idcategoria#",$categoria_id,$getnoticiasradio_categoria_precio));
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getnoticiasradio_categoria_precio . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $categoria_id > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get(str_replace("#idcategoria#",$categoria_id,$getnoticiastv_categoria_precio));
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getnoticiastv_categoria_precio . " => " . $response->getStatusCode());
            }
        }

        if ($id_zona > 0 && $categoria_id > 0 && preg_match('/^\d{8}$/',$desde) == 1 && preg_match('/^\d{8}$/',$hasta) == 1) {
            $response = $restClient->get(str_replace("#idcategoria#",$categoria_id,$getnoticiasinternet_categoria_precio));
            if ($response->isOk()) {
                $response_decode = json_decode($response->getContent());
            } else {
                return new Response("Error: " . $getnoticiasinternet_categoria_precio . " => " . $response->getStatusCode());
            }
        }

        return new Response("Todo bien");
    }

}