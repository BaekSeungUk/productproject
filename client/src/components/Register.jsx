import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// .env 파일에서 API URL을 불러옵니다.
const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState("");
    const [error, setError] = useState(""); // 오류 메시지 상태
    const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault();

        if (password !== passwordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        axios({
            url: `${API_URL}/auth/register`,
            method: "POST",
            withCredentials: true,
            data: {
                username: username,
                email: email,
                password: password,
            },
        }).then((result) => {
            if (result.status === 201) {
                console.log("회원가입 성공")
                alert("회원가입 성공!");
                navigate("/login");
            }
        }).catch((error) => {
            console.log("회원가입 실패:", error);
        });
    };

    // passwordCheck 입력 시마다 체크해서 error 상태 변경
    const handlePasswordCheckChange = (e) => {
        setPasswordCheck(e.target.value);
        if (password !== e.target.value) {
            setError("비밀번호가 일치하지 않습니다.");
        } else {
            setError("");
        }
    };

    return (
        <div>
            <div className="login-box">
                <h2>회원가입</h2>
                <form>
                    <div className="user-box">
                        <input
                            type="text"
                            className={`inputValue ${username ? "filled" : ""}`}
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <label className="inputLabel">이름</label>
                    </div>
                    <div className="user-box">
                        <input
                            type="email"
                            className={`inputValue ${email ? "filled" : ""}`}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <label className="inputLabel">email</label>
                    </div>
                    <div className="user-box">
                        <input
                            type="password"
                            className={`inputValue ${password ? "filled" : ""}`}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <label className="inputLabel">password</label>
                    </div>
                    <div className="user-box">
                        <input
                            type="password"
                            className={`inputValue ${passwordCheck ? "filled" : ""}`}
                            value={passwordCheck}
                            onChange={handlePasswordCheckChange}
                            required
                        />
                        <label>password 재확인</label>
                        {/* 오류 메시지 */}
                        {error && (
                            <p style={{ color: "red", marginTop: "-20px", marginBottom: "20px", fontSize: "14px" }}>
                                {error}
                            </p>
                        )}
                    </div>
                </form>
                <button onClick={register} className="loginButton">회원가입</button>
            </div>
        </div>
    );
}

export default Register;