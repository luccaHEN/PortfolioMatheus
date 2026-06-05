"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Briefcase, Pencil } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States do formulário
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const experienceData = {
      company,
      role,
      start_date: startDate,
      end_date: endDate || null, // Se não tiver data final, será null (trabalho atual)
      description
    };

    let requestError;
    if (editingId) {
      const { error } = await supabase.from("experience").update(experienceData).eq("id", editingId);
      requestError = error;
    } else {
      const { error } = await supabase.from("experience").insert([experienceData]);
      requestError = error;
    }

    if (requestError) {
      toast.error("Erro ao salvar experiência");
    } else {
      toast.success(editingId ? "Experiência atualizada com sucesso!" : "Experiência adicionada com sucesso!");
      resetForm();
      fetchExperiences();
    }
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setCompany(exp.company);
    setRole(exp.role);
    setStartDate(exp.start_date ? String(exp.start_date).split("T")[0] : "");
    setEndDate(exp.end_date ? String(exp.end_date).split("T")[0] : "");
    setDescription(exp.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setCompany(""); setRole(""); setStartDate(""); setEndDate(""); setDescription("");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">{editingId ? "Editar Experiência" : "Adicionar Experiência"}</h1>
        <form onSubmit={handleSubmit} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 grid gap-6 backdrop-blur-sm">
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
          <div className="flex flex-col md:flex-row gap-4">
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 transition w-full md:w-auto md:justify-self-start">
              {editingId ? "Atualizar Experiência" : "Salvar Experiência"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-slate-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-600 transition w-full md:w-auto">
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Experiências Cadastradas</h2>
        <div className="space-y-4">
          {loading ? <p className="text-slate-400">Carregando...</p> : experiences.map((exp) => (
            <div key={exp.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex justify-between items-start hover:border-slate-700 transition">
              <div className="flex-1"><h3 className="font-bold text-xl text-white">{exp.role}</h3><p className="text-blue-500 font-medium">{exp.company}</p><p className="text-slate-500 text-sm mt-1 mb-3">{new Date(exp.start_date).toLocaleDateString('pt-BR', { timeZone: 'UTC', month: 'short', year: 'numeric' }).replace('.', '')} {' - '} {exp.end_date ? new Date(exp.end_date).toLocaleDateString('pt-BR', { timeZone: 'UTC', month: 'short', year: 'numeric' }).replace('.', '') : 'Atualmente'}</p><p className="text-slate-400 text-sm whitespace-pre-line">{exp.description}</p></div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button onClick={() => handleEdit(exp)} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition" title="Editar"><Pencil className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition" title="Excluir"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
          {!loading && experiences.length === 0 && <p className="text-slate-500">Nenhuma experiência cadastrada.</p>}
        </div>
      </div>
    </div>
  );
}