import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import { ProfileProvider } from './context/ProfileContext.tsx';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri:window.location.origin,
          audience: audience,
          scope: "openid profile email read:files write:files",
        }}
      >
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
);
