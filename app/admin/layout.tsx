"use client";

import Link from "next/link";
import { LayoutDashboard, FolderKanban, LogOut, Award, Cpu, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen text-slate-300 relative">
      {/* Fundo com Gradiente Global */}
      <div className="fixed inset-0 bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-20"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 backdrop-blur-md border-r border-slate-800 flex flex-col p-4 relative z-10">
        <div className="mb-8 p-2">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">MatheusQA Admin</h2>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800 p-3 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Início
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800 p-3 rounded-lg transition-colors">
            <FolderKanban className="w-5 h-5" /> Projetos
          </Link>
          <Link href="/admin/technologies" className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800 p-3 rounded-lg transition-colors">
            <Cpu className="w-5 h-5" /> Tecnologias
          </Link>
          <Link href="/admin/certifications" className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800 p-3 rounded-lg transition-colors">
            <Award className="w-5 h-5" /> Certificações
          </Link>
          <Link href="/admin/experience" className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800 p-3 rounded-lg transition-colors">
            <Briefcase className="w-5 h-5" /> Experiência
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 p-3 rounded-lg transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" /> Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}