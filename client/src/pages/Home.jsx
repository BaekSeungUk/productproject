import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../Context/UserContext";
import Header from "../components/Header"
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import './Home.css';

// .env 파일에서 API URL을 불러옴
const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
    const { isLogin, user, setIsLogin, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const accessToken = () => {
        axios({
            url: `${API_URL}/accesstoken`,
            method: "GET",
            withCredentials: true,
        });
    };

    const logout = () => {
        axios({
            url: `${API_URL}/auth/logout`,
            method: "POST",
            withCredentials: true,
        }).then((result) => {
            if (result.status === 200) {
                window.open("/", "_self");
            }
        });
    };

    useEffect(() => {
        // try {
        //   axios({
        //     url: `${API_URL}/auth/success`,
        //     method: "GET",
        //     withCredentials: true,
        //   })
        //     .then((result) => {
        //       if (result.data) {
        //         setIsLogin(true);
        //         setUser(result.data);
        //       }
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });
        // } catch (error) {
        //   console.log(error);
        // }
    }, []);


    return (
        <>
             <HorizontalScrollSection />
        </>
    );
}

export default Home;