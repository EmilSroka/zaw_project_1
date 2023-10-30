<?php
namespace App\Auth;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Psr7\Response as SlimResponse;

class AuthMiddleware {
    private $authService;

    public function __construct($authService) {
        $this->authService = $authService;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response {
        $token = $request->getHeaderLine('Authorization');
        
        if (!$this->authService->isValidToken($token)) {
            $response = new SlimResponse();
            $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        return $handler->handle($request);
    }
}
