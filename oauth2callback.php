/*
    Title: oauth2callback.php
    Summary: Handles the OAuth2 callback for Google API authentication.
             Manages the intiial authentication request and the token exchange. 
    Author: Kay Rogage - Week 11
*/

<?php

/*
    Title: oauth2callback.php
    Summary: Handles the OAuth2 callback for Google API authentication.
             Manages the intiial authentication request and the token exchange. 
    Author: Kay Rogage - Week 11
*/

// Runs the autoload.php file from the Composer vendor folder.
require_once __DIR__.'/vendor/autoload.php';

session_start();

// Initialises the Google Client. 
$client = new Google\Client();
// Sets the authentication configuration using the JSON file that includes the client credentials. 
$client->setAuthConfigFile('client_secret.json');
// Sets the URI to redirect back to after the authentication completes.
$client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php');
// Adds a scope to the request which requests access to the user's email address. 
$client->addScope("https://www.googleapis.com/auth/userinfo.email");

// If the user isn't authorised to use the app.
if (! isset($_GET['code'])) {
    // Creates an authentication URL.
    $auth_url = $client->createAuthUrl();
    // Redirect the user to the Google OAuth2 login page.
    header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
} else {
    // Completes authentication by exchanging the code for an access token.
    $client->authenticate($_GET['code']);
    // Stores the access token for later.
    $_SESSION['access_token'] = $client->getAccessToken();
    // Sets the URL to redirect the user to after authentication is successful.
    $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/about.php';
    // Redirect the user to index.php
    header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
}
?>