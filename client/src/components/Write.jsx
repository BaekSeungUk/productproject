import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Write.css';
import UserContext from "../Context/UserContext";
import axios from "axios";

// .env 파일에서 API URL을 불러옵니다.
const API_URL = import.meta.env.VITE_API_URL;

const Write = () => {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const navigate = useNavigate();

    // usercontext에서 사용자 이름을 가져와서 author에 바로 세팅
    useEffect(() => {
        if (user && user.username) {
            setAuthor(user.username);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(("title:" + title))
        console.log(("content:" + content))
        console.log(("user:" + user))

        if (!title || !content || !author) {
            alert("제목, 내용, 작성자 모두 입력해야 합니다.");
            return;
        }

        try {
            const response = await axios({
                url: `${API_URL}/board/write`,
                method: "POST",
                withCredentials: true, // 쿠키 인증 필요시
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    title,
                    content,
                    user_id: user && user.user_id ? user.user_id : null, // user context에 id가 있다고 가정
                },
            });

            if (response.status === 200 || response.status === 201) {
                alert("글이 성공적으로 작성되었습니다!");
                setTitle("");
                setContent("");
                setAuthor(user && user.username ? user.username : "");
                navigate("/teacommunity");
            } else {
                alert(response.data.message || "글 작성에 실패했습니다.");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("서버와 통신 중 오류가 발생했습니다.");
            }
            console.error(error);
        }
    };

    return (
        <div className="write-container">
            <h1 className="write-title">글 작성하기</h1>
            <form className="write-form" onSubmit={handleSubmit}>
                <div className="write-form-group">
                    <label className="write-label">제목</label>
                    <input
                        className="write-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="제목을 입력하세요"
                    />
                </div>
                <div className="write-form-group">
                    <label className="write-label">작성자</label>
                    <input
                        className="write-input"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        placeholder="작성자 이름"
                        readOnly={!!(user && user.username)}
                    />
                </div>
                <div className="write-form-group">
                    <label className="write-label">내용</label>
                    <textarea
                        className="write-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={8}
                        placeholder="내용을 입력하세요"
                    />
                </div>
                <button
                    className="write-submit-btn"
                    type="submit"
                >
                    글 작성하기
                </button>
            </form>
        </div>
    );
};

export default Write;
