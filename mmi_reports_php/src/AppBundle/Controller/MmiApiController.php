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
     * @Route("/graph_media")
     */
    public function mmiApi(Request $request)
    {
        //http://localhost:8000/graph_media?idzona=1&idcategoria=24&fechainicial=01092015&fechafinal=01102015
        $web_title = "Mmi Graphs";
        
        $request_data = array('idzona','idcategoria','fechainicial','fechafinal');
        foreach ($request_data as $request_value)
        {
            if (strlen($request->query->get($request_value)) > 0) {
                $$request_value = $request->query->get($request_value);
            }
            else {
                $$request_value = 0;
            }
        }
        
        $base_url = 'http://api.mmi-e.com/mmiapi.php/';
        $getcategorias = $base_url.'getcategorias/DFKGMKLJOIRJNG/'.$idzona;
        $getcategoria_detalle = $base_url.'getcategoria_detalle/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria;
        $getnoticiasprensa_categoria_contador = $base_url.'getnoticiasprensa_categoria_contador/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasradio_categoria_contador = $base_url.'getnoticiasradio_categoria_contador/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiastv_categoria_contador = $base_url.'getnoticiastv_categoria_contador/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasinternet_categoria_contador = $base_url.'getnoticiasinternet_categoria_contador/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getcategoria_detalle = $base_url.'getcategoria_detalle/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria;
            //$response_decode[0]->{'NOMBREWEB'}
        
        
        
/*
        $url = $getcategoria_detalle;
        
        $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));
        $response = $restClient->get($url);
        $response_decode = json_decode($response->getContent());
        return $response;
        return new Response($response_decode[0]->{'NUM'});
*/
/*
*/
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
        
        $prensa_categoria_recaudacion = '198009548';
        $radio_categoria_recaudacion = '243861317';
        $tv_categoria_recaudacion = '37836670';
        $internet_categoria_recaudacion = '22051715';
        
        $response = $restClient->get($getcategoria_detalle);
        $response_decode = json_decode($response->getContent());
        $nombre_categoria = $response_decode[0]->{'NOMBREWEB'};
        
        return $this->render('mmiapi/index.html.twig', array(
            'web_title' => $web_title,
            
            'prensa_categoria_contador' => $prensa_categoria_contador,
            'radio_categoria_contador' => $radio_categoria_contador,
            'tv_categoria_contador' => $tv_categoria_contador,
            'internet_categoria_contador' => $internet_categoria_contador,
            
            'prensa_categoria_recaudacion' => $prensa_categoria_recaudacion,
            'radio_categoria_recaudacion' => $radio_categoria_recaudacion,
            'tv_categoria_recaudacion' => $tv_categoria_recaudacion,
            'internet_categoria_recaudacion' => $internet_categoria_recaudacion,
            
            'nombre_categoria' => $nombre_categoria,
        ));
/*

http://api.mmi-e.com/mmiapi.php/getcategorias/DFKGMKLJOIRJNG/1
...{"IDCATEGORIA":"9828","NOMBRE":"FONDO CANARIO DE FINANCIACION MUNICIPAL (FCFM)"}...

http://api.mmi-e.com/mmiapi.php/getcategoria_detalle/DFKGMKLJOIRJNG/1/9828
{"IDCATEGORIA":"9828","IDPADRE":"0","CODIGO":"4.16.17.","ACRONIMO":".","NOMBRE":"FONDO CANARIO DE FINANCIACION MUNICIPAL (FCFM)","NOMBREWEB":"Fondo Canario de Financiaci\u00f3n Municipal","ACTIVO":"1","TOTAL":"0"}

http://api.mmi-e.com/mmiapi.php/getnoticiasprensa_categoria_contador/DFKGMKLJOIRJNG/1/9828/01092015/02092015
{"NUM":"0"}

http://api.mmi-e.com/mmiapi.php/getnoticiastv_categoria_contador/DFKGMKLJOIRJNG/1/9828/01092015/02092015
{"NUM":"0"}

http://api.mmi-e.com/mmiapi.php/getnoticiasradio_categoria_contador/DFKGMKLJOIRJNG/1/9828/01092015/02092015
{"NUM":"0"}

http://api.mmi-e.com/mmiapi.php/getnoticiasinternet_categoria_contador/DFKGMKLJOIRJNG/1/9828/01092015/02092015
{"NUM":"0"}



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
        */
    }
    //graph_groups1 y graph_groups2
}