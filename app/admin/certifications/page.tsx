"use client";

// Página de Gerenciamento de Certificações
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Certification } from "@/types";
import { Trash2, FileText, Award, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import Dropzone from "@/components/admin/Dropzone";

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  // States do formulário
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("certifications").select("*").order("date", { ascending: false });
    if (error) toast.error("Erro ao carregar certificações");
    else setCertifications(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deletar certificação?")) return;
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) toast.error("Erro ao deletar");
    else {
      toast.success("Deletado com sucesso!");
      fetchCertifications();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const certData = {
      title,
      institution,
      hours: parseInt(hours) || 0,
      date,
      image_url: imageUrl,
      pdf_url: pdfUrl,
      description
    };

    let requestError;
    if (editingId) {
      const { error } = await supabase.from("certifications").update(certData).eq("id", editingId);
      requestError = error;
    } else {
      const { error } = await supabase.from("certifications").insert([certData]);
      requestError = error;
    }

    if (requestError) {
      toast.error("Erro ao salvar no banco");
    } else {
      toast.success(editingId ? "Certificação atualizada!" : "Certificação adicionada!");
      resetForm();
      fetchCertifications();
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setTitle(cert.title);
    setInstitution(cert.institution);
    setHours(String(cert.hours || ""));
    setDate(cert.date ? String(cert.date).split("T")[0] : "");
    setImageUrl(cert.image_url || "");
    setPdfUrl(cert.pdf_url || "");
    setDescription((cert as any).description || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle(""); setInstitution(""); setHours(""); setDate(""); setImageUrl(""); setPdfUrl(""); setDescription("");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">{editingId ? "Editar Certificação" : "Adicionar Certificação"}</h1>
        
        <form onSubmit={handleSubmit} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 backdrop-blur-sm">
          <div className="space-y-4">
            <input type="text" placeholder="Nome do Curso/Certificado" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              
            <input type="text" placeholder="Instituição (Ex: Udemy, Alura)" required value={institution} onChange={(e) => setInstitution(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              
            <div className="flex gap-4">
              <input type="number" placeholder="Carga horária (horas)" required value={hours} onChange={(e) => setHours(e.target.value)}
                className="w-1/2 bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
                
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="w-1/2 bg-slate-950/50 text-slate-400 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            
            <textarea placeholder="Descrição do Certificado (Opcional)" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/50 text-slate-300 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition h-32 resize-none" />
          </div>

          <div className="space-y-4">
             <Dropzone onUploadSuccess={(url) => setImageUrl(url)} label="1. Imagem de Capa (JPG/PNG)" folder="certifications" accept="image/*" />
             {imageUrl && (
               <div className="flex items-center justify-between bg-slate-800/50 px-4 py-2 mt-2 rounded-lg border border-slate-700">
                 <p className="text-blue-400 text-sm font-medium">Imagem anexada!</p>
                 <button type="button" onClick={() => setImageUrl("")} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Remover</button>
               </div>
             )}

             <Dropzone onUploadSuccess={(url) => setPdfUrl(url)} label="2. Arquivo do Certificado (PDF)" folder="certifications" accept="application/pdf" />
             {pdfUrl && (
               <div className="flex items-center justify-between bg-slate-800/50 px-4 py-2 mt-2 rounded-lg border border-slate-700">
                 <p className="text-blue-400 text-sm font-medium">PDF anexado!</p>
                 <button type="button" onClick={() => setPdfUrl("")} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Remover</button>
               </div>
             )}
          </div>

          <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 transition w-full md:w-auto">
              {editingId ? "Atualizar Certificação" : "Salvar Certificação"}
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
        <h2 className="text-2xl font-bold mb-6">Certificações Existentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <p className="text-slate-400">Carregando...</p> : certifications.map((cert) => (
            <div key={cert.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition">
              {cert.image_url ? <img src={cert.image_url} alt={cert.title} className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-slate-800/50 flex items-center justify-center"><Award className="w-10 h-10 text-slate-600"/></div>}
              <div className="p-5">
                <h3 className="font-bold text-lg">{cert.title}</h3>
                <p className="text-blue-500 text-sm mt-1">{cert.institution} • {cert.hours}h</p>
                <div className="mt-4 flex justify-between items-center">
                  {cert.pdf_url && <a href={cert.pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400 transition"><FileText className="w-4 h-4" /> Ver PDF</a>}
                  <div className="flex items-center gap-2 ml-auto">
                    <button onClick={() => handleEdit(cert)} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}