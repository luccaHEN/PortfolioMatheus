"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types";
import { Trash2, FolderKanban, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import Dropzone from "@/components/admin/Dropzone";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // States do formulário
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [category, setCategory] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar projetos");
    else setProjects(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao deletar projeto");
    } else {
      toast.success("Projeto deletado com sucesso!");
      fetchProjects();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transforma a string separada por vírgulas em um array de tecnologias
    const techArray = technologies.split(",").map(t => t.trim()).filter(Boolean);

    const projectData = {
      title,
      description,
      technologies: techArray,
      category: category || null,
      project_date: projectDate || null,
      video_url: videoUrl || null,
      github_url: null,
      live_url: null,
      image_url: null
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from("projects").update(projectData).eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("projects").insert([projectData]);
      error = insertError;
    }
    
    if (error) {
      toast.error("Erro ao salvar projeto no banco");
      console.error(error);
    } else {
      toast.success(editingId ? "Projeto atualizado com sucesso!" : "Projeto adicionado com sucesso!");
      resetForm();
      fetchProjects();
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTechnologies(project.technologies?.join(", ") || "");
    setCategory(project.category || "");
    setProjectDate(project.project_date ? String(project.project_date).split("T")[0] : "");
    setVideoUrl(project.video_url || "");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola pro topo suavemente
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle(""); setDescription(""); setTechnologies(""); setCategory(""); 
    setProjectDate(""); setVideoUrl("");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">{editingId ? "Editar Projeto" : "Adicionar Projeto"}</h1>
        
        <form onSubmit={handleSubmit} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 backdrop-blur-sm">
          <div className="space-y-4">
            <input type="text" placeholder="Título do Projeto" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              
            <textarea placeholder="Descrição sobre o projeto e seus desafios" required value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition h-32 resize-none" />
              
            <input type="text" placeholder="Tecnologias (separe por vírgula. Ex: React, Node, Tailwind)" value={technologies} onChange={(e) => setTechnologies(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />

            <div className="flex gap-4">
              <input type="text" placeholder="Categoria (Ex: Front-end, Full-stack)" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-1/2 bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
                
              <input type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)}
                className="w-1/2 bg-slate-950/50 text-slate-400 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
          </div>

          <div className="space-y-4">
             <Dropzone onUploadSuccess={(url) => setVideoUrl(url)} label="Vídeo de Demonstração (MP4/WebM) - Opcional" folder="projects" accept="video/*" />
             {videoUrl && (
               <div className="space-y-3 mt-4">
                 <div className="flex items-center justify-between bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700">
                   <p className="text-blue-400 text-sm font-medium">Vídeo selecionado!</p>
                   <button type="button" onClick={() => setVideoUrl("")} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Remover vídeo</button>
                 </div>
                 <video src={videoUrl} controls className="w-full max-h-64 rounded-lg border border-slate-700 bg-black object-contain" />
               </div>
             )}
          </div>

          <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 transition w-full md:w-auto">
              {editingId ? "Atualizar Projeto" : "Salvar Projeto"}
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
        <h2 className="text-2xl font-bold mb-6 text-white">Projetos Cadastrados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <p className="text-slate-400">Carregando...</p> : projects.map((project) => (
            <div key={project.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col">
              {project.video_url ? (
                <video src={project.video_url} className="w-full h-40 object-cover" muted loop playsInline />
              ) : (
                <div className="w-full h-40 bg-slate-800/50 flex items-center justify-center">
                  <FolderKanban className="w-10 h-10 text-slate-600"/>
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-white">{project.title}</h3>
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center mt-auto">
                  {project.category && (
                    <span className="text-blue-500 text-sm font-medium">{project.category}</span>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <button onClick={() => handleEdit(project)} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && projects.length === 0 && <p className="text-slate-500">Nenhum projeto cadastrado.</p>}
        </div>
      </div>
    </div>
  );
}