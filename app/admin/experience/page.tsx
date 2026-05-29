"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States do formulário
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("experience").select("*").order("start_date", { ascending: false });
    if (error) toast.error("Erro ao carregar experiências");
    else setExperiences(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta experiência?")) return;
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) toast.error("Erro ao deletar experiência");
    else {
      toast.success("Experiência deletada com sucesso!");
      fetchExperiences();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExperience = {
      company,
      role,
      start_date: startDate,
      end_date: endDate || null, // Se não tiver data final, será null (trabalho atual)
      description
    };

    const { error } = await supabase.from("experience").insert([newExperience]);
    if (error) {
      toast.error("Erro ao salvar experiência");
    } else {
      toast.success("Experiência adicionada com sucesso!");
      setCompany(""); setRole(""); setStartDate(""); setEndDate(""); setDescription("");
      fetchExperiences();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Adicionar Experiência</h1>
        <form onSubmit={handleCreate} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 grid gap-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Nome da Empresa (Ex: Google, Freelancer)" required value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            <input type="text" placeholder="Cargo (Ex: Desenvolvedor Front-end)" required value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Data de Início</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-950/50 text-slate-400 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Data de Término (Deixe em branco se for o emprego atual)</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-950/50 text-slate-400 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
          </div>
          <textarea placeholder="Descreva suas responsabilidades e tecnologias utilizadas" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition h-32 resize-none" />
          <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 transition w-full md:w-auto md:justify-self-start">Salvar Experiência</button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Experiências Cadastradas</h2>
        <div className="space-y-4">
          {loading ? <p className="text-slate-400">Carregando...</p> : experiences.map((exp) => (
            <div key={exp.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex justify-between items-start hover:border-slate-700 transition"><div className="flex-1"><h3 className="font-bold text-xl text-white">{exp.role}</h3><p className="text-blue-500 font-medium">{exp.company}</p><p className="text-slate-500 text-sm mt-1 mb-3">{new Date(exp.start_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })} {' - '} {exp.end_date ? new Date(exp.end_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : 'Atualmente'}</p><p className="text-slate-400 text-sm whitespace-pre-line">{exp.description}</p></div><button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition ml-4 shrink-0"><Trash2 className="w-5 h-5" /></button></div>
          ))}
          {!loading && experiences.length === 0 && <p className="text-slate-500">Nenhuma experiência cadastrada.</p>}
        </div>
      </div>
    </div>
  );
}