mmi_reports_php
===============

MMI REPORTS

1- Instalar Symfony 2.8 (https://symfony.com/download)


2- copiar el proyecto a la carpeta deseada


3- instalar dependencias mediante "composer install --optimize-autoloader"


4- verificar que se cumplen los requisitos mediante " php app/check.php"


4- Configurar la ruta url en el cliente en el fichero: /web/js/mmi-config.js sustituyendo "http:localhost:8000" por la ruta correcta externa


3- Ejecutar mediante "php app/console server:run" desde la raiz

4- El enlace a la url debe ser : /info_page?id_zona=X&id_usuario=ZZZZ especificando en X la id de zona (1) y en ZZZZ el id de usuario

