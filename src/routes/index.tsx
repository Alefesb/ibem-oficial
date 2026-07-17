import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IBEM — Igreja Batista Evangelho e Missões" },
      {
        name: "description",
        content:
          "Igreja Batista Evangelho e Missões (IBEM): cultos, eventos, liderança pastoral e ferramenta de leitura bíblica online.",
      },
      { property: "og:title", content: "IBEM — Igreja Batista Evangelho e Missões" },
      {
        property: "og:description",
        content: "Cultos, eventos e comunhão. Venha visitar-nos.",
      },
    ],
    links: [{ rel: "stylesheet", href: "/church.css" }],
  }),
  component: Home,
});

const upcomingEvents = [
  { d: "12", m: "Jan", title: "Culto de Ano Novo", desc: "Celebração especial de gratidão e consagração para 2027.", meta: "Domingo · 18h" },
  { d: "25", m: "Jan", title: "Conferência de Missões", desc: "Três noites com pregadores convidados e ofertas missionárias.", meta: "25 a 27 · 19h30" },
  { d: "08", m: "Fev", title: "Retiro da Família", desc: "Fim de semana de comunhão, ensino e lazer para toda a família.", meta: "Sáb e Dom · integral" },
  { d: "22", m: "Fev", title: "Batismo nas Águas", desc: "Culto especial de batismo. Inscreva-se com a liderança.", meta: "Domingo · 17h" },
  { d: "14", m: "Mar", title: "Encontro de Jovens", desc: "Louvor, palavra e comunhão para a nova geração.", meta: "Sábado · 19h" },
  { d: "05", m: "Abr", title: "Ceia do Senhor", desc: "Momento solene de comunhão e memória do sacrifício de Cristo.", meta: "Domingo · 18h" },
];

const bibleBooks = [
  "Gênesis","Êxodo","Levítico","Números","Deuteronômio","Josué","Juízes","Rute",
  "1 Samuel","2 Samuel","1 Reis","2 Reis","1 Crônicas","2 Crônicas","Esdras","Neemias",
  "Ester","Jó","Salmos","Provérbios","Eclesiastes","Cânticos","Isaías","Jeremias",
  "Lamentações","Ezequiel","Daniel","Oséias","Joel","Amós","Obadias","Jonas","Miquéias",
  "Naum","Habacuque","Sofonias","Ageu","Zacarias","Malaquias",
  "Mateus","Marcos","Lucas","João","Atos","Romanos","1 Coríntios","2 Coríntios",
  "Gálatas","Efésios","Filipenses","Colossenses","1 Tessalonicenses","2 Tessalonicenses",
  "1 Timóteo","2 Timóteo","Tito","Filemom","Hebreus","Tiago","1 Pedro","2 Pedro",
  "1 João","2 João","3 João","Judas","Apocalipse",
];

