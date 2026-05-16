# Formify Automated Tests 

LKSN 2022 Server Side Module RESTApi Automated Tests.

## Installation

Import Database
```sh
mysql -u root -p formify < SERVER_SIDE_MEDIA/database/formify.sql
```

Copy "tests" folder in the "SERVER_SIDE_MEDIA/automated-tests/" folder to the root folder of your laravel project.

```sh
cp -R SERVER_SIDE_MEDIA/automated-tests/tests XX_MODULE_SERVER_SIDE/ 
```

Run tests

```sh
cd XX_MODULE_SERVER_SIDE/ 
php artisan test
```



## License

MIT 
