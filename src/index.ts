import { createAuth0Client } from '@auth0/auth0-spa-js';

const init = async () => {
  const client = await createAuth0Client({
    clientId: 'Q3lJC1iSCtZoBfnmdaZrzIrALn4D8KOt',
    domain: 'currentdigital.us.auth0.com',
    authorizationParams: {
      redirect_uri: 'https://lfca.webflow.io/',
      audience: 'https://auth.currentdigital.io',
    },
  });

  const url = new URLSearchParams(window.location.search);
  const code = url.get('code');
  if (code) {
    await client.handleRedirectCallback();
    history.replaceState({}, document.title, window.location.origin + window.location.pathname);
  }

  const isLoggedIn = await client.isAuthenticated();

  console.log(isLoggedIn);

  if (isLoggedIn) {
    const access_token = await client.getTokenSilently();
    const user = await client.getUser();
  }

  window.Webflow ||= [];
  window.Webflow.push(() => {
    const loginElement = document.querySelector('[data-element="login"]');
    const logoutElement = document.querySelector('[data-element="logout"]');
    if (!loginElement || !logoutElement) return;

    loginElement.addEventListener('click', async () => {
      await client.loginWithRedirect();
    });

    logoutElement.addEventListener('click', async () => {
      await client.logout();
    });
  });
};

init();
