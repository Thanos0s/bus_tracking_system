import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AccountSettings from './pages/account-settings';
import PassengerDashboard from './pages/passenger-dashboard';
import TripPlanner from './pages/trip-planner';
import RouteDetails from './pages/route-details';
import EmergencyResponse from './pages/emergency-response';
import BusStopInformation from './pages/bus-stop-information';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Main app routes */}
        <Route path="/" element={<PassengerDashboard />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/route-details" element={<RouteDetails />} />
        <Route path="/emergency-response" element={<EmergencyResponse />} />
        <Route path="/bus-stop-information" element={<BusStopInformation />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
