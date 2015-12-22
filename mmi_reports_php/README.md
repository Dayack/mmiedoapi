mmi_reports_php
===============

MMI REPORTS

1- Instalar Symfony 2.8 (https://symfony.com/download) (tener php5-cli y php-curl instalados) con los comandos "sudo curl -LsS https://symfony.com/installer -o /usr/local/bin/symfony" y "sudo chmod a+x /usr/local/bin/symfony"


2- copiar el proyecto a la carpeta deseada


3- instalar Composer si fuera necesario (https://getcomposer.org/download/) mediante "curl -sS https://getcomposer.org/installer | php" y luego "sudo mv ~/composer.phar /usr/local/bin/composer"


4- instalar dependencias mediante "composer install --optimize-autoloader"


5- verificar que se cumplen los requisitos mediante " php app/check.php"


6- Un posible error que da el check es la configuración del date.Timezone, para ello hay que retocar el fichero /etc/php5/cli/php.ini y agregar date.timezone = Europe/Paris


7- Configurar la ruta url en el cliente en el fichero: /web/js/mmi-config.js sustituyendo "http:localhost:8000" por la ruta correcta externa, es decir la ruta del servidor donde estará la aplicación, de manera que la vista pueda hacer peticiones


8- Ejecutar mediante "php app/console server:run" desde la raiz


9- El enlace a la url debe ser : /info_page?id_zona=X&id_usuario=ZZZZ especificando en X la id de zona (1) y en ZZZZ el id de usuario

