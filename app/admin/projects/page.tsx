"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types";
import { Trash2, FolderKanban } from "lucide-react";
import toast from "react-hot-toast";
import Dropzone from "@/components/admin/Dropzone";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // States do formulário
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [category, setCategory] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transforma a string separada por vírgulas em um array de tecnologias
    const techArray = technologies.split(",").map(t => t.trim()).filter(Boolean);

    const newProject = {
      title,
      description,
      technologies: techArray,
      category,
      project_date: projectDate,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
      video_url: videoUrl || null,
      image_url: imageUrl || null
    };

    const { error } = await supabase.from("projects").insert([newProject]);
    
    if (error) {
      toast.error("Erro ao salvar projeto no banco");
      console.error(error);
    } else {
      toast.success("Projeto adicionado com sucesso!");
      // Limpa o formulário
      setTitle(""); setDescription(""); setTechnologies(""); setCategory(""); 
      setProjectDate(""); setGithubUrl(""); setLiveUrl(""); setVideoUrl(""); setImageUrl("");
      fetchProjects();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Adicionar Projeto</h1>
        
        <form onSubmit={handleCreate} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 backdrop-blur-sm">
          <div className="space-y-4">
            <input type="text" placeholder="Título do Projeto" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              
            <textarea placeholder="Descrição sobre o projeto e seus desafios" required value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition h-32 resize-none" />
              
            <input type="text" placeholder="Tecnologias (separe por vírgula. Ex: React, Node, Tailwind)" required value={technologies} onChange={(e) => setTechnologies(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />

            <div className="flex gap-4">
              <input type="text" placeholder="Categoria (Ex: Front-end, Full-stack)" required value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-1/2 bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
                
              <input type="date" required value={projectDate} onChange={(e) => setProjectDate(e.target.value)}
                className="w-1/2 bg-slate-950/50 text-slate-400 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
          </div>

          <div className="space-y-4">
            <input type="url" placeholder="URL do Repositório (GitHub)" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              
            <input type="url" placeholder="URL do Projeto Online (Deploy)" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              
             <Dropzone onUploadSuccess={(url) => setImageUrl(url)} label="Imagem de Capa do Projeto (JPG/PNG)" folder="projects" accept="image/*" />
             
             {imageUrl && <p className="text-blue-500 text-sm">Imagem anexada com sucesso!</p>}
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 transition w-full md:w-auto">
              Salvar Projeto
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Projetos Cadastrados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <p className="text-slate-400">Carregando...</p> : projects.map((project) => (
            <div key={project.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col">
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-slate-800/50 flex items-center justify-center">
                  <FolderKanban className="w-10 h-10 text-slate-600"/>
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-white">{project.title}</h3>
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center mt-auto">
                  <span className="text-blue-500 text-sm font-medium">{project.category}</span>
                  <button onClick={() => handleDelete(project.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
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