import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { REACT_APP_API_SERVER } from "../config/api";

export default function HomePage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);

    const services = [
        { title: "티켓 구매", img: "🎫", loc: "/movie-list" },
        { title: "예매티켓출력", img: "🧾", loc: "/reservation-ticket-print" },
        { title: "환불", img: "🔄", loc: "/refund" },
        { title: "영화 추천 AI", img: "🔍", loc: "/ai/chat" }
    ];

    const btnStyle = "mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:from-blue-600 hover:to-indigo-700";

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError('');

        try {
            const response = await fetch(`${REACT_APP_API_SERVER}/user/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: loginForm.phone,
                    password: loginForm.password
                })
            });

            if (response.ok) {
                const userData = await response.json();

                if (!userData || !userData.name) {
                    setLoginError('로그인에 실패했습니다. 사용자명 또는 비밀번호를 확인해주세요.');
                    return;
                }

                localStorage.setItem('user', JSON.stringify(userData));
                console.log(userData);
                console.log(userData.userId);
                setUser(userData);
                setIsLoggedIn(true);
                setLoginForm({ phone: '', password: '' });
            } else {
                const errorData = await response.json().catch(() => ({}));
                setLoginError(errorData.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('서버와 연결할 수 없습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
        setLoginForm({ phone: '', password: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
        setLoginError('');
    };

    if (!isLoggedIn) {
        // min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100
        return (
            <div className="flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            {/* <div className="text-6xl mb-4">🎫</div> */}
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">로그인</h1>
                            <p className="text-gray-600">서비스 이용을 위해 로그인해주세요</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">사용자명 (휴대폰 번호)</label>
                                <input type="text" id="phone" name="phone" value={loginForm.phone} onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="사용자명을 입력하세요" disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                                <input type="password" id="password" name="password" value={loginForm.password} onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="비밀번호를 입력하세요" disabled={isLoading}
                                />
                            </div>

                            {loginError && (
                                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{loginError}</div>
                            )}

                            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 
                                text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none 
                                focus:ring-2 focus:ring-blue-500"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        로그인 중...
                                    </div>
                                ) : '로그인'}
                            </button>
                        </form>

                        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-xs text-blue-700 space-y-1">
                            <div>• 사용자명과 비밀번호를 정확히 입력해주세요</div>
                            <div>• 계정이 없으시면 관리자에게 문의하세요</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">무엇을 하고싶으세요?</h2>
                    <p className="text-lg text-gray-600">원하는 서비스를 선택해 주세요</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((v, i) => (
                        <div key={i} onClick={() => navigate(v.loc)} className="group bg-white rounded-2xl shadow-lg 
                            hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center cursor-pointer border border-gray-100"
                        >
                            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">{v.img}</div>
                            <h3 className="text-3xl font-semibold text-gray-800 mb-4">{v.title}</h3>
                            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <button className={btnStyle}>시작하기</button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-4 text-gray-500">
                        <div className="w-8 h-px bg-gray-300"></div>
                        <span className="text-sm">빠르고 안전한 서비스</span>
                        <div className="w-8 h-px bg-gray-300"></div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        {/* <h1 className="text-2xl font-bold text-gray-800">안녕하세요, {user?.name}님! 👋</h1>
                        <p className="text-gray-600">어떤 서비스를 이용하시겠어요?</p>
                        {user?.phone && <p className="text-sm text-gray-500">({user.phone})</p>} */}
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200">
                        로그아웃
                    </button>
                </div>
            </div>
        </>
    );
}
