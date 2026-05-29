"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import Dropzone from "@/components/admin/Dropzone";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [email, setEmail] = useState("");
  const [sectionOrder, setSectionOrder] = useState<string[]>(["technologies", "projects", "experience", "certifications"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase.from("profile").select("*").order("created_at", { ascending: false }).limit(1);
    if (data && data.length > 0) {
      const p = data[0];
      setId(p.id);
      setName(p.name || "");
      setRole(p.role || "");
      setDescription(p.description || "");
      setAvatarUrl(p.avatar_url || "");
      setWhatsappUrl(p.whatsapp_url || "");
      setLinkedinUrl(p.linkedin_url || "");
      setGithubUrl(p.github_url || "");
      setEmail(p.email || "");
      setSectionOrder(p.section_order || ["technologies", "projects", "experience", "certifications"]);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const profileData: any = { 
      name, 
      role, 
      description, 
      avatar_url: avatarUrl,
      whatsapp_url: whatsappUrl,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      email,
      section_order: sectionOrder
    };
    
    let requestError;
    if (id) {
      const { error } = await supabase.from("profile").update(profileData).eq("id", id);
      requestError = error;
    } else {
      const { data, error } = await supabase.from("profile").insert([profileData]).select();
      requestError = error;
      if (data && data.length > 0) setId(data[0].id);
    }
    
    if (requestError) {
      toast.error(`Erro do banco: ${requestError.message}`);
    } else {
      toast.success("Perfil atualizado com sucesso!");
    }
  };

  const handleOrderChange = (sectionId: string, newIndex: number) => {
    const newOrder = [...sectionOrder];
    const oldIndex = newOrder.indexOf(sectionId);
    newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, sectionId);
    setSectionOrder(newOrder);
  };

  const sectionLabels: Record<string, string> = {
    technologies: "Habilidades & Tecnologias",
    projects: "Projetos",
    experience: "Experiência Profissional",
    certifications: "Certificações"
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Configurações do Perfil</h1>
      
      <form onSubmit={handleSave} className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 space-y-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Perfil" className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg shrink-0" />
          ) : (
            <div className="w-40 h-40 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center text-slate-500 shrink-0">Sem Foto</div>
          )}
          <div className="w-full">
            <Dropzone onUploadSuccess={(url) => setAvatarUrl(url)} label="Alterar Foto de Perfil (JPG/PNG)" folder="profile" accept="image/*" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-slate-400 text-sm mb-2 font-medium">Seu Nome</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Matheus Silva" className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2 font-medium">Seu Cargo / Título</label>
            <input required type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex: Desenvolvedor Front-end" className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-2 font-medium">Descrição / Sobre mim</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Fale um pouco sobre você e sua carreira..." className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition h-40 resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-slate-400 text-sm mb-2 font-medium">WhatsApp URL</label>
            <input type="url" value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} placeholder="https://wa.me/..." className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2 font-medium">LinkedIn URL</label>
            <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2 font-medium">GitHub URL</label>
            <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2 font-medium">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-4 font-medium">Ordem de Exibição das Seções (Portfólio)</label>
          <div className="space-y-2">
            {sectionOrder.map((sectionId, index) => (
              <div key={sectionId} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 p-4 rounded-lg">
                <span className="text-slate-300 font-medium">{sectionLabels[sectionId]}</span>
                <select
                  value={index}
                  onChange={(e) => handleOrderChange(sectionId, Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                >
                  {sectionOrder.map((_, i) => (
                    <option key={i} value={i}>Posição {i + 1}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Use as caixas de seleção para definir a ordem das seções no seu portfólio.</p>
        </div>

        <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-500 transition w-full md:w-auto">Salvar Perfil</button>
      </form>
    </div>
  );
}