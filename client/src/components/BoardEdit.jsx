import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../Context/UserContext";
import axios from "axios";

const BoardEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 기존 게시글 데이터 불러오기
    useEffect(() => { 
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:5000/board/list", {
                    withCredentials: true,
                });
                const boards = response.data.boards || [];
                const found = boards.find(
                    (p) => String(p.id) === String(id) || String(p.board_id) === String(id)
                );
                if (!found) {
                    setError("게시글을 찾을 수 없습니다.");
                } else {
                    setTitle(found.title || "");
                    setContent(found.content || "");
                }
            } catch (err) {
                setError(
                    (err.response && err.response.data && err.response.data.message) ||
                    err.message ||
                    "알 수 없는 오류가 발생했습니다."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    // 수정 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await axios.put(
                `http://localhost:5000/board/edit/${id}`,
                {
                    title,
                    content,
                },
                {
                    withCredentials: true,
                }
            );
            alert("게시글이 성공적으로 수정되었습니다.");
            // 뒤로가기로 다시 수정페이지로 돌아올 수 없도록 replace 옵션 사용
            navigate(`/communitydetail/${id}`, { replace: true });
        } catch (err) {
            setError(
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                "수정 중 오류가 발생했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
                <h2>게시글 정보를 불러오는 중입니다...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
                <h2 style={{ color: "#4e944f" }}>{error}</h2>
                <button
                    style={{
                        marginTop: "18px",
                        padding: "10px 32px",
                        borderRadius: "22px",
                        background: "linear-gradient(90deg, #7ec850 0%, #b7e4c7 100%)",
                        color: "#3a5d3a",
                        border: "1.5px solid #4e944f",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate(-1)}
                >
                    돌아가기
                </button>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: "600px",
            margin: "40px auto",
            background: "#f8f5f0",
            borderRadius: "18px",
            boxShadow: "0 4px 24px rgba(60, 80, 60, 0.10)",
            border: "2.5px solid #7ec850",
            padding: "36px 28px 32px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "18px"
        }}>
            <h2 style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#3a5d3a",
                textAlign: "center",
                borderBottom: "2px solid #4e944f",
                paddingBottom: "10px",
                marginBottom: "18px"
            }}>
                게시글 수정
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <label style={{ fontWeight: 600, color: "#4e944f" }}>
                    제목
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1.5px solid #eafbe6",
                            marginTop: "6px",
                            fontSize: "1.1rem"
                        }}
                        maxLength={100}
                        required
                    />
                </label>
                <label style={{ fontWeight: 600, color: "#4e944f" }}>
                    내용
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{
                            width: "100%",
                            minHeight: "180px",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1.5px solid #eafbe6",
                            marginTop: "6px",
                            fontSize: "1.08rem",
                            resize: "vertical"
                        }}
                        maxLength={2000}
                        required
                    />
                </label>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "10px" }}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            background: "linear-gradient(90deg, #7ec850 0%, #b7e4c7 100%)",
                            color: "#3a5d3a",
                            border: "1.5px solid #4e944f",
                            borderRadius: "22px",
                            fontSize: "1.08rem",
                            fontWeight: 600,
                            padding: "10px 32px",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(126, 200, 80, 0.13)",
                            letterSpacing: "1px"
                        }}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        style={{
                            background: "linear-gradient(90deg, #4e944f 0%, #7ec850 100%)",
                            color: "#fff",
                            border: "1.5px solid #7ec850",
                            borderRadius: "22px",
                            fontSize: "1.08rem",
                            fontWeight: 600,
                            padding: "10px 32px",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(126, 200, 80, 0.13)",
                            letterSpacing: "1px"
                        }}
                    >
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BoardEdit;
