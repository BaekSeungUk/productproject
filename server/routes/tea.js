import { Router } from "express";
import { pool } from "../index.js";

const router = Router();

// tea 테이블의 모든 정보를 가져오는 라우트입니다.
router.get('/list', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query(`
            SELECT * 
            FROM teas
        `);

        res.status(200).json({ teas: result.recordset });
    } catch (error) {
        console.error('tea 테이블 정보 조회 중 오류:', error);
        res.status(500).json({ message: "tea 정보를 불러오는 중 서버 오류가 발생했습니다." });
    }
});

// TeaTools 테이블의 모든 정보를 가져오는 라우트입니다.
router.get('/tools', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query(`
            SELECT * 
            FROM TeaTools
        `);

        res.status(200).json({ teaTools: result.recordset });
    } catch (error) {
        console.error('TeaTools 테이블 정보 조회 중 오류:', error);
        res.status(500).json({ message: "TeaTools 정보를 불러오는 중 서버 오류가 발생했습니다." });
    }
});



export default router;