var graph = require('@microsoft/microsoft-graph-client');


export function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api('/me').get();
  return user;
}


export async function upload123(accessToken, blob) {


    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    const client = getAuthenticatedClient(accessToken);
    
    var date = month + '-' + date + '-' + year
    var full_name = 'Transcript History_' + date + '.txt';
    const upload =  await client.api('/me/drive/root:/' + full_name + ':/content')
    .put(blob);
    
    return upload;
}

export async function getFolders(accessToken) {

  const client = getAuthenticatedClient(accessToken);
  const folders = await client.api('/me/drive/root/children').get();
  return folders;
}
 