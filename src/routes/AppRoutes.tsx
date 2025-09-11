import { Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => {
  function Login() {
    return <div>Login</div>;
  }
  function Register() {
    return <div>Register</div>;
  }
  function Menu() {
    return <div>Menu</div>;
  }

  return (
    <Routes>
      <Route path={paths.login} element={<Login />} />
      <Route path={paths.register} element={<Register />} />
      <Route
        path={paths.menu}
        element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
