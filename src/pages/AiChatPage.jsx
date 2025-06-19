import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react';

// 마크다운 파싱 함수 - 메모이제이션을 위해 컴포넌트 외부로 이동
const parseMarkdown = (text) => {
    if (!text) return '';
    
    return text
        .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="link">$1</a>')
        .replace(/\n/g, '<br/>');
};

// 마크다운 렌더링 컴포넌트 - memo로 최적화
const MarkdownContent = memo(({ content }) => {
    const parsedContent = useMemo(() => parseMarkdown(content), [content]);
    
    return (
        <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
        />
    );
});

// 메시지 컴포넌트 - memo로 최적화
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
        <div className="p-2 rounded-full">
            <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="border border-purple-500/20 p-4 rounded-2xl">
            <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
        </div>
    </div>
));

// CSS 스타일 상수
const MARKDOWN_STYLES = `
.markdown-content h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1rem 0 0.5rem 0;
    color: #e0e7ff;
}
.markdown-content h2 {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0.875rem 0 0.5rem 0;
    color: #e0e7ff;
}
.markdown-content h3 {
    font-size: 1.125rem;
    font-weight: bold;
    margin: 0.75rem 0 0.5rem 0;
    color: #e0e7ff;
}
.markdown-content strong {
    font-weight: bold;
    color: #fbbf24;
}
.markdown-content em {
    font-style: italic;
    color: #a78bfa;
}
.markdown-content code.inline-code {
    background: rgba(139, 92, 246, 0.2);
    color: #c4b5fd;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
}
.markdown-content pre {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 0.5rem 0;
    overflow-x: auto;
}
.markdown-content pre code {
    color: #e0e7ff;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
}
.markdown-content ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}
.markdown-content li {
    margin: 0.25rem 0;
    color: #e0e7ff;
    list-style-type: disc;
}
.markdown-content a.link {
    color: #60a5fa;
    text-decoration: underline;
    transition: color 0.2s;
}
.markdown-content a.link:hover {
    color: #3b82f6;
}
.markdown-content br {
    display: block;
    margin: 0.25rem 0;
}
`;

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

    // 스크롤 최적화 - useCallback 사용
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // 메시지 전송 함수 최적화
    const aiGenerateMovieTxtVal = useCallback(async () => {
        if (!inputValue.trim() || isTyping) return;

        // 이전 요청 취소
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

        // AI 응답 메시지 미리 생성
        const aiMessageId = Date.now() + 1;
        const aiMessage = {
            id: aiMessageId,
            type: 'ai',
            content: '',
            timestamp: new Date().toLocaleTimeString()
        };

        // 상태 업데이트 배치화
        setMessages(prev => [...prev, userMessage, aiMessage]);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_SERVER}/ai/chat?q=${encodeURIComponent(currentInput)}`,
                { signal: abortControllerRef.current.signal }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedContent += chunk;

                // 상태 업데이트 최적화 - 함수형 업데이트 사용
                setMessages(prev => 
                    prev.map(msg => 
                        msg.id === aiMessageId 
                            ? { ...msg, content: accumulatedContent }
                            : msg
                    )
                );
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request was cancelled');
                return;
            }
            
            console.error('Error fetching AI response:', error);
            
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === aiMessageId 
                        ? { ...msg, content: '죄송합니다. 응답을 가져오는 중 오류가 발생했습니다.' }
                        : msg
                )
            );
        } finally {
            setIsTyping(false);
            abortControllerRef.current = null;
        }
    }, [inputValue, isTyping]);

    // 스크롤 효과 최적화
    useEffect(() => {
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, scrollToBottom]);

    // 키보드 이벤트 핸들러 최적화
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            aiGenerateMovieTxtVal();
        }
    }, [aiGenerateMovieTxtVal]);

    // 입력값 변경 핸들러 최적화
    const handleInputChange = useCallback((e) => {
        setInputValue(e.target.value);
    }, []);

    // 컴포넌트 언마운트 시 요청 취소
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // 타이핑 인디케이터 표시 조건 메모이제이션
    const shouldShowTypingIndicator = useMemo(() => {
        return isTyping && messages.length > 1 && messages[messages.length - 1].content === '';
    }, [isTyping, messages]);

    return (
        <div className="flex flex-col min-h-screen">
            <style>{MARKDOWN_STYLES}</style>
            
            {/* <header className="border-b border-purple-500/20 p-4 bg-black/20 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">AI 영화 추천</h1>
                        <p className="text-purple-300 text-sm">지능형 대화 어시스턴트</p>
                    </div>
                </div>
            </header> */}

            {/* 메시지 영역 */}
            <main className="flex-1 overflow-y-auto p-4 pb-32">
                <div className="max-w-6xl mx-auto space-y-6">
                    {messages.map((message) => (
                        <MessageBubble 
                            key={message.id} 
                            message={message} 
                            isTyping={isTyping}
                        />
                    ))}

                    {shouldShowTypingIndicator && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* 입력 영역 */}
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