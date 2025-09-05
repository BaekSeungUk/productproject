import React, { useState, useEffect, useContext } from "react";
import './TeaCommunity.css'
import UserContext from '../Context/UserContext';
import { useNavigate } from "react-router-dom";
import CommunityDetail from "./CommunityDetail";
import axios from "axios";

// .env 파일에서 API URL을 불러옴
const API_URL = import.meta.env.NEXT_PUBLIC_API_URL;

const PAGE_SIZE = 5; // 한 페이지에 보여줄 게시글 수
const TOTAL_PAGES = 10; // 10페이지까지만

const TeaCommunity = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // boards 테이블에서 게시글 데이터 가져오기 (axios 사용)
    useEffect(() => {
        const getPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/board/list`, {
                    withCredentials: true,
                });
                // 서버에서 boards 테이블의 컬럼명에 맞게 매핑
                // 예: id, title, content, author, created_at 등
                setPosts(response.data.boards || response.data); // boards 배열로 오면 data.boards, 아니면 data
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
        getPosts();
    }, []);

    // 페이징 처리
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / PAGE_SIZE);
    const pagedPosts = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // 페이지네이션 버튼 생성 (10페이지까지만)
    const pageNumbers = [];
    for (let i = 1; i <= Math.min(totalPages, TOTAL_PAGES); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 글작성 버튼 클릭 시
    const handleWriteClick = (e) => {
        e.preventDefault();
        if (!user.user_id) {
            alert("로그인 후 글을 작성할 수 있습니다.");
            navigate("/login");
            return;
        }
        navigate("/write");
    };

    // 게시글 클릭 시 communitydetail로 이동
    const handlePostClick = (postId) => {
        navigate(`/communitydetail/${postId}`);
    };

    return (
        <div className="tea-community-container">
            <h1 className="tea-community-title">차 커뮤니티 게시판</h1>
            <div className="tea-community-write-link-wrapper">
                {/* 글 작성 페이지로 이동하는 버튼 (로그인 필요) */}
                <button
                    className="tea-community-write-link"
                    onClick={handleWriteClick}
                >
                    글 작성하러 가기
                </button>
            </div>
            <div className="tea-community-post-list">
                {loading ? (
                    <p className="tea-community-no-posts">게시글을 불러오는 중입니다...</p>
                ) : error ? (
                    <p className="tea-community-no-posts">{error}</p>
                ) : pagedPosts.length === 0 ? (
                    <p className="tea-community-no-posts">아직 게시글이 없습니다. 첫 글을 작성해보세요!</p>
                ) : (
                    pagedPosts.map((post) => (
                        <div
                            key={post.id || post.board_id}
                            className="tea-community-post"
                            style={{ cursor: "pointer" }}
                            onClick={() => handlePostClick(post.id || post.board_id)}
                        >
                            <h3 className="tea-community-post-title">{post.title}</h3>
                            <p className="tea-community-post-content">{post.content}</p>
                            <div className="tea-community-post-author">
                                작성자: {post.author || post.username || "익명"}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* 페이지네이션 */}
            <div className="tea-community-pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`tea-community-page-btn${currentPage === 1 ? " disabled" : ""}`}
                >
                    이전
                </button>
                {pageNumbers.map((num) => (
                    <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        className={`tea-community-page-btn${currentPage === num ? " active" : ""}`}
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pageNumbers.length}
                    className={`tea-community-page-btn${currentPage === pageNumbers.length ? " disabled" : ""}`}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default TeaCommunity;