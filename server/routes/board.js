import { Router } from "express";
import { pool } from "../index.js";

const router = Router();

 // 게시글 작성 라우트
router.post('/write', async (req, res) => {
    const { title, content, user_id } = req.body;

    // 필수 값 체크
    if (!title || !content || !user_id) {
        return res.status(400).json({ message: "제목, 내용, 작성자 ID는 필수입니다." });
    }

    try {
        const request = pool.request();
        request.input('title', title);
        request.input('content', content);
        request.input('user_id', user_id);

        await request.query(`
            INSERT INTO Boards 
                (title, content, user_id, created_at)
            VALUES 
                (@title, @content, @user_id, GETDATE())
        `);

        res.status(201).json({ message: "게시글이 성공적으로 작성되었습니다." });
    } catch (error) {
        console.error('게시글 작성 중 오류:', error);
        res.status(500).json({ message: "게시글 작성 중 서버 오류가 발생했습니다." });
    }
});

// 게시글 목록 조회 라우트
router.get('/list', async (req, res) => {
    try {
        const request = pool.request();
        // Boards 테이블에서 게시글과 작성자 정보(Users 테이블) 조인해서 가져오기
        const result = await request.query(`
            SELECT 
                b.board_id AS id,
                b.title,
                b.content,
                b.created_at,
                u.username AS author
            FROM Boards b
            LEFT JOIN Users u ON b.user_id = u.user_id
            ORDER BY b.created_at DESC
        `);

        res.status(200).json({ boards: result.recordset });
    } catch (error) {
        console.error('게시글 목록 조회 중 오류:', error);
        res.status(500).json({ message: "게시글 목록을 불러오는 중 서버 오류가 발생했습니다." });
    }
});

// 게시글 수정 라우트
router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    // 인증된 사용자 정보는 req.user 또는 세션 등에서 가져올 수 있음 (여기서는 user_id를 body에서 받는다고 가정)
    const user_id = req.body.user_id;

    // 필수 값 체크
    if (!title || !content) {
        return res.status(400).json({ message: "제목과 내용은 필수입니다." });
    }

    try {
        // 게시글 존재 여부 확인
        const checkRequest = pool.request();
        checkRequest.input('id', id);
        const checkResult = await checkRequest.query(`
            SELECT * FROM Boards WHERE board_id = @id
        `);

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        // 게시글 수정
        const updateRequest = pool.request();
        updateRequest.input('id', id);
        updateRequest.input('title', title);
        updateRequest.input('content', content);

        await updateRequest.query(`
            UPDATE Boards
            SET title = @title, content = @content
            WHERE board_id = @id
        `);

        res.status(200).json({ message: "게시글이 성공적으로 수정되었습니다." });
    } catch (error) {
        console.error('게시글 수정 중 오류:', error);
        res.status(500).json({ message: "게시글 수정 중 서버 오류가 발생했습니다." });
    }
});

// 댓글 목록 조회
router.get('/:id/comments', async (req, res) => {
    const { id } = req.params;
    try {
        const request = pool.request();
        request.input('board_id', id);
        const result = await request.query(`
            SELECT 
                c.comment_id, 
                c.board_id, 
                c.user_id, 
                u.username, 
                c.content, 
                c.created_at
            FROM Comments c
            LEFT JOIN Users u ON c.user_id = u.user_id
            WHERE c.board_id = @board_id
            ORDER BY c.created_at ASC
        `);
        res.status(200).json({ comments: result.recordset });
    } catch (error) {
        console.error('댓글 목록 조회 중 오류:', error);
        res.status(500).json({ message: "댓글을 불러오는 중 서버 오류가 발생했습니다." });
    }
});

// 댓글 작성
router.post('/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    // user_id를 클라이언트에서 받아오는 방식 (예: req.body.user_id)
    // 또는 세션/쿠키에서 직접 추출 (예: req.session.user, req.cookies 등)
    // 여기서는 user_id를 req.body에서 받아오는 예시로 처리
    const user_id = req.body.user_id;
    if (!user_id) {
        return res.status(401).json({ message: "로그인 후 댓글을 작성할 수 있습니다." });
    }

    if (!content || !content.trim()) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    }

    try {
        const request = pool.request();
        request.input('board_id', id);
        request.input('content', content);
        request.input('user_id', user_id);

        await request.query(`
            INSERT INTO Comments (
            board_id, 
            user_id, 
            content, 
            created_at)
            VALUES (
            @board_id, 
            @user_id, 
            @content, 
            GETDATE())
        `);

        res.status(201).json({ message: "댓글이 성공적으로 등록되었습니다." });
    } catch (error) {
        console.error('댓글 등록 중 오류:', error);
        res.status(500).json({ message: "댓글 등록 중 서버 오류가 발생했습니다." });
    }
});

 
// 게시글 삭제 (외래키 참조 고려)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const user_id = req.body.user_id;

    if (!user_id) {
        return res.status(401).json({ message: "로그인 후 삭제할 수 있습니다." });
    }

    try {
        // 게시글 삭제
        const deleteRequest = pool.request();
        deleteRequest.input('id', id);
        deleteRequest.input('user_id', user_id);
        await deleteRequest.query(`
            DELETE FROM Boards 
            WHERE board_id = @id AND user_id = @user_id
        `);

        res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다." });
    } catch (error) {
        console.error('게시글 삭제 중 오류:', error);
        res.status(500).json({ message: "게시글 삭제 중 서버 오류가 발생했습니다." });
    }
});

// 댓글 삭제
router.delete('/:boardId/comments/:commentId', async (req, res) => {
    const { boardId, commentId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(401).json({ message: "로그인 후 댓글을 삭제할 수 있습니다." });
    }

    try {
        // 댓글이 본인 것인지 확인
        const checkRequest = pool.request();
        checkRequest.input('commentId', commentId);
        const checkResult = await checkRequest.query(`
            SELECT user_id FROM Comments WHERE comment_id = @commentId
        `);

        if (
            !checkResult.recordset ||
            checkResult.recordset.length === 0
        ) {
            return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
        }

        const commentOwnerId = checkResult.recordset[0].user_id;
        if (String(commentOwnerId) !== String(user_id)) {
            return res.status(403).json({ message: "본인 댓글만 삭제할 수 있습니다." });
        }

        // 댓글 삭제
        const deleteRequest = pool.request();
        deleteRequest.input('commentId', commentId);
        deleteRequest.input('user_id', user_id);
        await deleteRequest.query(`
            DELETE FROM Comments
            WHERE comment_id = @commentId AND user_id = @user_id
        `);

        res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
    } catch (error) {
        console.error('댓글 삭제 중 오류:', error);
        res.status(500).json({ message: "댓글 삭제 중 서버 오류가 발생했습니다." });
    }
});


export default router;