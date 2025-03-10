import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
// import Login from './components/Login';
import imagePath from "./assets/logo.svg";
import BrandLogo from './assets/Logo_PixelMart_2.svg';
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
import ItemPage from './components/itemPage/ItemPage';
import UploadItem from './components/dashboard/UploadItem';
import ProtectedRoute from './components/ProtectedRoute';
import EditItem from './components/dashboard/EditItem';
import ContactUs from './components/ContactUs';
import CartPage from './components/cart/CartPage';
import CheckoutSuccess from './components/cart/CheckoutSuccess';
import OrderDetails from './components/dashboard/OrderDetails';
import SearchResults from './components/SearchResults';
import useInactivityLogout from './hooks/useInactivityLogout';
import WriteReview from './components/dashboard/WriteReview';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { isAuthenticated, user, logout, getAccessTokenSilently } = useAuth0();
  useInactivityLogout();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();

          const syncData = {
            auth0_id: user.sub,
            email: user.email,
            name: user.name === user.email ? "New User" : user.name,
            avatar: user.picture,
          };

          const response = await fetch(`${API_BASE_URL}/users/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(syncData),
          });

          if (response.status === 403) {
            console.warn("User account is deleted. Logging out...");
            logout({ logoutParams: { returnTo: window.location.origin } });
            return;
          }

          const data = await response.json();
          if (data?.user) {
            console.log("User synced: ", data.user);
          }
        } catch (err) {
          console.error("Error syncing user: ", err);
        }
      }
    };

    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently, logout]);

  return (
    <div className="App">
      <Navbar
        brandName={BrandLogo}
        imageSrcPath={imagePath}
      />
      <Routes>
        <Route path="/" element={<Home brandName={BrandLogo} imageSrcPath={imagePath} />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/auth" element={<Login />} /> */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="listings" element={<Listings />} />
            <Route path="upload" element={<UploadItem />} />
            <Route path="edit-item/:itemId" element={<EditItem />} />
            <Route path="metrics" element={<Metrics />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="settings" element={<Settings />} />
            <Route path="items/:itemId/write-review" element={<WriteReview />} />
          </Route>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout-cancel" element={<Navigate to="/cart" replace />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/profile/:identifier" element={<Profile />} />
        <Route path="/listing/:itemId" element={<ItemPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
