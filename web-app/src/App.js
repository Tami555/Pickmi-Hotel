import './styles/app.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { common_routes } from './routes';



function App() {
  const routes_path = common_routes // потом + пути которые доступны смотря по авторизации
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

export default App;
