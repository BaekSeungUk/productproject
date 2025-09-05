import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../Context/UserContext";
import Header from "../components/Header"
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import './Home.css';



const Home = () => {
    const { isLogin, user, setIsLogin, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const accessToken = () => {
        axios({
            url: "http://localhost:5000/accesstoken",
            method: "GET",
            withCredentials: true,
        });
    };


    const logout = () => {
        axios({
            url: "http://localhost:5000/auth/logout",
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
        //     url: "http://localhost:5000/auth/success",
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