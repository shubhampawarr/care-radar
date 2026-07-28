"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { NurseDocument } from "@/lib/supabase/nurse-queries";

type NurseDocumentUploadProps = {
  userId: string;
  initialDocuments: NurseDocument[];
  labels: {
    title: string;
    uploadButton: string;
    uploading: string;
    empty: string;
    verified: string;
    pending: string;
  };
};

export default function NurseDocumentUpload({
  userId,
  initialDocuments,
  labels,
}: NurseDocumentUploadProps) {
  const [documents, setDocuments] = useState<NurseDocument[]>(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const filePath = `${userId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("nurse-documents")
        .upload(filePath, file);

      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from("nurse-documents").getPublicUrl(filePath);

      const { data: insertedDoc, error: insertError } = await supabase
        .from("documents")
        .insert({
          user_id: userId,
          file_name: file.name,
          file_url: publicUrl,
          verified: false,
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      setDocuments((prev) => [insertedDoc as NurseDocument, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100 sm:p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
          <UploadCloud size={20} />
        </div>

        <label className="cursor-pointer rounded-full bg-[#08264a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#08a99d] sm:text-sm">
          {uploading ? labels.uploading : labels.uploadButton}
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </label>
      </div>

      <h2 className="mt-4 text-lg font-semibold tracking-tight text-[#061f3d] sm:text-xl">
        {labels.title}
      </h2>

      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      <div className="mt-5 space-y-2.5">
        {documents.length === 0 ? (
          <p className="text-sm text-slate-500">{labels.empty}</p>
        ) : (
          documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-[#f7fbff] p-3.5 transition hover:border-[#08a99d]/40"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText size={16} className="shrink-0 text-[#08a99d]" />
                <p className="truncate text-sm font-semibold text-[#08264a]">
                  {doc.file_name}
                </p>
              </div>

              {doc.verified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#08a99d]/20 bg-[#08a99d]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#087f77]">
                  <CheckCircle2 size={12} />
                  {labels.verified}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  <Clock size={12} />
                  {labels.pending}
                </span>
              )}
            </a>
          ))
        )}
      </div>
    </div>
  );
}