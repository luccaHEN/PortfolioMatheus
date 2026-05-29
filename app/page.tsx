"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Project, Certification } from "@/types";
import { ExternalLink, Award, FolderKanban, Loader2, FileText, Briefcase, Mail, User, Cpu } from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";

// Componente para criar animação suave de surgimento ao rolar a página
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const sectionNames: Record<string, string> = {
  technologies: "Habilidades",
  projects: "Projetos",
  experience: "Experiência",
  certifications: "Certificados"
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [projectsRes, certsRes, expRes, profileRes, techRes] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("certifications").select("*").order("date", { ascending: false }),
        supabase.from("experience").select("*").order("start_date", { ascending: false }),
        supabase.from("profile").select("*").order("created_at", { ascending: false }).limit(1),
        supabase.from("technologies").select("*").order("category", { ascending: true })
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (certsRes.data) setCertifications(certsRes.data);
      if (expRes.data) setExperiences(expRes.data);
      if (profileRes.data && profileRes.data.length > 0) setProfile(profileRes.data[0]);
      if (techRes.data) setTechnologies(techRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  // Função inteligente para agrupar as tecnologias pelas categorias cadastradas
  const groupedTechs = technologies.reduce((acc, tech) => {
    acc[tech.category] = acc[tech.category] || [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, any[]>);

  // Define a ordem atual do banco ou a padrão
  const order = profile?.section_order || ["technologies", "projects", "experience", "certifications"];

  // Função que renderiza a seção correspondente
  const renderSection = (sectionId: string) => {
    if (sectionId === "technologies") {
      return (
        <section id="technologies" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-16" key="technologies">
          <FadeIn>
            <div className="flex items-center gap-3 mb-10">
              <Cpu className="w-8 h-8 text-blue-500" />
              <h2 className="text-3xl font-bold text-white">Linguagens & Ferramentas</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedTechs).map(([category, techs], idx) => (
              <FadeIn key={category} delay={idx * 150}>
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 h-full shadow-lg hover:border-blue-500/30 transition-colors">
                  <h3 className="text-lg font-bold text-white mb-5">{category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {(techs as any[]).map(tech => (
                      <div key={tech.id} className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg">
                        {tech.icon_url && <img src={tech.icon_url} alt={tech.name} className="w-5 h-5 object-contain" />}
                        <span className="text-slate-300 font-medium text-sm">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
            {technologies.length === 0 && <p className="text-slate-500 col-span-full">Nenhuma tecnologia adicionada ainda.</p>}
          </div>
        </section>
      );
    }

    if (sectionId === "projects") {
      return (
        <section id="projects" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-16" key="projects">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <FolderKanban className="w-8 h-8 text-blue-500" />
              <h2 className="text-3xl font-bold text-white">Projetos</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <FadeIn key={project.id} delay={index * 150}>
                <div className="group bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col h-full">
                {project.image_url ? (
                  <div className="overflow-hidden border-b border-slate-800/80">
                    <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-slate-800/50 flex items-center justify-center border-b border-slate-800/80">
                    <FolderKanban className="w-10 h-10 text-slate-600"/>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-white mb-2">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-5 line-clamp-3 flex-1 leading-relaxed">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-slate-950/50 text-blue-400 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pt-5 mt-auto flex items-center gap-4 border-t border-slate-800/80">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400 transition-colors font-medium">
                        <FaGithub className="w-4 h-4" /> Repositório
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400 transition-colors font-medium">
                        <ExternalLink className="w-4 h-4" /> Acessar
                      </a>
                    )}
                  </div>
                </div>
                </div>
              </FadeIn>
            ))}
            {projects.length === 0 && <p className="text-slate-500 col-span-full">Nenhum projeto adicionado ainda.</p>}
          </div>
        </section>
      );
    }

    if (sectionId === "experience") {
      return (
        <section id="experience" className="max-w-5xl mx-auto px-6 py-12 scroll-mt-16" key="experience">
          <FadeIn>
            <div className="flex items-center gap-3 mb-12">
              <Briefcase className="w-8 h-8 text-blue-500" />
              <h2 className="text-3xl font-bold text-white">Experiência Profissional</h2>
            </div>
          </FadeIn>
          <div className="relative border-l-2 border-slate-800/80 ml-3 md:ml-4 space-y-10 pb-4">
            {experiences.map((exp) => (
              <FadeIn key={exp.id}>
                <div className="relative pl-8 md:pl-12 group">
                <div className="absolute w-5 h-5 bg-slate-950 border-4 border-slate-700 rounded-full -left-[11px] top-7 group-hover:border-blue-500 group-hover:bg-blue-900 transition-all duration-300"></div>
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 md:p-8 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-900/10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-white">{exp.role}</h3>
                      <p className="text-blue-500 font-medium text-lg mt-1">{exp.company}</p>
                    </div>
                    <div className="text-slate-400 text-sm whitespace-nowrap">
                      <span className="bg-slate-950/80 px-4 py-2 rounded-full border border-slate-800 font-medium shadow-sm inline-block">
                        {new Date(exp.start_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })} 
                        {' - '} 
                        {exp.end_date ? new Date(exp.end_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : 'Atualmente'}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
                </div>
              </FadeIn>
            ))}
            {experiences.length === 0 && <p className="text-slate-500 pl-8">Nenhuma experiência adicionada ainda.</p>}
          </div>
        </section>
      );
    }

    if (sectionId === "certifications") {
      return (
        <section id="certifications" className="max-w-5xl mx-auto px-6 py-12 mb-20 scroll-mt-16" key="certifications">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-8 h-8 text-blue-500" />
              <h2 className="text-3xl font-bold text-white">Certificações</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <FadeIn key={cert.id} delay={index * 150}>
                <div className="group bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col h-full">
                {cert.image_url ? (
                  <div className="overflow-hidden border-b border-slate-800/80">
                    <img src={cert.image_url} alt={cert.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-slate-800/50 flex items-center justify-center border-b border-slate-800/80">
                    <Award className="w-10 h-10 text-slate-600"/>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-white leading-tight">{cert.title}</h3>
                  <p className="text-blue-500 text-sm mt-2">{cert.institution} • {cert.hours}h</p>
                  {cert.pdf_url && (
                    <div className="mt-5 pt-5 border-t border-slate-800/80 mt-auto">
                      <a href={cert.pdf_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm bg-slate-800/50 text-slate-300 hover:text-blue-400 hover:bg-slate-800 py-2.5 rounded-lg transition-colors font-medium border border-slate-700/50">
                        <FileText className="w-4 h-4" /> Ver Certificado
                      </a>
                    </div>
                  )}
                </div>
                </div>
              </FadeIn>
            ))}
            {certifications.length === 0 && <p className="text-slate-500 col-span-full">Nenhuma certificação adicionada ainda.</p>}
          </div>
        </section>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="fixed inset-0 bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-20"></div>
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      {/* Fundo Global Fixo com Gradiente */}
      <div className="fixed inset-0 bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-20"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">MatheusQA</span>
          <nav className="flex gap-4 md:gap-6 text-sm font-medium text-slate-400">
            {order.map((sectionId: string) => (
              <a key={sectionId} href={`#${sectionId}`} className="hover:text-blue-400 transition-colors">
                {sectionNames[sectionId]}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative border-b border-slate-900 overflow-hidden">
        
        <FadeIn>
          <section className="max-w-5xl mx-auto px-6 py-28 md:py-36 text-center flex flex-col items-center relative z-10">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-slate-900 ring-4 ring-blue-500/30 mb-8 shadow-2xl" />
          ) : (
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-slate-900 border-4 border-slate-800 ring-4 ring-blue-500/30 flex items-center justify-center mb-8 shadow-2xl">
              <User className="w-16 h-16 text-slate-600" />
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 whitespace-pre-line tracking-tight">
            {profile?.name ? (
              <>Olá, eu sou <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">{profile.name}</span></>
            ) : (
              <>Olá, eu sou <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Matheus</span></>
            )}
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-slate-400 mb-8">
            {profile?.role || "Desenvolvedor de Software"}
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto whitespace-pre-line leading-relaxed">
            {profile?.description || "Bem-vindo ao meu portfólio. Aqui você encontra meus projetos recentes e certificações, demonstrando minha jornada e evolução na tecnologia."}
          </p>

          {/* Redes Sociais */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            {profile?.whatsapp_url && (
              <a href={profile.whatsapp_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 hover:border-green-500/50 hover:bg-slate-800 hover:text-green-400 text-slate-300 px-6 py-3 rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
                 <FaWhatsapp className="w-5 h-5" /> WhatsApp
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 hover:text-blue-400 text-slate-300 px-6 py-3 rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
                 <FaLinkedin className="w-5 h-5" /> LinkedIn
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-full transition-all duration-300 font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1">
                <Mail className="w-5 h-5" /> Email
              </a>
            )}
          </div>
          </section>
        </FadeIn>
      </div>

      {/* Renderização Dinâmica das Seções */}
      {order.map((sectionId: string) => renderSection(sectionId))}

      {/* Footer Profissional */}
      <footer className="border-t border-slate-800/60 bg-slate-950/50 py-10 mt-16 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} MatheusQA. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-slate-500">
            {profile?.whatsapp_url && (
              <a href={profile.whatsapp_url} target="_blank" rel="noreferrer" className="hover:text-green-400 transition-colors" aria-label="WhatsApp">
                <FaWhatsapp className="w-6 h-6" />
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="w-6 h-6" />
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-blue-400 transition-colors" aria-label="Email">
                <Mail className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}