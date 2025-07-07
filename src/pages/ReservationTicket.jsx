import { useState } from "react";
import { REACT_APP_API_SERVER } from "../config/api";

export default function ReservationTicket() {
    const [ticketNumber, setTicketNumber] = useState("");
    const [showTicket, setShowTicket] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [ticketData, setTicketData] = useState(null);

    const validateTicketNumber = (number) => {
        const pattern = /^\d{4}-\d{4}-\d{4}-\d{3}$/;
        return pattern.test(number);
    };

    const handleSearch = async () => {
        setError("");
        
        if (!ticketNumber.trim()) {
            setError("예매번호를 입력해주세요.");
            return;
        }
        
        if (!validateTicketNumber(ticketNumber)) {
            setError("올바른 예매번호 형식이 아닙니다. (예: 0607-1234-5678-910)");
            return;
        }

        setLoading(true);
        
        try {

            const res = await fetch(`${REACT_APP_API_SERVER}/reservation/movie/info?reservationCode=${ticketNumber}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                }
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setTicketData(data);
            }

            setShowTicket(true);
        } catch (error) {
            setError("서버 연결에 실패했거나 없는 예매 번호입니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeypadInput = (value) => {
        setError("");
        
        if (value === "del") {
            setTicketNumber(prev => prev.slice(0, -1));
        } else if (value === "clear") {
            setTicketNumber("");
        } else {
            const newValue = ticketNumber + value
            setTicketNumber(newValue);
        }
    };

    const handleReset = () => {
        setShowTicket(false);
        setTicketNumber("");
        setError("");
        setTicketData(null);
    };

    const keypadLayout = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["-", "0", "del"],
        ["clear"]
    ];

    const seatFormatter = (seatString) => {
        if (!seatString) return '';

        return seatString.split(',').map(seat => {
            const row = seat.charAt(0);
            const number = seat.slice(1);
            return `${row}열 ${number}번`;
        }).join(', ');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = days[date.getDay()];
        return `${dateString.substring(0, 10).replace(/-/g, '.')} (${dayName})`;
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return dateString.substring(11, 16);
    };

    const displayData = ticketData || {
        movieTitle: "아바타: 물의 길",
        movieTitleEn: "Avatar: The Way of Water",
        reservationMoviePosterUrl: "https://via.placeholder.com/200x300/1a365d/ffffff?text=AVATAR",
        cinemaName: "7관 (IMAX)",
        reservedSeats: "E12,E13",
        ratingAge: "12세 이상",
        startShowTime: "2025-06-05 19:30",
        totalAmount: "28,000",
        reservationCode: ticketNumber
    };

    function getRatingBadgeStyle(ratingAge) {
        switch (ratingAge) {
            case '전체관람가':
            case 'ALL':
                return 'bg-green-600 text-white';
            case '12':
            case '12세 이상 관람가':
                return 'bg-yellow-400 text-white';
            case '15':
            case '15세 이상 관람가':
                return 'bg-orange-500 text-white';
            case '18':
            case '청소년 관람불가':
            case '18세':
                return 'bg-red-600 text-white';
            default:
                return 'bg-gray-400 text-white';
        }
    }

    return (
        <div className="px-4">
            <div className="max-w-6xl mx-auto">
                {!showTicket && (
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            예매티켓조회
                        </h1>
                        <p className="text-lg text-gray-600">
                            예매하신 티켓 번호를 입력하여 조회하세요
                        </p>
                    </div>
                )}

                {!showTicket ? (
                    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-3">예매번호</label>
                            <input
                                type="text"
                                value={ticketNumber}
                                onChange={(e) => {
                                    setError("");
                                    setTicketNumber(e.target.value);
                                }}
                                placeholder="0607-1234-5678-910"
                                className="w-full text-xl font-mono bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center focus:border-red-500 focus:outline-none transition-colors"
                                maxLength={17}
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {keypadLayout.flat().map((key, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => handleKeypadInput(key)}
                                    className={`py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
                                        key === "clear" 
                                            ? "col-span-3 bg-gray-200 hover:bg-gray-300 text-gray-700" 
                                            : "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover:shadow-md"
                                    }`}
                                >
                                    {key === "del" ? "←" : key === "clear" ? "전체 지우기" : key}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                                loading 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5"
                            } text-white`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    조회 중...
                                </div>
                            ) : (
                                "티켓 조회하기"
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">

                            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">CGV</h2>
                                    <div className="text-right">
                                        <span className="text-sx font-bold opacity-90">MOVIE TICKET</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="md:flex gap-6 mb-8">
                                    <div className="md:flex-shrink-0 mx-auto md:mx-0 relative">
                                        <div
                                            className={`absolute top-2 right-2 px-2.5 py-1 rounded text-lg font-bold shadow-md ${getRatingBadgeStyle(displayData.ratingAge)}`}
                                        >
                                            {String(displayData.ratingAge).substring(0, 2) == "청소" ? "18" : String(displayData.ratingAge).substring(0, 2)}
                                        </div>
                                        <img 
                                            src={displayData.reservationMoviePosterUrl} 
                                            alt={displayData.movieTitle}
                                            className="md:w-64 max-md:w-full object-cover rounded-lg shadow-md"
                                        />
                                    </div>
                                    
                                    <div>
                                        <div className="text-center md:text-left">
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 max-md:mt-2">
                                                {displayData.movieTitle}
                                            </h3>
                                        </div>

                                        <div className="md:flex gap-4 my-4">
                                            <div className="md:w-64 space-y-4">
                                                <div className="bg-gray-100 rounded-lg p-4">
                                                    <h4 className="font-semibold text-gray-700 mb-3 text-center">상영 정보</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">극장</span>
                                                            <span className="font-semibold text-gray-800">CGV 강남점</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">상영관</span>
                                                            <span className="font-semibold text-gray-800">{displayData.cinemaName}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">좌석</span>
                                                            <span className="font-semibold text-gray-800 md:w-[170px] max-md:w[200px]">{seatFormatter(displayData.reservedSeats)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:w-64 space-y-4">
                                                <div className="bg-gray-100 rounded-lg p-4">
                                                    <h4 className="font-semibold text-gray-700 mb-3 text-center">예매 정보</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">관람일</span>
                                                            <span className="font-semibold text-gray-800">{formatDate(displayData.startShowTime)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">상영시간</span>
                                                            <span className="font-semibold text-gray-800">{formatTime(displayData.startShowTime)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">관람료</span>
                                                            <span className="font-semibold text-red-600 text-lg">{parseInt(displayData.totalAmount).toLocaleString()}원</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-100 to-gray-100 rounded-lg p-4 mb-6">
                                            <div className="text-center">
                                                <span className="text-gray-600 text-sm">예매번호</span>
                                                <div className="font-mono font-bold text-xl text-gray-800 mt-1">
                                                    {displayData.reservationCode || ticketNumber}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="my-6 border-t-2 border-dashed border-gray-300 relative">
                                    <div className="absolute -left-4 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
                                    <div className="absolute -right-4 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="text-center text-sm text-gray-700 space-y-2">
                                        <p className="font-semibold text-yellow-800 flex items-center justify-center">
                                            <span className="text-lg mr-2">⚠️</span>
                                            중요 안내사항
                                        </p>
                                        <div className="text-left max-w-md mx-auto space-y-1">
                                            <p>• 상영시간 10분 전까지 입장해 주시기 바랍니다.</p>
                                            <p>• 티켓 분실 시 재발급이 불가능합니다.</p>
                                            <p>• 상영 시작 후 환불 및 변경이 불가능합니다.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={handleReset}
                                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                            >
                                다시 조회하기
                            </button>
                            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                                티켓 출력하기
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-4 text-gray-500">
                        <div className="w-12 h-px bg-gray-300"></div>
                        <span className="text-sm font-medium">빠르고 안전한 서비스</span>
                        <div className="w-12 h-px bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}