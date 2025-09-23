
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Section from './components/Section';
import FeatureCard from './components/FeatureCard';
import ActionButton from './components/ActionButton';
import { 
  CONSULTANT_QR_CODE_URL, 
  CONSULTANT_QR_LINK_URL, 
  CONTACT_INFO, 
} from './constants';
import { 
  FaceSmileIcon, 
  QuestionMarkCircleIcon, 
  CheckCircleIcon, 
  LightBulbIcon, 
  SparklesIcon, 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  ChevronDoubleRightIcon,
  PaperAirplaneIcon
} from './components/IconComponents';

// Gemini AI Imports
import { GoogleGenAI, Content } from "@google/genai";

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const AI_PERSONAS = {
  professionalConsultant: {
    name: '专业顾问',
    systemInstruction: `你是一位专业的医美咨询AI助手，专门负责解答关于“馒化脸”（面部过度填充综合征）的问题。你的回答应遵循以下准则：
1. **专业与同理心**: 你的语气应始终保持专业、权威，同时富有同理心和耐心，像一位资深的医美顾问。
2. **知识范围**: 你的知识涵盖“馒化脸”的成因、表现、潜在风险、预防方法以及常见的修复技术方向（例如：溶解酶、光电治疗、自体脂肪优化等）。
3. **严守界限**: **严禁提供任何具体的医疗建议、诊断或治疗方案。** 你的核心职责是提供科普信息和初步咨询。
4. **引导咨询**: 当用户问题涉及个人具体情况时，或在对话结束时，应温和地引导用户预约线下专业面诊。例如可以这样说：“为了给您提供最适合您的个性化建议，我强烈建议您预约一次与我们专业医师的线下咨询。只有通过面诊，医生才能对您的具体情况做出准确评估。”
5. **简洁明了**: 回答要清晰、简洁，避免使用过于复杂的医学术语。
6. **语言**: 请全程使用中文进行回复。`,
  },
  technicalExpert: {
    name: '技术专家',
    systemInstruction: `你是一位高度技术性的医美分析AI。专注于“馒化脸”（面部过度填充综合征）的科学和临床方面。使用精确的医学术语（但如有必要请简要解释）。解释治疗方法（如透明质酸酶、射频、超声波）的作用机制。你的语气是客观、数据驱动和临床的。避免过度情绪化或共情的语言。你的目标是就技术细节对用户进行教育。严禁提供具体的医疗建议或诊断。请全程使用中文进行回复。`,
  },
  friendlyAdvisor: {
    name: '亲切伙伴',
    systemInstruction: `你是一位温暖、友好、令人安心的医美伙伴。你正在与一个可能对自己的外表感到担忧或自觉的人交谈。使用简单、易于理解的语言。你的语气充满同理心和支持。鼓励用户并提供寻求专业帮助的通用建议。像一个在该领域有一定知识的贴心朋友一样构建你的回答。始终温和地引导他们为任何个人问题咨询真正的医生。请全程使用中文进行回复。`,
  },
};

type PersonaKey = keyof typeof AI_PERSONAS;


const LoadingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-2">
    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '-0.3s' }}></span>
    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '-0.15s' }}></span>
    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
  </div>
);

const CHAT_HISTORY_KEY = 'ai-puffy-face-chat-history';

const getInitialMessages = (): ChatMessage[] => {
  try {
    const savedChat = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedChat && savedChat !== '[]') {
      const parsedMessages = JSON.parse(savedChat);
      if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
        return parsedMessages;
      }
    }
  } catch (error) {
    console.error("Failed to load or parse chat history from localStorage:", error);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  }
  return [{ 
    id: 'initial-welcome', 
    sender: 'ai', 
    text: '您好！我是您的AI美学助手，可以回答您关于“馒化脸”的相关问题。请问有什么可以帮您？' 
  }];
};


