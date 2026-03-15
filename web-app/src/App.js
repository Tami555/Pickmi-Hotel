import './styles/app.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { common_routes, authorized_routes, no_authorized_routes } from './routes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader } from "./components/UI/feedback/Loader";


function AppContent() {
  const { isAuth, isLoading } = useAuth();
  if (isLoading) {
    return <Loader/>;
  }
  const routes_path = common_routes.concat(isAuth ? authorized_routes : no_authorized_routes);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {routes_path.map(r => (
            <Route key={r.path} path={r.path} element={<r.element/>}/>
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
  );
}

export default App;
