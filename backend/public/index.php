<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use DI\Container;
use Slim\Factory\AppFactory;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Slim\Exception\HttpNotFoundException;

use App\DAO\Database;
use App\DAO\CategoriesDAO;
use App\DAO\EventsDAO;
use App\DAO\UsersDAO;
use App\Auth\AuthService;
use App\Auth\AuthMiddleware;
use App\Errors\UsernameAlreadyExistsError;
use App\Errors\ValidationError;
use App\Errors\AuthenticationError;

require __DIR__ . '/../vendor/autoload.php';

include '../dao/database.php';
include '../dao/categoriesDAO.php';
include '../dao/eventsDAO.php';
include '../dao/usersDAO.php';
include '../auth/authService.php';
include '../auth/authMiddleware.php';
include '../errors.php';


#######################
# Depenency Injection #
#######################

$container = new Container();

$container->set('database', function () {
    return (new Database())->connect();
});
$container->set('user-dao', function (Container $container) {
    $database = $container->get('database');
    return new UsersDAO($database);
});
$container->set('auth-service', function (Container $container) {
    $userDAO = $container->get('user-dao');
    return new AuthService($userDAO);
});
$container->set('auth-middleware', function (Container $container) {
    $authService = $container->get('auth-service');
    return new authMiddleware($authService);
});


#############
# App Setup #
#############

AppFactory::setContainer($container);
$app = AppFactory::create();
$authMiddleware = $container->get('auth-middleware');

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


#############
# Endpoints #
#############

$app->get('/hello', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Morning Babe");
    return $response;
})->add($authMiddleware);

$app->post('/register', function (Request $request, Response $response) use ($container) {
    $auth = $container->get('auth-service');
    try {
        $data = json_decode($request->getBody(), true);
        $auth->register($data);
        $response->getBody()->write(json_encode(['message' => 'User registered successfully']));
        return $response->withHeader('Content-Type', 'application/json');
    } catch (ValidationError $e) {
        $response->getBody()->write(json_encode(['error' => 'Invalid data. Check if `username` and `password` are of type string and if both are shorter then 256 characters.']));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    } catch (UsernameAlreadyExistsError $e) {
        $response->getBody()->write(json_encode(['error' => 'User with this `username` already exists.']));
        return $response->withStatus(409)->withHeader('Content-Type', 'application/json');
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(['error' => 'Unexpected Error. Try later or with different data. Check also if payload is correct.']));
        return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
    }
});

$app->post('/login', function (Request $request, Response $response) use ($container) {
    $auth = $container->get('auth-service');
    try {
        $data = json_decode($request->getBody(), true);
        $token = $auth->login($data);
        $response->getBody()->write(json_encode(['token' => $token]));
        return $response->withHeader('Content-Type', 'application/json');
    } catch (ValidationError $e) {
        $response->getBody()->write(json_encode(['error' => 'Invalid data. Check if `username` and `password` are of type string and if both are shorter then 256 characters.']));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    } catch (AuthenticationError $e) {
        $response->getBody()->write(json_encode(['error' => 'Invalid `username` or `password`']));
        return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(['error' => 'Unexpected Error. Try later or with different data. Check also if payload is correct.']));
        return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
    }
});

$app->run();
