Bluemix = {};

// Request Bluemix credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Bluemix.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'bluemix'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();

  var scope = (options && options.requestPermissions) || ['openid'];
  var flatScope = _.map(scope, encodeURIComponent).join('+');

  var loginStyle = OAuth._loginStyle('bluemix', config, options);

  var loginUrl =
    'https://login.eu-gb.bluemix.net/UAALoginServerWAR/oauth/authorize' +
    '?client_id=' + config.clientId +
    '&scope=' + flatScope +
    '&redirect_uri=' + OAuth._redirectUri('bluemix', config) +
    '&response_type=code' +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "bluemix",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {width: 900, height: 450}
  });
};
