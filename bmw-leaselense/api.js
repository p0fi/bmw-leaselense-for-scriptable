const configuration = importModule('config');
const utils = importModule('utils');

const URL = `https://customer.bmwgroup.com/webapi/v1/user/vehicles/`;

module.exports.fetchVehicleImage = async function () {
  console.log('fetching vehicle image...');

  let req = new Request(`${URL}/${configuration.VIN}/image?view=side&width=250`);
  const access_token = await getAPIToken();
  req.headers = { Authorization: `Bearer ${access_token}` };

  let resp = await req.loadImage();
  return resp;
};

module.exports.fetchVehicleData = async function () {
  console.log('fetching vehicle data...');

  let req = new Request(`${URL}/${configuration.VIN}/status?offset=-60`);
  const access_token = await getAPIToken();
  req.headers = { Authorization: `Bearer ${access_token}` };

  let resp = await req.loadJSON();
  return {
    mileage: parseInt(resp.vehicleStatus.mileage),
    remainingRange: resp.vehicleStatus.remainingRangeFuel,
    updated: resp.vehicleStatus.updateTime,
  };
};

async function getAPIToken() {
  console.log('checking keychain for API token...');
  if (!Keychain.contains('bmw_access_token')) {
    console.log('no token found...');
    if (!(await requestAPIToken())) return;
    return getAPIToken();
  }
  console.log('checking if its stil valid...');
  const token = JSON.parse(Keychain.get('bmw_access_token'));

  if (Math.floor(Date.now() / 1000) >= token.expires_at) {
    console.log('existing token expired...');
    if (!(await requestAPIToken())) return;
    return getAPIToken();
  }

  console.log('valid token found!');
  return token.access_token;
}

async function requestAPIToken() {
  console.log('requesting API token...');

  const URL = 'https://customer.bmwgroup.com/gcdm/oauth/token';
  const OAuthClientData = {
    grant_type: 'password',
    scope: 'authenticate_user vehicle_data remote_services',
    username: configuration.USERNAME,
    password: configuration.PASSWORD,
  };
  const data = utils.encodeAsQueryString(OAuthClientData);

  let req = new Request(`${URL}`);
  req.method = 'POST';
  req.headers = {
    Authorization:
      'Basic MzFjMzU3YTAtN2ExZC00NTkwLWFhOTktMzNiOTcyNDRkMDQ4OmMwZTMzOTNkLTcwYTItNGY2Zi05ZDNjLTg1MzBhZjY0ZDU1Mg==',
    Credentials: 'nQv6CqtxJuXWP74xf3CJwUEP:1zDHx6un4cDjybLENN3kyfumX2kEYigWPcQpdvDRpIBk7rOJ',
  };
  req.body = data;

  let resp = await req.loadJSON();

  // Making sure the response has what we need
  if (!resp['access_token']) return false;
  if (!resp['expires_in']) return false;
  if (!resp['refresh_token']) return false;

  // Saving the token to the keychain
  const token = {
    access_token: resp.access_token,
    refresh_token: resp.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + parseInt(resp.expires_in),
  };

  Keychain.set('bmw_access_token', JSON.stringify(token));
  return true;
}
