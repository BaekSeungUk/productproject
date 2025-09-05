// generateHash.js
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv'; // .env 파일에서 솔트 라운드 등을 가져올 경우

dotenv.config(); // 환경 변수가 있다면 로드

const plainPassword = '123123'; // 해싱할 비밀번호
const saltRounds = process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10; // .env에서 가져오거나 기본값 10

async function generateHashedPassword() {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        console.log('Plain Password:', plainPassword);
        console.log('Hashed Password:', hashedPassword);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateHashedPassword();