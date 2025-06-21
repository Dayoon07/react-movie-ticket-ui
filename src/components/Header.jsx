import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
    const [currentTime, setCurrentTime] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}:${seconds}`);
        };

        updateTime();
        
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    function getDayOfWeek(date) {
        const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
        return daysOfWeek[date.getDay()];
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    const today = new Date();
    const todayDateString = formatDate(today);
    const todayDay = getDayOfWeek(today);
    const isHomePage = location.pathname === "/";

    return (
        <div className="flex justify-between items-center px-4 pt-4 max-lg:pb-8">
            <div className="flex items-center lg:space-x-6 max-lg:space-x-2">
                <div className="flex items-center lg:space-x-3">
                    {!isHomePage && (
                        <button onClick={() => navigate(-1)} title="뒤로 가기" className="lg:h-[60px] max-lg:h-[45px]">
                            <img src="/static/img/arrow-img.jpg" alt="..." className="lg:w-[60px] lg:h-[45px] max-lg:w-[45px] max-lg:h-[30px]" />
                        </button>
                    )}
                    <h2 className="text-6xl font-semibold text-red-500 font-mono cursor-pointer max-lg:text-4xl" 
                        onClick={
                            () => {navigate("/")}
                        }
                    >
                        CGV
                    </h2>
                </div>
                <p className="font-semibold text-2xl lg:mt-1 max-lg:text-xl">안양시 범계점</p>
            </div>
            <div className="lg:flex items-center justify-between space-x-6">
                <p className="text-2xl max-lg:text-lg lg:mt-1 max-lg:text-right">{todayDateString} ({todayDay})</p>
                <p className="text-4xl max-lg:text-xl max-lg:text-right">{currentTime}</p>
            </div>
        </div>
    );
}