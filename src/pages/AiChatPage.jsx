import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { REACT_APP_API_SERVER } from "../config/api";

// 마크다운 컴포넌트 - react-markdown 사용
const MarkdownContent = memo(({ content }) => {
    return (
        <div className="markdown-content">
            <ReactMarkdown
                components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className="inline-code bg-purple-200/20 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                            {children}
                        </code>
                    );
                },
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>,
                strong: ({ children }) => <strong className="font-bold ">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ href, children }) => (
                    <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 underline hover:text-blue-300 transition-colors"
                    >
                        {children}
                    </a>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside my-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside my-2">{children}</ol>,
                li: ({ children }) => <li className="my-1">{children}</li>,
                p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-400 pl-4 italic my-2">
                        {children}
                    </blockquote>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
        </div>
    );
});

const MessageBubble = memo(({ message, isTyping }) => {
    return (
        <div
            className={`flex items-start gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
        >
            <div className={`p-2 rounded-full ${
                message.type === 'ai' 
                    ? 'bg-white' 
                    : 'bg-white shadow rounded-full'
            }`}>
                {message.type === 'ai' ? (
                    <Bot className="w-5 h-5 text-black" />
                ) : (
                    <User className="w-5 h-5 text-black" />
                )}
            </div>
            <div className={`max-w-xs lg:max-w-2xl ${
                message.type === 'user' ? 'text-right' : ''
            }`}>
                <div className={`p-4 rounded-2xl ${
                    message.type === 'ai'
                        ? 'bg-white/10 backdrop-blur-sm border border-purple-500/20 text-black'
                        : 'bg-white/10 backdrop-blur-sm border border-red-600/20 text-white'
                } shadow-lg`}>
                    {message.type === 'ai' ? (
                        <div className="text-sm leading-relaxed text-black">
                            <MarkdownContent content={message.content} />
                            {message.content === '' && isTyping && (
                                <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1"></span>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm leading-relaxed text-black whitespace-pre-wrap">
                            {message.content}
                        </p>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-1 px-2">
                    {message.timestamp}
                </p>
            </div>
        </div>
    );
});

// 타이핑 인디케이터 컴포넌트
const TypingIndicator = memo(() => (
    <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-white">
            <Bot className="w-5 h-5 text-black" />
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-purple-500/20 p-4 rounded-2xl">
            <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
        </div>
    </div>
));

export default function AiChatPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: '안녕하세요! 저는 AI 어시스턴트입니다. 무엇을 도와드릴까요?',
            timestamp: new Date().toLocaleTimeString()
        }
    ]);

    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const abortControllerRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const aiGenerateMovieTxtVal = useCallback(async () => {
        if (!inputValue.trim() || isTyping) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
            timestamp: new Date().toLocaleTimeString()
        };

        const currentInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await fetch(
                `${REACT_APP_API_SERVER}/ai/chat?q=${encodeURIComponent(currentInput)}`,
                { signal: abortControllerRef.current.signal }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';
            let aiMessageAdded = false;
            const aiMessageId = Date.now() + 1;

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedContent += chunk;

                if (!aiMessageAdded) {
                    const aiMessage = {
                        id: aiMessageId,
                        type: 'ai',
                        content: accumulatedContent,
                        timestamp: new Date().toLocaleTimeString()
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    aiMessageAdded = true;
                } else {
                    setMessages(prev => 
                        prev.map(msg => 
                            msg.id === aiMessageId 
                                ? { ...msg, content: accumulatedContent }
                                : msg
                        )
                    );
                }
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request was cancelled');
                return;
            }
            
            console.error('Error fetching AI response:', error);
            
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: '죄송합니다. 응답을 가져오는 중 오류가 발생했습니다.',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            abortControllerRef.current = null;
        }
    }, [inputValue, isTyping]);

    useEffect(() => {
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, scrollToBottom]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            aiGenerateMovieTxtVal();
        }
    }, [aiGenerateMovieTxtVal]);

    const handleInputChange = useCallback((e) => {
        setInputValue(e.target.value);
    }, []);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">

            <h1 className="text-4xl font-semibold text-center mb-8">영화 추천 AI</h1>

            <main className="flex-1 overflow-y-auto p-4 pb-32">
                <div className="max-w-6xl mx-auto space-y-6">
                    {messages.map((message) => (
                        <MessageBubble 
                            key={message.id} 
                            message={message} 
                            isTyping={isTyping}
                        />
                    ))}

                    {isTyping && (messages.length === 0 || messages[messages.length - 1].type !== 'ai') && (
                        <TypingIndicator />
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="p-4 fixed left-0 right-0 bottom-0 z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="flex gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-purple-500/20">
                        <MessageCircle className="w-6 h-6 mt-1 flex-shrink-0 text-purple-300" />
                        <textarea
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 bg-transparent text-black placeholder-gray-400 resize-none outline-none min-h-[24px] max-h-32"
                            rows={1}
                            disabled={isTyping}
                        />
                        <button
                            onClick={aiGenerateMovieTxtVal}
                            disabled={!inputValue.trim() || isTyping}
                            className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            <Send className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">
                        Enter로 전송 • Shift+Enter로 줄바꿈
                    </p>
                </div>
            </footer>
        </div>
    );
}