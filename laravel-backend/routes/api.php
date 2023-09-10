<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use phpseclib3\Crypt\PublicKeyLoader;
use phpseclib3\Crypt\RSA;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post("/decrypt-data", function (Request $request) {
    if (!$request->encrypted) {
        return response()->json([
            'error' => "Data is empty"
        ], 400);
    }
    $key = PublicKeyLoader::load(file_get_contents(storage_path('private_key.pem')));
    $key = $key->withPadding(RSA::ENCRYPTION_PKCS1);
    $request_data = [];
    $decrypted_data = json_decode($key->decrypt(base64_decode($request->encrypted)));

    return response()->json([
        "message" => "Data Decrypted!",
        "data" => [
            "encrypted" => $request->encrypted,
            "decrypted" => $decrypted_data
        ]
    ]);

});