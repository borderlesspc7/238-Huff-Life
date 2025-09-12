import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../pages/Login/LoginPage";
import { RegisterPage } from "../pages/Register/RegisterPage";

export const AppRoutes = () => {
  function Menu() {
    return <div>Menu</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<LoginPage />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.register} element={<RegisterPage />} />
        <Route
          path={paths.menu}
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
