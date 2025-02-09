import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
// import Login from './components/Login';
import imagePath from "./assets/logo.svg";
import Dashboard from './components/Dashboard';
import Overview from './components/dashboard/Overview';
import Orders from './components/dashboard/Orders';
import Listings from './components/dashboard/Listings';
import Metrics from './components/dashboard/Metrics';
import Inbox from './components/dashboard/Inbox';
import Wishlist from './components/dashboard/Wishlist';
import Settings from './components/dashboard/Settings';
import Profile from './components/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import NotFound from './components/NotFound';
import ItemPage from './components/ItemPage';
import UploadItem from './components/dashboard/UploadItem';

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { isAuthenticated, user, logout } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      const syncData = {
        auth0_id: user.sub,
        email: user.email,
        name: user.name,
        avatar: user.picture,
      };

      fetch(`${API_BASE_URL}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncData),
      })
        .then((res) => {
          if (res.status === 403) {
            console.warn("User account is deleted. Logging out...");
            logout({ logoutParams: { returnTo: window.location.origin } }); // Force logout the user
            return;
          }

          return res.json()
        })
        .then((data) => {
          if (data?.user) {
            console.log('Used synced: ', data.user);
          }
        })
        .catch((err) => {
          console.error('Error syncing user: ', err);
        });
    }
  }, [isAuthenticated, user]);

  return (
    <div className="App">
      <Navbar
        brandName="PixelMart"
        imageSrcPath={imagePath}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/auth" element={<Login />} /> */}
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="orders" element={<Orders />} />
          <Route path="listings" element={<Listings />} />
          <Route path="upload" element={<UploadItem />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/profile/:auth0Id" element={<Profile />} />
        <Route path="/item/:itemId" element={<ItemPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
