<?php
/*
    Title: about.php
    Summary: 
    Author: Luke Walpole, Kay Rogage - Week 11 (Mostly your work but slightly adapted to meet my needs)
*/

// Runs the autoload.php file from the Composer vendor folder.
require_once __DIR__.'/vendor/autoload.php';

session_start();

// Initialises the Google Client. 
$client = new Google\Client();
// Sets the authentication configuration using the JSON file that includes the client credentials. 
$client->setAuthConfig('client_secret.json');
// Adds a scope to the request which requests access to the user's email address. 
$client->addScope("https://www.googleapis.com/auth/userinfo.email");

// Checks if the user is already authenticated with an access token or not.
if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
    // Sets the access token in the client to make an authenticated request.
    $client->setAccessToken($_SESSION['access_token']);

    //HTML 
    echo "<h1>Authorised User</h1>";
    echo "<p>Only users who have had their Google sign in credentials are authorised to see this page.</p>";
    echo "<form action='index.html' method='post'>
                <input type='submit' name='signOut' value='Sign Out' />
          </form>";
    echo "<h1>Google OAuth Process</h1>";
    echo "<p>1. If the user is not already signed into Google, they will be prompted to sign in. This is the first step in confirming your identity and securing access.</p>";
    echo "<p>2. When the user is signed in, they will be prompted to authorise the application which involves granting access to information about their Google account.</p>";
    echo "<p>3. After the user has signed in and authorised the app, they are provided access to the OAuth-protected parts of the app. In this instance, that is about.php.</p>";
    echo "<p>4. When the user signs out, their access token is revoked and they are redirected to the home page which in this instance is index.html.</p>";
} else {
    // Sets the URL to redirect the user to OAuth2 callback if there is no access token.
    $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php';
    header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
}

// Deals with the sign-out process.
if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST['signOut'])) {
    // Revokes the access token.
    $client->revokeToken($_SESSION['access_token']);
    // Destroys the session to clear all data.
    session_destroy();
    // Redirects the user back to the home page after logging out.
    $redirect = 'http://' . $_SERVER['HTTP_HOST'] . '/index.html';
    header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
}
?>