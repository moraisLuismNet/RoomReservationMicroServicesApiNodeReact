import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const LoginPage = React.lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/Auth/RegisterPage"));
const RoomDetailsPage = React.lazy(() => import("./pages/RoomDetailsPage"));
const MyReservationsPage = React.lazy(
  () => import("./pages/MyReservationsPage")
);
const AdminReservationsListPage = React.lazy(
  () => import("./pages/Admin/AdminReservationsListPage")
);
const AdminReservationsCalendarPage = React.lazy(
  () => import("./pages/Admin/AdminReservationsCalendarPage")
);
const AdminUsersPage = React.lazy(() => import("./pages/Admin/AdminUsersPage"));
const AddRoomPage = React.lazy(() => import("./pages/Admin/AddRoomPage"));
const EditRoomPage = React.lazy(() => import("./pages/Admin/EditRoomPage"));
const PaymentSuccessPage = React.lazy(
  () => import("./pages/Payment/PaymentSuccessPage")
);
const PaymentCancelPage = React.lazy(
  () => import("./pages/Payment/PaymentCancelPage")
);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <React.Suspense
              fallback={
                <div className="flex justify-center items-center h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              }
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/my-reservations"
                    element={<MyReservationsPage />}
                  />
                  <Route path="/rooms/:id" element={<RoomDetailsPage />} />
                  <Route
                    path="/payment/success"
                    element={<PaymentSuccessPage />}
                  />
                  <Route
                    path="/payment/cancel"
                    element={<PaymentCancelPage />}
                  />
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route
                    path="/admin/reservations/list"
                    element={<AdminReservationsListPage />}
                  />
                  <Route
                    path="/admin/reservations/calendar"
                    element={<AdminReservationsCalendarPage />}
                  />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/rooms/new" element={<AddRoomPage />} />
                  <Route
                    path="/admin/rooms/edit/:id"
                    element={<EditRoomPage />}
                  />
                </Route>

                {/* Fallback */}
                <Route
                  path="*"
                  element={
                    <div className="flex items-center justify-center min-h-[400px]">
                      404 - Not Found
                    </div>
                  }
                />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