// bible-api.com abbreviations (English) matching order above
const bibleApiIds = [
  "genesis","exodus","leviticus","numbers","deuteronomy","joshua","judges","ruth",
  "1 samuel","2 samuel","1 kings","2 kings","1 chronicles","2 chronicles","ezra","nehemiah",
  "esther","job","psalms","proverbs","ecclesiastes","song of solomon","isaiah","jeremiah",
  "lamentations","ezekiel","daniel","hosea","joel","amos","obadiah","jonah","micah",
  "nahum","habakkuk","zephaniah","haggai","zechariah","malachi",
  "matthew","mark","luke","john","acts","romans","1 corinthians","2 corinthians",
  "galatians","ephesians","philippians","colossians","1 thessalonians","2 thessalonians",
  "1 timothy","2 timothy","titus","philemon","hebrews","james","1 peter","2 peter",
  "1 john","2 john","3 john","jude","revelation",
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [formStatus, setFormStatus] = useState<{ msg: string; error?: boolean }>({ msg: "" });

  const [book, setBook] = useState("18"); // Salmos index
  const [chapter, setChapter] = useState("23");
  const [verse, setVerse] = useState("");
  const [bibleText, setBibleText] = useState("Escolha um livro, capítulo (e versículo opcional) e clique em Ler.");
  const [bibleRef, setBibleRef] = useState("");
  const [bibleLoading, setBibleLoading] = useState(false);

  const audioIframeRef = useRef<HTMLIFrameElement | null>(null);
  const activeSectionRef = useRef<string>("inicio");
  const [activeSection, setActiveSection] = useState("inicio");

  // Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Mouse-follow 3D tilt on cards
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(
      ".event-card, .pastor-card, .glass-card, .gallery-item",
    );
    const onMove = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (0.5 - y) * 14;
      const ry = (x - 0.5) * 14;
      el.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    };
    const onLeave = (e: MouseEvent) => {
      (e.currentTarget as HTMLElement).style.transform = "";
    };
    cards.forEach((c) => {
      c.addEventListener("mousemove", onMove as EventListener);
      c.addEventListener("mouseleave", onLeave as EventListener);
    });
    return () => {
      cards.forEach((c) => {
        c.removeEventListener("mousemove", onMove as EventListener);
        c.removeEventListener("mouseleave", onLeave as EventListener);
      });
    };
  }, []);


  // Section highlight + back-to-top
  useEffect(() => {
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSectionRef.current = entry.target.id;
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((s) => so.observe(s));
    const onScroll = () => setShowTop(window.scrollY > 620);
    window.addEventListener("scroll", onScroll);
    return () => {
      so.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Try to start the ambient pad after first user interaction (browsers block autoplay-with-sound)
  useEffect(() => {
    const start = () => {
      if (!playing) togglePlay(true);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function togglePlay(force?: boolean) {
    const next = force ?? !playing;
    setPlaying(next);
    const iframe = audioIframeRef.current;
    if (!iframe) return;
    const cmd = next ? "playVideo" : "pauseVideo";
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: cmd, args: [] }),
      "*",
    );
  }

  async function fetchBible(e: React.FormEvent) {
    e.preventDefault();
    setBibleLoading(true);
    setBibleRef("");
    try {
      const bookName = bibleApiIds[Number(book)];
      const ref = verse ? `${bookName} ${chapter}:${verse}` : `${bookName} ${chapter}`;
      const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=almeida`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Referência não encontrada");
      const data = await res.json();
      setBibleText(data.text?.trim() || "Texto não disponível.");
      setBibleRef(
        `${bibleBooks[Number(book)]} ${chapter}${verse ? ":" + verse : ""} — Almeida`,
      );
    } catch {
      setBibleText("Não foi possível carregar essa passagem. Verifique a referência e tente novamente.");
      setBibleRef("");
    } finally {
      setBibleLoading(false);
    }
  }

  function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const name = (f.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (f.elements.namedItem("email") as HTMLInputElement).value.trim();
    const message = (f.elements.namedItem("message") as HTMLTextAreaElement).value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !email || !message) return setFormStatus({ msg: "Preencha todos os campos para enviar sua mensagem.", error: true });
    if (!emailOk) return setFormStatus({ msg: "Informe um e-mail válido.", error: true });
    setFormStatus({ msg: "Mensagem validada com sucesso. Obrigado pelo contato!" });
    f.reset();
  }

  const navItems = [
    ["inicio", "Início"],
    ["eventos", "Eventos"],
    ["quem-somos", "Quem Somos"],
    ["programacoes", "Programações"],
    ["pastores", "Pastores"],
    ["biblia", "Bíblia"],
    ["galeria", "Galeria"],
    ["localizacao", "Localização"],
    ["contato", "Contato"],
  ] as const;

  const marqueeItems = upcomingEvents.slice(0, 5);

  return (
    <>
      {/* Ambient pad – hidden YouTube iframe controlled via postMessage */}
      <iframe
        ref={audioIframeRef}
        className="audio-hidden-frame"
        title="Ambient pad"
        allow="autoplay"
        src="https://www.youtube.com/embed/S7UTea5zzFA?enablejsapi=1&autoplay=0&loop=1&playlist=S7UTea5zzFA&controls=0"
      />

      {/* Marquee banner */}
      <div className="events-banner" aria-label="Próximos eventos">
        <div className="events-banner-track">
          {[...marqueeItems, ...marqueeItems].map((ev, i) => (
            <span key={i}>
              <b>{ev.d} {ev.m}</b>
              {ev.title} — {ev.meta}
            </span>
          ))}
        </div>
      </div>

      <header className="site-header" id="topo">
        <nav className="navbar" aria-label="Menu principal">
          <a className="brand" href="#inicio" aria-label="IBEM - Início">
            <span className="brand-mark">IBEM</span>
            <span className="brand-text">
              <strong>Igreja Batista</strong>
              <small>Evangelho e Missões</small>
            </span>
          </a>
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
          <ul className={`nav-links ${menuOpen ? "open" : ""}`} id="main-menu">
            {navItems.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={activeSection === id ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero section" id="inicio" aria-label="Página inicial">
          <div className="hero-content reveal">
            <p className="section-kicker">Igreja Batista Evangelho e Missões</p>
            <h1>Bem-vindo à Igreja Batista Evangelho e Missões</h1>
            <p className="hero-subtitle">Um lugar para adorar, aprender a Palavra de Deus e viver em comunhão.</p>
            <blockquote>
              “Ide por todo o mundo e pregai o evangelho a toda criatura.” <cite>— Marcos 16:15</cite>
            </blockquote>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#localizacao">Visite-nos</a>
              <a className="btn btn-secondary" href="#eventos">Próximos eventos</a>
            </div>
          </div>
        </section>

        <section className="section events-section" id="eventos">
          <div className="container">
            <div className="section-heading centered reveal">
              <p className="section-kicker" style={{ color: "#f5c869" }}>Agenda</p>
              <h2>Próximos eventos</h2>
              <p style={{ color: "rgba(255,255,255,.8)" }}>
                Marque na sua agenda e venha viver esses momentos conosco.
              </p>
            </div>
            <div className="events-grid">
              {upcomingEvents.map((ev, i) => (
                <article key={i} className="event-card reveal">
                  <div className="event-date"><span className="d">{ev.d}</span><span className="m">{ev.m}</span></div>
                  <h3>{ev.title}</h3>
                  <p>{ev.desc}</p>
                  <div className="event-meta">{ev.meta}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-section" id="quem-somos">
          <div className="container">
            <div className="section-heading reveal">
              <p className="section-kicker">Quem Somos</p>
              <h2>Uma comunidade cristã de acolhimento, comunhão e missão.</h2>
            </div>
            <div className="about-grid">
              <div className="about-copy reveal">
                <p>
                  A Igreja Batista Evangelho e Missões (IBEM) é uma comunidade cristã comprometida em anunciar o
                  Evangelho de Jesus Cristo, servir ao próximo e promover o crescimento espiritual de vidas e famílias.
                  Nossa igreja busca ser um lugar de acolhimento, comunhão e transformação, onde cada pessoa possa
                  experimentar o amor de Deus e desenvolver um relacionamento verdadeiro com Cristo.
                </p>
              </div>
              <div className="identity-cards">
                <article className="glass-card reveal">
                  <span className="card-icon" aria-hidden="true">✦</span>
                  <h3>Missão</h3>
                  <p>Proclamar o Evangelho de Jesus Cristo, fazer discípulos e servir à comunidade com amor, fé e dedicação, cumprindo o chamado de Deus para alcançar vidas e transformar corações.</p>
                </article>
                <article className="glass-card reveal">
                  <span className="card-icon" aria-hidden="true">◎</span>
                  <h3>Visão</h3>
                  <p>Ser uma igreja relevante, comprometida com a Palavra de Deus, reconhecida pelo amor ao próximo, pela excelência no serviço cristão e pelo impacto positivo na sociedade através das missões e do discipulado.</p>
                </article>
                <article className="glass-card reveal">
                  <span className="card-icon" aria-hidden="true">◇</span>
                  <h3>Valores</h3>
                  <ul className="values-list">
                    <li><strong>Fé</strong> — Confiamos plenamente em Deus e em Sua Palavra.</li>
                    <li><strong>Amor</strong> — Demonstramos o amor de Cristo em nossas ações.</li>
                    <li><strong>Comunhão</strong> — Valorizamos a unidade e o cuidado entre os irmãos.</li>
                    <li><strong>Missões</strong> — Trabalhamos para levar o Evangelho a todos.</li>
                    <li><strong>Serviço</strong> — Servimos com humildade e dedicação.</li>
                    <li><strong>Integridade</strong> — Buscamos viver de acordo com os princípios bíblicos.</li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section program-section" id="programacoes">
          <div className="container">
            <div className="section-heading centered reveal">
              <p className="section-kicker">Programações</p>
              <h2>Encontros semanais da IBEM</h2>
              <p>Participe dos cultos e caminhe conosco em adoração, oração e ensino da Palavra.</p>
            </div>
            <div className="schedule-card reveal">
              <table>
                <thead>
                  <tr><th>Programação</th><th>Dia</th><th>Horário</th></tr>
                </thead>
                <tbody>
                  <tr><td>Culto de Celebração</td><td>Domingo</td><td>18h</td></tr>
                  <tr><td>Culto de Oração</td><td>Quarta</td><td>19h30</td></tr>
                  <tr><td>Culto de Ensino</td><td>Sexta</td><td>19h30</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section pastors-section" id="pastores">
          <div className="container">
            <div className="section-heading centered reveal">
              <p className="section-kicker">Liderança Pastoral</p>
              <h2>Conheça os pastores da IBEM</h2>
              <p style={{ color: "#4a5a6f" }}>
                Homens de Deus dedicados ao ensino da Palavra, ao cuidado das ovelhas e ao avanço do Reino.
              </p>
            </div>
            <div className="pastors-grid">
              <article className="pastor-card reveal">
                <div
                  className="pastor-avatar"
                  style={{ backgroundImage: "url(https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80)" }}
                />
                <h3>Pr. Josué Almeida</h3>
                <div className="pastor-role">Pastor Titular</div>
                <p>Consagrado ao ministério há mais de 20 anos, o Pr. Josué conduz a igreja com sabedoria bíblica, cuidado pastoral e paixão pelas missões.</p>
              </article>
              <article className="pastor-card reveal">
                <div
                  className="pastor-avatar"
                  style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80)" }}
                />
                <h3>Pr. Daniel Rocha</h3>
                <div className="pastor-role">Pastor Auxiliar</div>
                <p>Responsável pelo ensino da Palavra e pelo ministério de jovens, dedica-se à formação de discípulos comprometidos com Cristo.</p>
              </article>
              <article className="pastor-card reveal">
                <div
                  className="pastor-avatar"
                  style={{ backgroundImage: "url(https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80)" }}
                />
                <h3>Pra. Marta Almeida</h3>
                <div className="pastor-role">Ministério Feminino</div>
                <p>Atua no aconselhamento cristão, discipulado de mulheres e no cuidado com as famílias da igreja.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section bible-section" id="biblia">
          <div className="container">
            <div className="section-heading centered reveal">
              <p className="section-kicker">Palavra de Deus</p>
              <h2>Leia a Bíblia agora</h2>
              <p>Selecione o livro, o capítulo e (opcionalmente) o versículo para ler diretamente aqui no site.</p>
            </div>
            <div className="bible-tool reveal">
              <form className="bible-form" onSubmit={fetchBible}>
                <select value={book} onChange={(e) => setBook(e.target.value)} aria-label="Livro">
                  {bibleBooks.map((b, i) => <option key={i} value={i}>{b}</option>)}
                </select>
                <input
                  type="number" min={1} placeholder="Cap." aria-label="Capítulo"
                  value={chapter} onChange={(e) => setChapter(e.target.value)}
                />
                <input
                  type="text" placeholder="Vers. (opcional)" aria-label="Versículo"
                  value={verse} onChange={(e) => setVerse(e.target.value)}
                />
                <button type="submit" disabled={bibleLoading}>{bibleLoading ? "Carregando…" : "Ler"}</button>
              </form>
              <div className={`bible-result ${bibleLoading ? "bible-loading" : ""}`}>
                {bibleText}
                {bibleRef && <span className="ref">{bibleRef}</span>}
              </div>
            </div>
          </div>
        </section>

        <section className="section gallery-section" id="galeria">
          <div className="container">
            <div className="section-heading centered reveal">
              <p className="section-kicker">Galeria</p>
              <h2>Momentos de fé, comunhão e serviço</h2>
            </div>
            <div className="gallery-grid">
              {[
                "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1523803326055-9729b9e02e5a?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80",
              ].map((src, i) => (
                <figure key={i} className="gallery-item reveal">
                  <img src={src} alt="Momento da IBEM" loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section location-section" id="localizacao">
          <div className="container location-grid">
            <div className="location-content reveal">
              <p className="section-kicker">Localização</p>
              <h2>Venha cultuar conosco</h2>
              <p>Rua Exemplo, 123 – Salvador/BA</p>
              <a
                className="btn btn-primary"
                href="https://www.google.com/maps/search/?api=1&query=Rua%20Exemplo%20123%20Salvador%20BA"
                target="_blank" rel="noopener noreferrer"
              >Como chegar</a>
            </div>
            <div className="map-card reveal">
              <iframe
                title="Mapa da IBEM em Salvador"
                src="https://www.google.com/maps?q=Salvador%20BA&output=embed"
                width={600} height={450} style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contato">
          <div className="container contact-grid">
            <div className="contact-info reveal">
              <p className="section-kicker">Contato</p>
              <h2>Fale com a IBEM</h2>
              <p>Será uma alegria receber sua mensagem, pedido de oração ou visita.</p>
              <ul className="contact-list">
                <li><strong>WhatsApp:</strong> <a href="https://wa.me/5571999999999" target="_blank" rel="noopener noreferrer">(71) 9 9999-9999</a></li>
                <li><strong>Instagram:</strong> <a href="https://www.instagram.com/ibemoficial" target="_blank" rel="noopener noreferrer">@ibemoficial</a></li>
                <li><strong>E-mail:</strong> <a href="mailto:contato@ibem.com.br">contato@ibem.com.br</a></li>
              </ul>
            </div>
            <form className="contact-form reveal" id="contact-form" noValidate onSubmit={submitContact}>
              <label htmlFor="name">Nome</label>
              <input id="name" name="name" type="text" placeholder="Seu nome" required />

              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" placeholder="seuemail@exemplo.com" required />

              <label htmlFor="message">Mensagem</label>
              <textarea id="message" name="message" rows={5} placeholder="Escreva sua mensagem" required />

              <p className={`form-status ${formStatus.error ? "error" : ""}`} role="status" aria-live="polite">
                {formStatus.msg}
              </p>
              <button className="btn btn-primary" type="submit">Enviar Mensagem</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a className="brand footer-brand" href="#inicio" aria-label="IBEM - Início">
              <span className="brand-mark">IBEM</span>
              <span className="brand-text">
                <strong>Igreja Batista</strong>
                <small>Evangelho e Missões</small>
              </span>
            </a>
            <p>Igreja Batista Evangelho e Missões (IBEM)</p>
            <p>Pregando o Evangelho, fazendo discípulos e alcançando vidas para Cristo.</p>
          </div>
          <div>
            <h3>Links rápidos</h3>
            <ul className="footer-links">
              {navItems.map(([id, label]) => (
                <li key={id}><a href={`#${id}`}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Redes sociais</h3>
            <div className="social-links">
              <a href="https://www.instagram.com/ibemoficial" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://wa.me/5571999999999" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href="mailto:contato@ibem.com.br">E-mail</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 – Todos os direitos reservados.</div>
      </footer>

      <button
        className={`back-to-top ${showTop ? "visible" : ""}`}
        type="button" aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >↑</button>

      <div
        className={`audio-player ${playing ? "playing" : ""}`}
        onClick={() => togglePlay()}
        role="button"
        aria-pressed={playing}
        aria-label={playing ? "Pausar música ambiente" : "Tocar música ambiente"}
        title={playing ? "Pausar música ambiente" : "Tocar música ambiente"}
      >
        <span className="icon">{playing ? "❚❚" : "▶"}</span>
        <span>{playing ? "Pad tocando" : "Música ambiente"}</span>
      </div>
    </>
  );
}
