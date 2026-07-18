import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, Phone, Mail, Youtube, Instagram, Facebook, ArrowRight, Church, HandHeart, BookOpen, Users } from "lucide-react";
import heroChurch from "@/assets/hero-church.jpg";
import { CursorGlow, TiltCard, Magnetic, Reveal, FloatingOrbs } from "@/components/motion";

export const Route = createFileRoute("/")({
  component: Home,
});

const cultos = [
  { day: "Domingo", time: "10h00", title: "Escola Bíblica Dominical", desc: "Estudo da Palavra para todas as idades." },
  { day: "Domingo", time: "18h30", title: "Culto de Celebração", desc: "Louvor, adoração e mensagem." },
  { day: "Quarta-feira", time: "19h30", title: "Culto de Oração e Ensino", desc: "Momento de intercessão e edificação." },
  { day: "Sábado", time: "19h30", title: "Culto de Jovens", desc: "Encontro semanal dos jovens da IBEM." },
];

const eventos = [
  { date: "12 SET", title: "Congresso de Missões", detail: "Três noites com preletores convidados." },
  { date: "28 SET", title: "Batismo nas Águas", detail: "Celebração de novos discípulos de Cristo." },
  { date: "19 OUT", title: "Encontro de Casais", detail: "Um final de semana para restauração e comunhão." },
];

const pilares = [
  { icon: BookOpen, title: "Palavra", text: "Ensino bíblico expositivo, fiel às Escrituras." },
  { icon: HandHeart, title: "Missões", text: "Enviados a todas as nações, começando em nossa cidade." },
  { icon: Users, title: "Comunidade", text: "Vida em pequenos grupos e discipulado." },
  { icon: Church, title: "Adoração", text: "Cultos com reverência, alegria e verdade." },
];

function Home() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <CursorGlow />
      <Nav />
      <Hero />
      <Pilares />
      <Cultos />
      <Live />
      <Eventos />
      <Localizacao />
      <Contato />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container-page flex items-center justify-between h-16">
        <a href="#inicio" className="flex items-center gap-2 group">
          <span
            className="grid place-items-center w-9 h-9 rounded-md transition-transform duration-500 group-hover:[transform:rotateY(180deg)]"
            style={{ background: "var(--gradient-navy)", transformStyle: "preserve-3d" }}
          >
            <Church className="w-5 h-5" style={{ color: "var(--gold)" }} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">IBEM</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#cultos" className="hover:text-foreground transition">Cultos</a>
          <a href="#live" className="hover:text-foreground transition">Ao Vivo</a>
          <a href="#eventos" className="hover:text-foreground transition">Eventos</a>
          <a href="#localizacao" className="hover:text-foreground transition">Localização</a>
          <a href="#contato" className="hover:text-foreground transition">Contato</a>
        </nav>
        <Magnetic>
          <a href="#contato" className="btn-outline-gold text-sm hidden sm:inline-flex">Visite-nos</a>
        </Magnetic>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <img src={heroChurch} alt="Interior da igreja com luz dourada" className="absolute inset-0 w-full h-full object-cover scale-105" width={1920} height={1280} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, oklch(0.14 0.05 260 / 0.92) 40%, oklch(0.14 0.05 260 / 0.55))" }} />
      <FloatingOrbs />
      <div className="container-page relative z-10 py-24">
        <div className="max-w-2xl text-secondary">
          <Reveal>
            <span className="eyebrow"><span className="gold-rule" /> Bem-vindo à IBEM</span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] font-medium">
              Uma casa de fé,<br />
              <span className="shimmer-text" style={{ color: "var(--gold)" }}>uma família</span> em Cristo.
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 text-lg text-secondary/80 max-w-xl leading-relaxed">
              Igreja Batista Evangélica Missionária — comprometida com a Palavra, a oração e o cuidado uns com os outros. Venha nos visitar.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Magnetic>
                <a href="#cultos" className="btn-primary">Horários de culto <ArrowRight className="w-4 h-4" /></a>
              </Magnetic>
              <Magnetic>
                <a href="#live" className="btn-outline-gold">Assistir ao vivo</a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 rounded-full border border-gold/40 grid place-items-start p-1"
      >
        <span className="w-1 h-2 rounded-full bg-gold animate-bounce" />
      </div>
    </section>
  );
}

function Pilares() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container-page">
        <div className="grid md:grid-cols-4 gap-8">
          {pilares.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <TiltCard intensity={12} className="h-full">
                <div className="p-6 rounded-lg bg-white border border-transparent hover:border-gold/30 transition-colors h-full">
                  <div
                    className="w-12 h-12 grid place-items-center rounded-md"
                    style={{ background: "var(--gradient-navy)", transform: "translateZ(30px)" }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-primary" style={{ transform: "translateZ(20px)" }}>{p.title}</h3>
                  <div className="gold-rule mt-3" />
                  <p className="mt-3 text-muted-foreground leading-relaxed">{p.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cultos() {
  return (
    <section id="cultos" className="py-24 relative overflow-hidden" style={{ background: "var(--gradient-navy)" }}>
      <FloatingOrbs />
      <div className="container-page text-secondary relative">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow"><span className="gold-rule" /> Horários</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium">Cultos e reuniões</h2>
            <p className="mt-4 text-secondary/70">Encontre o momento certo para você e sua família adorar conosco.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultos.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <TiltCard intensity={14} className="h-full">
                <article className="p-6 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.08] transition h-full">
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--gold)", transform: "translateZ(25px)" }}>
                    <Calendar className="w-4 h-4" />
                    <span className="uppercase tracking-widest">{c.day}</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2" style={{ transform: "translateZ(40px)" }}>
                    <Clock className="w-4 h-4 text-secondary/60" />
                    <span className="font-display text-3xl font-semibold">{c.time}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-secondary/70 leading-relaxed">{c.desc}</p>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Live() {
  return (
    <section id="live" className="py-24 bg-background relative overflow-hidden">
      <div className="container-page grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div>
            <span className="eyebrow"><span className="gold-rule" /> Transmissão</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-primary">Ao vivo, todos os cultos.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
              Não pôde estar presente? Acompanhe cada momento pelo nosso canal no YouTube. Louvor, mensagem e comunhão à distância de um clique.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="btn-primary" style={{ animation: "pulse-gold 2.4s ease-out infinite" }}>
                  <Youtube className="w-4 h-4" /> Abrir no YouTube
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#eventos" className="btn-outline-gold">Ver programação</a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <TiltCard intensity={8}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-xl" style={{ background: "var(--gradient-gold)", opacity: 0.28, filter: "blur(28px)" }} />
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]" style={{ transform: "translateZ(30px)" }}>
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/live_stream?channel=UC_x5XG1OV2P6uZZ5FSM9Ttw"
                  title="Transmissão ao vivo IBEM"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

function Eventos() {
  return (
    <section id="eventos" className="py-24 bg-muted">
      <div className="container-page">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div className="max-w-xl">
              <span className="eyebrow"><span className="gold-rule" /> Agenda</span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-primary">Próximos eventos</h2>
            </div>
            <a href="#contato" className="text-sm font-medium hover:underline" style={{ color: "var(--ink)" }}>
              Ver todos <ArrowRight className="inline w-4 h-4" />
            </a>
          </div>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {eventos.map((e, i) => (
            <Reveal key={e.title} delay={i * 120}>
              <TiltCard intensity={12} className="h-full">
                <article className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-[var(--shadow-elegant)] transition h-full">
                  <div className="p-6 border-b border-border flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                    <span className="font-display text-2xl font-semibold text-primary">{e.date}</span>
                    <span className="w-10 h-10 grid place-items-center rounded-full border border-gold/40 group-hover:bg-gold/10 transition">
                      <Calendar className="w-4 h-4" style={{ color: "var(--gold)" }} />
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary">{e.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.detail}</p>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Localizacao() {
  return (
    <section id="localizacao" className="py-24 bg-background">
      <div className="container-page grid lg:grid-cols-2 gap-14 items-stretch">
        <Reveal>
          <div className="flex flex-col justify-center h-full">
            <span className="eyebrow"><span className="gold-rule" /> Onde estamos</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-primary">Venha nos visitar</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
              Nossa casa está sempre aberta. Traga sua família, seus amigos — todos são bem-vindos.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5" style={{ color: "var(--gold)" }} />
                <span>Rua da Fé, 123 — Centro<br />Sua Cidade, Estado — CEP 00000-000</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5" style={{ color: "var(--gold)" }} />
                <span>(00) 0000-0000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5" style={{ color: "var(--gold)" }} />
                <span>contato@ibem.org.br</span>
              </li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <TiltCard intensity={6}>
            <div className="rounded-xl overflow-hidden border border-border shadow-[var(--shadow-elegant)] min-h-[380px]">
              <iframe
                title="Mapa IBEM"
                src="https://www.google.com/maps?q=Igreja+Batista&output=embed"
                className="w-full h-full min-h-[380px]"
                loading="lazy"
              />
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

function Contato() {
  return (
    <section id="contato" className="py-24 relative overflow-hidden" style={{ background: "var(--gradient-navy)" }}>
      <FloatingOrbs />
      <div className="container-page text-secondary relative">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <span className="eyebrow justify-center"><span className="gold-rule" /> Fale conosco</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium">Estamos à sua disposição</h2>
            <p className="mt-4 text-secondary/70">Envie sua mensagem — pedidos de oração, dúvidas ou primeira visita.</p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <form className="mt-12 max-w-2xl mx-auto grid gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Seu nome" className="bg-white/5 border border-white/15 rounded-md px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-gold transition" />
              <input required type="email" placeholder="Seu e-mail" className="bg-white/5 border border-white/15 rounded-md px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-gold transition" />
            </div>
            <textarea required rows={5} placeholder="Sua mensagem" className="bg-white/5 border border-white/15 rounded-md px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-gold transition resize-none" />
            <Magnetic className="justify-self-start">
              <button type="submit" className="btn-primary">Enviar mensagem <ArrowRight className="w-4 h-4" /></button>
            </Magnetic>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-secondary/70">
      <div className="container-page py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-md" style={{ background: "var(--gradient-gold)" }}>
              <Church className="w-5 h-5" style={{ color: "var(--ink)" }} />
            </span>
            <span className="font-display text-xl font-semibold text-secondary">IBEM</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed max-w-xs">
            Igreja Batista Evangélica Missionária. Amamos a Deus, amamos as pessoas, cumprimos a missão.
          </p>
        </div>
        <div>
          <h4 className="text-secondary font-semibold text-sm uppercase tracking-widest">Navegue</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#cultos" className="hover:text-gold transition">Cultos</a></li>
            <li><a href="#live" className="hover:text-gold transition">Ao vivo</a></li>
            <li><a href="#eventos" className="hover:text-gold transition">Eventos</a></li>
            <li><a href="#localizacao" className="hover:text-gold transition">Localização</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-secondary font-semibold text-sm uppercase tracking-widest">Redes</h4>
          <div className="mt-4 flex gap-3">
            <Magnetic><a href="#" aria-label="Instagram" className="w-10 h-10 grid place-items-center rounded-full border border-white/15 hover:border-gold hover:text-gold transition"><Instagram className="w-4 h-4" /></a></Magnetic>
            <Magnetic><a href="#" aria-label="Facebook" className="w-10 h-10 grid place-items-center rounded-full border border-white/15 hover:border-gold hover:text-gold transition"><Facebook className="w-4 h-4" /></a></Magnetic>
            <Magnetic><a href="#" aria-label="YouTube" className="w-10 h-10 grid place-items-center rounded-full border border-white/15 hover:border-gold hover:text-gold transition"><Youtube className="w-4 h-4" /></a></Magnetic>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-6 text-xs flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} IBEM. Todos os direitos reservados.</span>
          <span>Feito com fé.</span>
        </div>
      </div>
    </footer>
  );
}
