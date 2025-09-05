import { useContext } from 'react'
import './App.css'
import Login from './components/Login';
import Register from './components/Register';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Header from './components/Header';
import About from './pages/About';
import TeaCategories from './pages/TeaCategories';
import TeaTools from './pages/TeaTools';
import TeaCommunity from './pages/TeaCommunity';
import Write from './components/Write';
import UserContext from './Context/UserContext';
// TeaCommunityDetail 컴포넌트 import 추가
import TeaCommunityDetail from './pages/CommunityDetail';
import BoardEdit from './components/BoardEdit';

function PrivateRoute({ children }) {
  const { isLogin } = useContext(UserContext);
  // 로그인 안되어 있으면 로그인 페이지로 리다이렉트
  return isLogin ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isLogin } = useContext(UserContext);
  // 로그인 되어 있으면 홈으로 리다이렉트
  return !isLogin ? children : <Navigate to="/" replace />;
}

function App() {
  const { isLogin } = useContext(UserContext);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/teacategories" element={<TeaCategories />} />
        <Route path="/teacategories/:type" element={<TeaCategories />} />
        <Route path="/teatools" element={<TeaTools />} />
        <Route path="/teacommunity" element={<TeaCommunity />} />
        <Route path="/communitydetail/:id" element={<TeaCommunityDetail />} />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <BoardEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="/write"
          element={
            <PrivateRoute>
              <Write />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
