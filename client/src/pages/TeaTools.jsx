import React, { useEffect, useState } from "react";
import './TeaTools.css'
import axios from "axios";
// .env 파일에서 API URL을 불러옴
const API_URL = import.meta.env.VITE_API_URL;

const TeaTools = () => {
    const [teaTools, setTeaTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // axios를 사용하므로 함수명도 axios 스타일로 변경
        const getTeaTools = async () => {
            try {
                const response = await axios.get(`${API_URL}/tea/tools`, {
                    withCredentials: true
                });
                setTeaTools(response.data.teaTools);
            } catch (err) {
                setError(
                    (err.response && err.response.data && err.response.data.message) ||
                    err.message ||
                    "서버에서 차 도구 정보를 불러오지 못했습니다."
                );
            } finally {
                setLoading(false);
            }
        };
        getTeaTools();
    }, []);

    return (
        <div className="tea-tools-container">
            <h1 className="tea-tools-title">차 도구 소개</h1>
            <p className="tea-tools-description">
                차를 즐기기 위해서는 다양한 도구들이 필요합니다. 각 도구는 차의 맛과 향을 더욱 풍부하게 해주며, 차 문화의 깊이를 더해줍니다.
            </p>
            {loading ? (
                <div style={{textAlign: "center", margin: "40px 0"}}>로딩 중...</div>
            ) : error ? (
                <div style={{color: "red", textAlign: "center", margin: "40px 0"}}>{error}</div>
            ) : (
                <div className="tea-tools-list">
                    {teaTools.map((tool, idx) => (
                        <div key={tool.id || idx} className="tea-tool-card">
                            <img
                                src={tool.image}
                                alt={tool.name}
                                className="tea-tool-image"
                            />
                            <h2 className="tea-tool-name">{tool.name}</h2>
                            <p className="tea-tool-detail">{tool.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeaTools;