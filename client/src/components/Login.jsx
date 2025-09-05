import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import "./Login.css"
import { useNavigate } from "react-router-dom";
import UserContext from "../Context/UserContext";

// .env 파일에서 API URL을 불러옵니다.
const API_URL = import.meta.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const { setIsLogin, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    // 이메일 또는 비밀번호가 비어있는지 확인
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const result = await axios({
        url: `${API_URL}/auth/login`,
        method: "POST",
        withCredentials: true,
        data: {
          email: email,
          password: password,
        },
      });

      if (result.status === 200) {
        setIsLogin(true);
        setUser(result.data.user);
        navigate("/");
      }
    } catch (error) {
      // 서버에서 401 또는 400 등 에러가 올 경우
      if (error.response && error.response.status === 401) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <>
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="user-box">
            <input
              type="email"
              className={`inputValue ${email ? 'filled' : ''}`}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label className="inputLabel">email</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              className={`inputValue ${password ? 'filled' : ''}`}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <label>password</label>
          </div>
          <button onClick={login} className="loginButton">로그인</button>
          <button onClick={() => navigate("/register")} className="logoutButton">회원가입</button>
        </form>
      </div>
    </>
  );
}

export default Login;