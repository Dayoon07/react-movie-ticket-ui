import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { REACT_APP_API_SERVER } from "../config/api";

export default function Refund() {
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

            const res = await fetch(`${REACT_APP_API_SERVER}/reservation/movie/info?reservationCode=${ticketNumber}`);

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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
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
        movieTitle: "값이 없습니다.",
        movieTitleEn: "값이 없습니다.",
        reservationMoviePosterUrl: "값이 없습니다.",
        cinemaName: "값이 없습니다.",
        reservedSeats: "값이 없습니다.",
        ratingAge: "값이 없습니다.",
        startShowTime: "값이 없습니다.",
        totalAmount: "값이 없습니다.",
        reservationCode: ticketNumber || "값이 없습니다."
    };

    // 하민 - 환불 요청, 기능 만듬
    const removeReservedMovieTicket = async () => {
        console.log(ticketData);

        try {
            const res = await fetch(`
                ${REACT_APP_API_SERVER}/reservation/del/movie?reservationCode=${ticketData.reservationCode}
            `, {
                method: "post",
            });
            
            if (res.ok) {
                const data = await res.text();
                console.log(data);
                alert(data);
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        환불 티켓 조회
                    </h1>
                    <p className="text-lg text-gray-600">
                        예매하신 티켓 번호를 입력하여 조회하세요
                    </p>
                </div>

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
                                onKeyPress={handleKeyPress}
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
                    <div className="flex items-center justify-center px-4">
                        <div className="bg-white border border-red-300 p-8 rounded-2xl shadow-xl w-full max-w-3xl">
                            <h1 className="text-4xl font-extrabold text-center text-red-600 mb-4">
                                💸 환불 정보
                            </h1>

                            <p className="text-center text-lg text-gray-700 mb-6">
                                환불하신 티켓 정보를 확인해 주세요.
                            </p>

                            <div className="flex items-start bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md mb-6">
                                <AlertCircle className="w-6 h-6 mr-2 mt-1" />
                                <div>
                                    <p className="font-semibold">중요 안내사항</p>
                                    <ul className="list-disc list-inside text-sm mt-1">
                                        <li>환불은 상영 시작 전까지만 가능합니다</li>
                                        <li>환불 처리에는 영업일 기준 3~5일이 소요될 수 있습니다</li>
                                        <li>결제 수단에 따라 환불 방식이 다를 수 있습니다</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8 text-base space-y-2">
                                <div><span className="font-semibold">🎬 영화:</span> {displayData.movieTitle}</div>
                                <div><span className="font-semibold">🏢 상영관:</span> {displayData.cinemaName}</div>
                                <div><span className="font-semibold">🕒 원래 상영 시간:</span> {formatDate(displayData.startShowTime)} {formatTime(displayData.startShowTime)}</div>
                                <div><span className="font-semibold">💺 좌석:</span> {seatFormatter(displayData.reservedSeats)}</div>
                                <div><span className="font-semibold">💰 환불 금액:</span> {parseInt(displayData.totalAmount).toLocaleString()}원</div>
                                <div><span className="font-semibold">🎫 예매번호:</span> {displayData.reservationCode || ticketNumber}</div>
                                <div><span className="font-semibold">🔞 관람등급:</span> {displayData.ratingAge}</div>
                            </div>

                            <div className="flex justify-center gap-6">
                                <button 
                                    onClick={handleReset}
                                    className="bg-gray-300 hover:bg-gray-400 text-xl px-6 py-3 rounded-lg font-semibold transition-all"
                                >
                                    다시 조회하기
                                </button>
                                <button 
                                    onClick={removeReservedMovieTicket}
                                    className="bg-red-500 hover:bg-red-600 text-white text-xl px-6 py-3 rounded-lg font-semibold transition-all"
                                >
                                    환불
                                </button>
                            </div>
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
