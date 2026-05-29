"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Cpu } from "lucide-react";
import toast from "react-hot-toast";
import Dropzone from "@/components/admin/Dropzone";

export default function AdminTechnologies() {
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States do formulário
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("technologies").select("*").order("category", { ascending: true });
    if (error) toast.error("Erro ao carregar tecnologias");
    else setTechnologies(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta tecnologia?")) return;
    const { error } = await supabase.from("technologies").delete().eq("id", id);
    if (error) toast.error("Erro ao deletar");
    else {
      toast.success("Deletado com sucesso!");
      fetchTechnologies();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTech = { name, category, icon_url: iconUrl || null };

    const { error } = await supabase.from("technologies").insert([newTech]);
    if (error) {
      toast.error("Erro ao salvar tecnologia");
    } else {
      toast.success("Tecnologia adicionada!");
      setName(""); setIconUrl(""); // Mantemos a categoria para facilitar múltiplos cadastros
      fetchTechnologies();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Adicionar Tecnologia</h1>
        
        <form onSubmit={handleCreate} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 backdrop-blur-sm">
          <div className="space-y-4">
            <input type="text" placeholder="Nome (Ex: React, Cypress, Jest)" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              
            <input type="text" list="category-options" placeholder="Categoria (Ex: Frontend, Backend, DevOps)" required value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            <datalist id="category-options">
              <option value="Automação & Testes" />
              <option value="Frontend" />
              <option value="Backend" />
              <option value="DevOps & Ferramentas" />
              <option value="Banco de Dados" />
            </datalist>
          </div>

          <div className="space-y-4">
             <Dropzone onUploadSuccess={(url) => setIconUrl(url)} label="Ícone da Tecnologia (Opcional - SVG/PNG)" folder="technologies" accept="image/*" />
             {iconUrl && <p className="text-blue-500 text-sm font-medium">Ícone anexado com sucesso!</p>}
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 transition w-full md:w-auto">Adicionar</button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Tecnologias Cadastradas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? <p className="text-slate-400">Carregando...</p> : technologies.map((tech) => (
            <div key={tech.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                {tech.icon_url ? <img src={tech.icon_url} alt={tech.name} className="w-8 h-8 object-contain" /> : <Cpu className="w-8 h-8 text-slate-600"/>}
                <div><h3 className="font-bold text-white text-sm">{tech.name}</h3><p className="text-blue-500 text-xs">{tech.category}</p></div>
              </div>
              <button onClick={() => handleDelete(tech.id)} className="text-slate-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}