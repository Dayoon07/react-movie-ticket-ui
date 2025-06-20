import React, { use, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { REACT_APP_API_SERVER } from "../config/api";

export default function MovieList() {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [peopleCount, setPeopleCount] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [moviePrice, setMoviePrice] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMovies() {
            try {
                const res = await fetch(`${REACT_APP_API_SERVER}/movie/all`);
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    setMovies(data);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }

        fetchMovies();
    }, []);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        setPeopleCount(1);
        setMoviePrice(movie.price || 0); // 영화 가격 설정
        setShowModal(true);
    };

    const handlePeopleSelect = () => {
        setShowModal(false);
        navigate('/seat-select', {
            state: {
                movie: selectedMovie,
                people: peopleCount,
                price: moviePrice
            },
        });
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
        <div className="px-8">
            <h1 className="text-4xl font-semibold text-center mb-8">티켓구매</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {movies.map((movie) => (
                    <div
                        key={`${movie.movieId}-${movie.movieTitle}-${movie.startTime}`}
                        className="relative overflow-hidden hover:shadow-xl duration-300 cursor-pointer bg-white"
                        onClick={() => handleMovieClick(movie)}
                    >
                        <div
                            className={`absolute top-2 right-2 px-2.5 py-1 rounded text-lg font-bold shadow-md ${getRatingBadgeStyle(movie.ratingAge)}`}
                        >
                            {String(movie.ratingAge).substring(0, 2) == "청소" ? "18" : String(movie.ratingAge).substring(0, 2)}
                        </div>

                        <img
                            src={movie.posterImageUrl}
                            alt={movie.movieTitle}
                            className="w-full object-cover rounded-lg"
                        />
                        <div className="p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl text-blue-600 font-semibold">
                                    {movie.startTime &&
                                        new Date(movie.startTime).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900">{movie.movieTitle}</h2>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-600">상영관 : {movie.cinemaName}</span>
                                <span className="text-sm text-gray-600">좌석수 {movie.availableSeats}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && selectedMovie && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-8 animate-fadeIn relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-1 right-3 text-gray-500 hover:text-red-500 text-4xl font-bold"
                            aria-label="닫기"
                        >
                            &times;
                        </button>

                        <div className="flex flex-col items-center mb-5 text-center">
                            <img src={selectedMovie.posterImageUrl} alt={selectedMovie.movieTitle} className="w-80 object-cover rounded-lg mb-3" />
                            <h2 className="text-2xl font-bold text-gray-800">{selectedMovie.movieTitle}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500">{selectedMovie.ratingAge}</span>
                                <span className="text-sm text-gray-500">| {selectedMovie.genre}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                                {selectedMovie.startTime && (
                                    <>시작: {new Date(selectedMovie.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 mb-6">
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setPeopleCount((prev) => Math.max(1, prev - 1))}
                                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold"
                                >
                                    -
                                </button>
                                <span className="text-xl font-semibold text-gray-800">{peopleCount}</span>
                                <button
                                    onClick={() => setPeopleCount((prev) => Math.min(8, prev + 1))}
                                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handlePeopleSelect}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            좌석 선택하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}