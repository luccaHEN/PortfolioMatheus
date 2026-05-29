"use client";

import { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface DropzoneProps {
  onUploadSuccess: (url: string) => void;
  accept?: string;
  label?: string;
  folder?: string;
}

export default function Dropzone({ onUploadSuccess, accept = "image/*", label = "Clique ou arraste uma imagem aqui", folder = "projects" }: DropzoneProps) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from("portfolio-media").upload(filePath, file);

    if (error) {
      toast.error("Erro no upload do arquivo");
    } else {
      const { data } = supabase.storage.from("portfolio-media").getPublicUrl(filePath);
      onUploadSuccess(data.publicUrl);
      toast.success("Arquivo enviado!");
    }
    setUploading(false);
  };

  return (
    <div className="relative border-2 border-dashed border-zinc-700 rounded-xl p-8 hover:border-emerald-500 transition-colors flex flex-col items-center justify-center bg-zinc-950/50">
      {uploading ? <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" /> : <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />}
      <p className="text-sm text-zinc-400 text-center">
        {uploading ? "Enviando arquivo..." : label}
      </p>
      <input type="file" disabled={uploading} accept={accept} onChange={uploadFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
    </div>
  );
}