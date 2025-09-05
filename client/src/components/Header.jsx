import { useNavigate } from 'react-router-dom';
import './Header.css';
import teaLogo from '../assets/tealogo.png';
import { useContext, useEffect } from "react";
import axios from 'axios';
import UserContext from '../Context/UserContext';

// .env에서 백엔드 API URL을 불러옵니다.
const API_URL = import.meta.env.VITE_API_URL;

const Header = () => {
    const { isLogin, user, setIsLogin, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const accessToken = () => {
        axios({
            url: `${API_URL}/accesstoken`,
            method: "GET",
            withCredentials: true,
        });
    };

    // 로그아웃 시 UserContext의 값도 초기화
    const logout = () => {
        axios({
            url: `${API_URL}/auth/logout`,
            method: "POST",
            withCredentials: true,
        }).then((result) => {
            if (result.status === 200) {
                setIsLogin(false);
                setUser({});
                window.open("/", "_self");
            }
        });
    };

    useEffect(() => {
        try {
            axios({
                url: `${API_URL}/auth/success`,
                method: "GET",
                withCredentials: true,
            })
                .then((result) => {
                    if (result.data) {
                        setIsLogin(true);
                        setUser(result.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }, [isLogin]);

    return (
        <header className='Header'>
            <div className='header_left'>
                <div>☰</div>
                <ul className="menu">
                    <li className="menu-item" onClick={() => navigate("/about")}>
                        <span>차에 대하여</span>
                    </li>
                    <li className="menu-item has-submenu">
                        <span onClick={() => navigate("/teacategories?type=녹차")}>차의 종류</span>
                        <ul className="submenu">
                            <li onClick={() => navigate("/teacategories?type=녹차")}>녹차</li>
                            <li onClick={() => navigate("/teacategories?type=백차")}>백차</li>
                            <li onClick={() => navigate("/teacategories?type=청차")}>청차</li>
                            <li onClick={() => navigate("/teacategories?type=홍차")}>홍차</li>
                            <li onClick={() => navigate("/teacategories?type=황차")}>황차</li>
                            <li onClick={() => navigate("/teacategories?type=흑차")}>흑차</li>
                        </ul>
                    </li>
                    <li className="menu-item" onClick={() => navigate("/teatools")}>
                        <span>차도구</span>
                    </li>
                    <li className="menu-item" onClick={() => navigate("/teacommunity")}>
                        <span>게시판</span>
                    </li>
                </ul>
            </div>
            <div className='header_center' onClick={() => navigate("/")}>
                <div className="home-label">
                    <div className="logo-container">
                        <img 
                            src={teaLogo} 
                            alt="차 로고" 
                            className="logo-image"
                        />
                    </div>
                </div>
            </div>
            <div className='header_right'>
                {isLogin ? (
                    <>
                        <span className="welcome-msg">{user.username}님 환영합니다</span>
                        <button className="auth-btn logout-btn" onClick={logout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <button className="auth-btn login-btn" onClick={() => navigate("/login")}>로그인</button>
                        <button className="auth-btn register-btn" onClick={() => navigate("/register")}>회원가입</button>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header;