const App: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-us');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [userInput, setUserInput] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [currentPersona, setCurrentPersona] = useState<PersonaKey>('professionalConsultant');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const API_KEY = process.env.API_KEY;

  const aiClient = useMemo(() => {
    if (!API_KEY) {
      console.warn("API_KEY environment variable is not set. AI Chat functionality will be disabled.");
      return null;
    }
    try {
      return new GoogleGenAI({ apiKey: API_KEY });
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI:", error);
      setAiError("AI服务初始化失败。请检查控制台获取更多信息。");
      return null;
    }
  }, [API_KEY]);

  useEffect(() => {
    if (!API_KEY) {
        setAiError("AI 服务当前不可用：API密钥未配置。请联系管理员。");
    }
  }, [API_KEY]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatMessages));
    } catch (error) {
      console.error("Failed to save chat history to localStorage:", error);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isLoadingAI) return;

    if (!aiClient) {
      setAiError("AI服务未初始化或配置错误，无法发送消息。");
      return;
    }

    const newUserMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: userInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoadingAI(true);
    setAiError(null);

    const conversationHistoryForAPI: Content[] = [
        ...chatMessages.map(msg => ({
            role: msg.sender === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }],
        })),
        {
            role: 'user',
            parts: [{text: newUserMessage.text}]
        }
    ];
    
    // Add a placeholder for AI's response to enable streaming display
    const aiMessageId = (Date.now() + 1).toString();
    setChatMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

    try {
      const stream = await aiClient.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: conversationHistoryForAPI,
        config: {
          systemInstruction: AI_PERSONAS[currentPersona].systemInstruction,
        }
      });

      let currentAiResponse = "";
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          currentAiResponse += chunkText;
          setChatMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: currentAiResponse } : msg
          ));
        }
      }
      if (currentAiResponse === "") { // Handle cases where stream might end without text
        setChatMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: "抱歉，我暂时无法回答这个问题。" } : msg
          ));
      }

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      let errorMessage = 'AI服务暂时遇到问题，请稍后再试。';
      if (error instanceof Error) {
        errorMessage += ` 详情: ${error.message}`;
      }
      setAiError(errorMessage);
      setChatMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, text: `抱歉，处理您的请求时发生错误。` } : msg
      ));
    } finally {
      setIsLoadingAI(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-neutral-light font-light text-neutral-dark tracking-wider leading-relaxed">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <Section id="hero" className="bg-gradient-to-br from-light-camel via-stone-50 to-violet-100 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-dark mb-6 tracking-widest">
              告别<span className="text-brand-primary font-normal">馒化脸</span>，重塑精致轮廓
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed tracking-wide">
              免费AI咨询与个性化修复方案预约，让科技与美学为您焕发自然光彩。
            </p>
            <ActionButton text="立即咨询" onClick={scrollToContact} icon={<ChevronDoubleRightIcon className="w-5 h-5" />} />
          </div>
        </Section>

        {/* What is Puffy Face Section */}
        <Section id="what-is" title="什么是“馒化脸”？" subtitle="了解面部过度填充综合征 (FOS) 及其影响">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<QuestionMarkCircleIcon />}
              title="定义与表现"
              description="“馒化脸”，即面部过度填充综合征，指因过量或不当注射填充剂导致面部肿胀、僵硬、不自然的现象。"
            />
            <FeatureCard
              icon={<LightBulbIcon />}
              title="常见成因"
              description="主要原因包括填充剂选择不当、注射层次错误、单次注射量过多或短期内频繁注射等。"
            />
            <FeatureCard
              icon={<FaceSmileIcon />}
              title="对美观与健康的影响"
              description="不仅影响面部美观，可能导致表情僵硬、组织纤维化，甚至引发更严重的并发症。"
            />
          </div>
        </Section>

        {/* Our Solution Section */}
        <Section id="solution" title="我们的修复之道" subtitle="专业、个性化、安全的“馒化脸”修复方案" className="bg-amber-50">
           <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-medium text-neutral-dark tracking-wide">精准评估，科学修复</h3>
              <p className="text-gray-700 leading-relaxed">
                我们采用先进的AI辅助面部分析技术，结合资深专家面诊，精准评估您的情况。针对不同程度的“馒化脸”，提供个性化的修复方案，可能包括酶解、光电治疗、自体脂肪移植优化等，旨在恢复面部自然和谐之美。
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-6 h-6 text-accent-mint mr-3" />
                  个性化治疗计划
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-6 h-6 text-accent-mint mr-3" />
                  注重自然和谐效果
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-6 h-6 text-accent-mint mr-3" />
                  安全为首，专业操作
                </li>
              </ul>
            </div>
            <div>
              <img src="https://picsum.photos/seed/beautysolution/600/400" alt="面部修复过程示意" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </Section>
        
        {/* Why Choose Us Section */}
        <Section id="why-us" title="为何选择我们？" subtitle="专业团队，先进技术，贴心服务，值得信赖">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<SparklesIcon />}
              title="顶尖专家团队"
              description="拥有经验丰富的医美专家团队，对面部解剖学和美学有深刻理解，确保修复方案科学有效。"
            />
            <FeatureCard
              icon={<CheckCircleIcon />}
              title="AI智能辅助"
              description="引入AI智能面部分析系统，辅助医生进行更精准的诊断和方案设计，提升修复效果的预见性。"
            />
            <FeatureCard
              icon={<FaceSmileIcon />}
              title="患者至上"
              description="秉承患者至上的服务理念，提供一对一私密咨询，全程关怀，确保舒适安心的就诊体验。"
            />
          </div>
           <div className="text-center mt-12">
             <ActionButton text="了解更多优势" onClick={scrollToContact} />
           </div>
        </Section>

        {/* AI Chat Section */}
        <Section id="ai-chat" title="AI智能咨询" subtitle="向我们的AI助手提问关于“馒化脸”的任何问题。" className="bg-violet-50">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <label htmlFor="persona-select" className="block text-sm font-medium text-gray-700 mb-1">选择AI角色:</label>
              <select
                id="persona-select"
                value={currentPersona}
                onChange={(e) => setCurrentPersona(e.target.value as PersonaKey)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-shadow"
                aria-label="选择AI对话角色"
              >
                {Object.entries(AI_PERSONAS).map(([key, persona]) => (
                  <option key={key} value={key}>
                    {persona.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div ref={chatContainerRef} className="h-96 overflow-y-auto mb-4 p-4 border border-neutral-medium rounded-md space-y-4 bg-neutral-light">
                {chatMessages.map((msg) => {
                   const isLastMessageLoading = isLoadingAI && msg.id === chatMessages[chatMessages.length - 1]?.id;
                   return (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                        msg.sender === 'user' 
                          ? 'bg-brand-primary text-white' 
                          : 'bg-neutral-medium text-neutral-dark'
                      }`}>
                        {isLastMessageLoading && !msg.text ? (
                          <LoadingIndicator />
                        ) : (
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="输入您的问题..."
                  className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-shadow"
                  disabled={isLoadingAI || !aiClient}
                  aria-label="咨询问题输入框"
                />
                <button
                  type="submit"
                  className="p-3 bg-brand-primary text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 transition-colors"
                  disabled={isLoadingAI || !userInput.trim() || !aiClient}
                  aria-label="发送消息"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
              {aiError && (
                <p className="text-accent-rose text-sm mt-2 text-center" role="alert">{aiError}</p>
              )}
              {!aiClient && !API_KEY && (
                   <p className="text-accent-rose text-sm mt-2 text-center" role="alert">AI服务当前不可用：API密钥未配置。请联系管理员。</p>
              )}
            </div>
          </div>
        </Section>

        {/* Consultant QR Code Section */}
        <Section id="consultant-qr" title="专属福利与咨询通道" subtitle="扫描下方二维码添加福利官，获取最新优惠活动与一对一专业咨询服务。" className="bg-neutral-light">
          <div className="flex flex-col items-center">
            <a href={CONSULTANT_QR_LINK_URL} target="_blank" rel="noopener noreferrer" className="mb-4 inline-block">
              <img 
                src={CONSULTANT_QR_CODE_URL} 
                alt="福利官企业微信二维码" 
                className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              />
            </a>
            <p className="text-gray-600 text-center">点击二维码或扫描添加</p>
          </div>
        </Section>

        {/* References Section - Placeholder */}
        <Section id="references" title="科普参考与延伸阅读" subtitle="探索更多关于面部美学与健康修复的专业知识" className="bg-amber-50">
           <div className="max-w-2xl mx-auto text-center text-gray-700 space-y-4">
            <p>我们致力于提供基于科学实证的医美服务。未来将在此分享更多专业文章与研究成果，敬请期待。</p>
            <ul className="list-disc list-inside text-left space-y-2 inline-block">
                <li><span className="italic">《面部填充并发症的识别与处理》</span> - 即将上线</li>
                <li><span className="italic">《AI在个性化医美方案设计中的应用》</span> - 即将上线</li>
                <li><span className="italic">《如何科学抗衰，避免“馒化”风险》</span> - 即将上线</li>
            </ul>
           </div>
        </Section>

        {/* Contact Us Section */}
        <Section id="contact-us" title="联系我们 & 预约咨询" subtitle="我们在这里，随时准备为您提供专业的帮助与服务。" className="bg-light-camel">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-6 bg-white p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-medium text-neutral-dark tracking-wide">重庆联合丽格科技有限公司</h3>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-6 h-6 text-brand-primary mt-1 flex-shrink-0" />
                <p className="text-gray-700">{CONTACT_INFO.address}</p>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-brand-primary hover:text-purple-700 transition-colors duration-300">{CONTACT_INFO.email}</a>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-brand-primary hover:text-purple-700 transition-colors duration-300">{CONTACT_INFO.phone}</a>
              </div>
               <p className="text-sm text-gray-500 pt-4">欢迎致电或邮件咨询，我们的专业团队将竭诚为您服务。</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h3 className="text-2xl font-medium text-neutral-dark mb-6 tracking-wide">发送您的咨询请求</h3>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">姓名</label>
                        <input type="text" name="name" id="name" autoComplete="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="您的称呼"/>
                    </div>
                    <div>
                        <label htmlFor="phone_contact" className="block text-sm font-medium text-gray-700">联系电话</label>
                        <input type="tel" name="phone_contact" id="phone_contact" autoComplete="tel" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="方便我们联系您"/>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">咨询内容</label>
                        <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="请简要描述您的问题或需求"></textarea>
                    </div>
                    <div>
                        <ActionButton text="提交咨询" className="w-full" onClick={(e?: React.MouseEvent<HTMLButtonElement>) => { if(e) e.preventDefault(); alert('咨询已提交（演示功能）。我们将尽快与您联系！');}} />
                    </div>
                </form>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
