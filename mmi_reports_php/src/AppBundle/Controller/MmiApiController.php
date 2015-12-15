<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Ci\RestClientBundle\Services\RestClient;
use Ci\RestClientBundle\Services\Curl;
use Ci\RestClientBundle\Services\CurlOptionsHandler;
use Symfony\Component\HttpFoundation\Response;

class MmiApiController
{
    /**
     * @Route("/mmi_api")
     */
    public function mmiApi(Request $request)
    {
        $array_zonas['Canarias'] = 1;
        $array_zonas['Colombia'] = 5;
        
        $idzona = $array_zonas['Canarias'];
        //$idcategoria = 9828;
        $idcategoria = $request->query->get('idcategoria');
        $fechainicial = '01092015';
        $fechafinal = '02092015';
        
        $getcategorias = 'http://api.mmi-e.com/mmiapi.php/getcategorias/DFKGMKLJOIRJNG/'.$idzona;
        $getcategoria_detalle = 'http://api.mmi-e.com/mmiapi.php/getcategoria_detalle/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria;
        $getnoticiasprensa_categoria_contador = 'http://api.mmi-e.com/mmiapi.php/getnoticiasprensa_categoria_contador/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasradio_categoria_contador = 'http://api.mmi-e.com/mmiapi.php/getnoticiasradio_categoria_contador/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiastv_categoria_contador = 'http://api.mmi-e.com/mmiapi.php/getnoticiastv_categoria_contador/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        $getnoticiasinternet_categoria_contador = 'http://api.mmi-e.com/mmiapi.php/getnoticiasinternet_categoria_contador/DFKGMKLJOIRJNG/'.$idzona.'/'.$idcategoria.'/'.$fechainicial.'/'.$fechafinal;
            //$response_decode[0]->{'NUM'}
        
/*
        $url = $getnoticiasprensa_categoria_contador;
        
        $restClient = new RestClient(new Curl(new CurlOptionsHandler(array())));
        $response = $restClient->get($url);
        $response_decode = json_decode($response->getContent());
        return $response;
        return new Response($response_decode[0]->{'NUM'});
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
        $final = 'var news_graph1 = ['.$prensa_categoria_contador.','.$radio_categoria_contador.','.$tv_categoria_contador.','.$internet_categoria_contador.'];';
        return new Response($final);
         
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
}