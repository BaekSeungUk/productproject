import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import './CommunityDetail.css'
import axios from "axios";
import UserContext from '../Context/UserContext';

// .env 파일에서 API URL을 불러옴
const API_URL = import.meta.env.VITE_API_URL;

const CommunityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    // 댓글 관련 상태
    const [comments, setComments] = useState([]);
    const [commentLoading, setCommentLoading] = useState(true);
    const [commentError, setCommentError] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    // 댓글 삭제 상태
    const [commentDeletingId, setCommentDeletingId] = useState(null);

    useEffect(() => {
        // 게시글 불러오기
        const getPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/board/list`, {
                    withCredentials: true,
                });
                const boards = response.data.boards || [];
                const found = boards.find(
                    (p) => String(p.id) === String(id) || String(p.board_id) === String(id)
                );
                setPost(found);
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
        getPost();
    }, [id]);

    // 댓글 불러오기
    useEffect(() => {
        const getComments = async () => {
            setCommentLoading(true);
            setCommentError(null);
            try {
                // 댓글 API 엔드포인트 예시: /board/:id/comments
                const response = await axios.get(`${API_URL}/board/${id}/comments`, {
                    withCredentials: true,
                });
                setComments(response.data.comments || []);
            } catch (err) {
                setCommentError(
                    (err.response && err.response.data && err.response.data.message) ||
                    err.message ||
                    "댓글을 불러오는 중 오류가 발생했습니다."
                );
            } finally {
                setCommentLoading(false);
            }
        };
        if (id) getComments();
    }, [id]);

    // 게시글 삭제 핸들러 (deleting 상태 사용)
    const [deleting, setDeleting] = useState(false);

    const handleDeletePost = async () => {
        if (!user) {
            alert("로그인 후 삭제할 수 있습니다.");
            return;
        }
        if (!post) {
            alert("삭제할 게시글이 없습니다.");
            return;
        }
        if (
            !(
                user.user_id === post.user_id ||
                user.user_id === post.author_id ||
                user.username === post.author ||
                user.username === post.username
            )
        ) {
            alert("본인 게시글만 삭제할 수 있습니다.");
            return;
        }
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            return;
        }
        setDeleting(true);
        try {
            await axios.delete(`${API_URL}/board/${id}`, {
                withCredentials: true,
                data: { user_id: user.user_id },
            });
            alert("게시글이 삭제되었습니다.");
            navigate("/teacommunity", { replace: true });
        } catch (err) {
            alert(
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                "게시글 삭제 중 오류가 발생했습니다."
            );
        } finally {
            setDeleting(false);
        }
    };

    // 댓글 작성 핸들러
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("로그인 후 댓글을 작성할 수 있습니다.");
            return;
        }
        if (!newComment.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        setCommentSubmitting(true);
        try {
            // user_id를 함께 전송
            await axios.post(
                `${API_URL}/board/${id}/comments`,
                { content: newComment, user_id: user.user_id },
                { withCredentials: true }
            );
            setNewComment("");
            // 댓글 새로고침
            const response = await axios.get(`${API_URL}/board/${id}/comments`, {
                withCredentials: true,
            });
            setComments(response.data.comments || []);
        } catch (err) {
            alert(
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                "댓글 등록 중 오류가 발생했습니다."
            );
        } finally {
            setCommentSubmitting(false);
        }
    };

    // 댓글 삭제 핸들러
    const handleDeleteComment = async (commentId, commentUserId) => {
        if (!user) {
            alert("로그인 후 댓글을 삭제할 수 있습니다.");
            return;
        }
        if (
            !(
                user.user_id === commentUserId ||
                user.id === commentUserId ||
                user.username === commentUserId // 혹시 username이 저장된 경우
            )
        ) {
            alert("본인 댓글만 삭제할 수 있습니다.");
            return;
        }
        if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
            return;
        }
        setCommentDeletingId(commentId);
        try {
            await axios.delete(`${API_URL}/board/${id}/comments/${commentId}`, {
                withCredentials: true,
                data: { user_id: user.user_id },
            });
            // 댓글 새로고침
            const response = await axios.get(`${API_URL}/board/${id}/comments`, {
                withCredentials: true,
            });
            setComments(response.data.comments || []);
        } catch (err) {
            alert(
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                "댓글 삭제 중 오류가 발생했습니다."
            );
        } finally {
            setCommentDeletingId(null);
        }
    };

    // 목록으로 이동 함수: 항상 커뮤니티 목록으로 이동 (뒤로가기 대신)
    const goToList = () => {
        navigate("/teacommunity", { replace: true });
    };

    if (loading) {
        return (
            <div className="community-detail-loading">
                <h2 className="community-detail-loading-title">게시글을 불러오는 중입니다...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="community-detail-error">
                <h2 className="community-detail-error-title">{error}</h2>
                <button
                    className="community-detail-back-btn"
                    onClick={goToList}
                >
                    돌아가기
                </button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="community-detail-notfound">
                <h2 className="community-detail-notfound-title">게시글을 찾을 수 없습니다.</h2>
                <button
                    className="community-detail-back-btn"
                    onClick={goToList}
                >
                    돌아가기
                </button>
            </div>
        );
    }

    // 본인 글인지 확인 (author, username, user.id 비교)
    const isMyPost =
        (user &&
            (
                (post.author && post.author === user.username) ||
                (post.user_id && String(post.user_id) === String(user.id))
            )
        );

    // Boards 테이블의 컬럼: id(board_id), title, content, author(username), created_at
    return (
        <>
            <div className="community-detail-container">
                <h2 className="community-detail-title">
                    {post.title}
                </h2>
                <div className="community-detail-content">
                    {post.content}
                </div>
                <div className="community-detail-author">
                    작성자: {post.author || post.username || "익명"}
                </div>
                <div className="community-detail-date">
                    작성일:{" "}
                    {post.created_at
                        ? new Date(post.created_at).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "-"}
                </div>
                <div className="community-detail-btn-group">
                    <button
                        className="community-detail-back-btn"
                        onClick={goToList}
                    >
                        목록으로 돌아가기
                    </button>
                    {isMyPost && (
                        <>
                            <button
                                className="community-detail-edit-btn"
                                onClick={() => navigate(`/edit/${post.id || post.board_id}`)}
                            >
                                글 수정하기
                            </button>
                            <button
                                className="community-detail-edit-btn"
                                style={{ background: "#fff0f0", color: "#c0392b", border: "1.5px solid #c0392b" }}
                                onClick={handleDeletePost}
                                disabled={deleting}
                            >
                                {deleting ? "삭제 중..." : "글 삭제하기"}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="community-detail-comment-section">
                {/* 댓글 작성 폼 */}
                <form
                    onSubmit={handleCommentSubmit}
                    className="community-detail-comment-form"
                >
                    <input
                        type="text"
                        className="community-detail-comment-input"
                        placeholder={user ? "댓글을 입력하세요." : "로그인 후 댓글 작성 가능"}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!user || commentSubmitting}
                        maxLength={200}
                    />
                    <button
                        type="submit"
                        className="community-detail-comment-submit-btn"
                        disabled={!user || commentSubmitting}
                    >
                        {commentSubmitting ? "등록 중..." : "댓글 등록"}
                    </button>
                </form>
                {/* 댓글 영역 추가 */}
                <div className="community-detail-comments-wrapper">
                    <h3 className="community-detail-comments-title">댓글</h3>
                    {commentLoading ? (
                        <div className="community-detail-comments-loading">댓글을 불러오는 중입니다...</div>
                    ) : commentError ? (
                        <div className="community-detail-comments-error">{commentError}</div>
                    ) : (
                        <div>
                            {comments.length === 0 ? (
                                <div className="community-detail-comments-empty">아직 댓글이 없습니다.</div>
                            ) : (
                                <ul className="community-detail-comments-list">
                                    {comments.map((c) => {
                                        // 본인 댓글인지 확인
                                        const isMyComment =
                                            user &&
                                            (
                                                (c.user_id && (String(c.user_id) === String(user.user_id) || String(c.user_id) === String(user.id))) ||
                                                (c.username && c.username === user.username)
                                            );
                                        return (
                                            <li key={c.id || c.comment_id} className="community-detail-comment-item">
                                                <div className="community-detail-comment-content">{c.content}</div>
                                                <div className="community-detail-comment-meta">
                                                    {c.author || c.username || "익명"} |{" "}
                                                    {c.created_at
                                                        ? new Date(c.created_at).toLocaleString("ko-KR", {
                                                            year: "2-digit",
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                        : "-"}
                                                    {/* 댓글 삭제 버튼 (본인 댓글만) */}
                                                    {isMyComment && (
                                                        <button
                                                            className="community-detail-comment-delete-btn"
                                                            onClick={() => handleDeleteComment(c.id || c.comment_id, c.user_id || c.username)}
                                                            disabled={commentDeletingId === (c.id || c.comment_id)}
                                                            type="button"
                                                        >
                                                            {commentDeletingId === (c.id || c.comment_id) ? "삭제 중..." : "삭제"}
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default CommunityDetail;