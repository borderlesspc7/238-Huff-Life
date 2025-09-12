import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
