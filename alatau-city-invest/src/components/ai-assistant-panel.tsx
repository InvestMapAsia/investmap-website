"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";

type Message = {
  role: "user" | "ai";
  text: string;
};

const AI_HISTORY = "aci_ai_history";

export function AIAssistantPanel() {
  const { lang } = useCurrentLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const t = pickLang(lang, {
    EN: {
      greeting:
        "Hello. I am InvestMap AI assistant. Share your goal and I will shortlist plots by ROI, legal profile and risk.",
      tempError: "Temporary AI error. Please try again or contact support.",
      thinking: "Thinking...",
      placeholder: "For example: show medium-risk plots under 600k",
      send: "Send",
      quickPrompts: "Quick prompts",
      promptRoi: "Show top ROI plots",
      promptRisk: "Find lower-risk options",
      promptLogistics: "Which plots fit logistics strategy?",
      promptOwner: "How can an owner add land to platform?",
      aiNotice:
        "AI answers are advisory only. Final decisions require legal and financial due diligence.",
      openCatalog: "Open catalog",
      startApplication: "Start application",
    },
    RU: {
      greeting:
        "Здравствуйте. Я AI-ассистент InvestMap. Опишите цель, и я подберу участки по ROI, юридическому профилю и риску.",
      tempError: "Временная ошибка AI. Попробуйте снова или обратитесь в поддержку.",
      thinking: "AI анализирует...",
      placeholder: "Например: покажи участки со средним риском до 600k",
      send: "Отправить",
      quickPrompts: "Быстрые запросы",
      promptRoi: "Покажи участки с лучшим ROI",
      promptRisk: "Найди варианты с меньшим риском",
      promptLogistics: "Какие участки подходят под логистику?",
      promptOwner: "Как собственнику добавить землю на платформу?",
      aiNotice:
        "Ответы AI носят рекомендательный характер. Финальные решения требуют юридической и финансовой проверки.",
      openCatalog: "Открыть каталог",
      startApplication: "Начать заявку",
    },
    KZ: {
      greeting:
        "Сәлеметсіз бе. Мен InvestMap AI-ассистентімін. Мақсатыңызды айтыңыз, мен ROI, заң профилі және тәуекел бойынша учаскелерді ұсынамын.",
      tempError: "AI уақытша қатесі. Қайта көріңіз немесе қолдауға жазыңыз.",
      thinking: "AI талдап жатыр...",
      placeholder: "Мысалы: тәуекелі орташа, бағасы 600k дейінгі учаскелерді көрсет",
      send: "Жіберу",
      quickPrompts: "Жылдам сұраулар",
      promptRoi: "ROI жоғары учаскелерді көрсет",
      promptRisk: "Тәуекелі төмен нұсқаларды тап",
      promptLogistics: "Логистика стратегиясына қай учаскелер сай?",
      promptOwner: "Жер иесі платформға жерді қалай қоса алады?",
      aiNotice:
        "AI жауаптары кеңес ретінде ғана беріледі. Соңғы шешім үшін заңдық және қаржылық тексеріс қажет.",
      openCatalog: "Каталогты ашу",
      startApplication: "Өтінімді бастау",
    },
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(AI_HISTORY) ?? "[]") as Message[];
    if (saved.length) {
      setMessages(saved);
    } else {
      setMessages([{ role: "ai", text: t.greeting }]);
    }
  }, [t.greeting]);

  useEffect(() => {
    localStorage.setItem(AI_HISTORY, JSON.stringify(messages));
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendPrompt = async (prompt: string) => {
    const clean = prompt.trim();
    if (!clean) return;

    setMessages((prev) => [...prev, { role: "user", text: clean }]);
    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: clean }),
    });

    setLoading(false);

    if (!res.ok) {
      setMessages((prev) => [...prev, { role: "ai", text: t.tempError }]);
      return;
    }

    const payload = (await res.json()) as { data: { answer: string } };
    setMessages((prev) => [...prev, { role: "ai", text: payload.data.answer }]);
  };

  const quickPrompts = [t.promptRoi, t.promptRisk, t.promptLogistics, t.promptOwner];

  return (
    <section className="split">
      <div>
        <div className="chat" ref={chatRef}>
          {messages.map((message, index) => (
            <div className={`bubble ${message.role}`} key={`${message.role}-${index}`}>
              {message.text}
            </div>
          ))}
          {loading ? <div className="bubble ai">{t.thinking}</div> : null}
        </div>

        <div className="plot-actions" style={{ marginTop: 10 }}>
          <input
            style={{
              flex: 1,
              minWidth: 220,
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "11px 12px",
            }}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void sendPrompt(input);
                setInput("");
              }
            }}
            placeholder={t.placeholder}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              void sendPrompt(input);
              setInput("");
            }}
          >
            {t.send}
          </button>
        </div>
      </div>

      <aside className="card">
        <h3 className="card-title">{t.quickPrompts}</h3>
        <div className="quick-prompts">
          {quickPrompts.map((prompt) => (
            <button
              className="btn btn-ghost"
              key={prompt}
              onClick={() => void sendPrompt(prompt)}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="notice" style={{ marginTop: 14 }}>
          {t.aiNotice}
        </div>
        <div className="plot-actions" style={{ marginTop: 12 }}>
          <Link href="/catalog" className="btn btn-accent">
            {t.openCatalog}
          </Link>
          <Link href="/invest" className="btn btn-ghost">
            {t.startApplication}
          </Link>
        </div>
      </aside>
    </section>
  );
}
