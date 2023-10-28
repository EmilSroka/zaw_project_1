<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

use App\DAO\Database;
use App\DAO\CategoriesDAO;
use App\DAO\EventsDAO;
use App\DAO\UsersDAO;

require __DIR__ . '/../vendor/autoload.php';

include '../dao/database.php';
include '../dao/categoriesDAO.php';
include '../dao/eventsDAO.php';
include '../dao/UsersDAO.php';

$app = AppFactory::create();

$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorHandler = function ($request, Throwable $exception, bool $displayErrorDetails, bool $logErrors, bool $logErrorDetails) use ($app) {
    $response = $app->getResponseFactory()->createResponse();
    $statusCode = 500;
    $errorMessage = 'Internal Server Error';

    if ($exception instanceof HttpNotFoundException) {
        $statusCode = 404;
        $errorMessage = 'Path not supported';
    }

    $response->getBody()->write(json_encode([
        'error' => $errorMessage
    ]));

    return $response->withStatus($statusCode)->withHeader('Content-Type', 'application/json');
};
$errorMiddleware->setDefaultErrorHandler($errorHandler);

$app->get('/hello', function (Request $request, Response $response, $args) {
    $response->getBody()->write("hello there");
    return $response;
});

$app->run();
