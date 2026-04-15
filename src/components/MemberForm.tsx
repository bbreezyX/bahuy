/** @jsxImportSource react */
import { useRef, useState } from "react";
import { motion } from "motion/react";
import type { Member } from "@/data/members";

const ACCENT = "#C4A265";

export interface MemberFormData extends Omit<Partial<Member>, "avatar"> {
  avatar?: string | null;
  removeAvatar?: boolean;
}

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: MemberFormData, file?: File) => Promise<void>;
  onClose: () => void;
  isEditing?: boolean;
}

export default function MemberForm({ 
  member, 
  onSubmit, 
  onClose, 
  isEditing = false 
}: MemberFormProps) {
  const [formData, setFormData] = useState<Partial<Member>>({
    nickname: member?.nickname || "",
    name: member?.name || "",
    skills: member?.skills || [],
    city: member?.city || "",
    isLeader: member?.isLeader || false,
    bio: member?.bio || "",
  });

  const [skillsInput, setSkillsInput] = useState<string>(
    member?.skills?.join(", ") || ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(member?.avatar || null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : 
               type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    setFile(selectedFile);
    setRemoveAvatar(false);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveAvatar = () => {
    setFile(null);
    setPreviewUrl(null);
    setRemoveAvatar(Boolean(member?.avatar));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const skills = skillsInput.split(",").map(s => s.trim()).filter(Boolean);
    try {
      await onSubmit({ ...formData, skills, removeAvatar }, file || undefined);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="scrollbar-custom bg-[#0e1112] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-4xl tracking-wider">
              {isEditing ? "EDIT MEMBER" : "ADD NEW MEMBER"}
            </h2>
            <button 
              onClick={onClose}
              className="text-white/50 hover:text-white text-4xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Upload */}
            <div>
              <label className="block text-xs uppercase tracking-[0.125em] text-white/40 mb-3">PORTRAIT</label>
              <div className="flex items-center gap-6">
                <div 
                  className="w-32 h-44 rounded-2xl overflow-hidden border border-white/10 relative flex-shrink-0"
                  style={{ backgroundColor: `${ACCENT}22` }}
                >
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 text-6xl">📷</div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block cursor-pointer border border-dashed border-white/30 hover:border-white/60 rounded-2xl p-8 text-center transition-colors">
                    <div className="mx-auto w-9 h-9 rounded-full bg-white/5 flex items-center justify-center mb-3">
                      ↑
                    </div>
                    <div className="text-sm text-white/70">Click to upload portrait</div>
                    <div className="text-[10px] text-white/40 mt-1">JPG or PNG • max 2MB</div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                  </label>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {file && <p className="text-xs text-emerald-400">Selected: {file.name}</p>}
                    {(previewUrl || file || member?.avatar) && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="text-xs uppercase tracking-[0.18em] text-red-300 transition-colors hover:text-red-200"
                      >
                        Remove portrait
                      </button>
                    )}
                    {removeAvatar && !file && (
                      <p className="text-xs text-amber-300">Portrait will be removed when you save.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.125em] text-white/40 mb-2">NICKNAME</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  required
                  disabled={isEditing}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-primary/50 disabled:opacity-50"
                  placeholder="Bahuy"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.125em] text-white/40 mb-2">FULL NAME</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-primary/50"
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.125em] text-white/40 mb-2">CITY</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50"
                  placeholder="Jakarta"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.125em] text-white/40 mb-2">SKILLS</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50"
                  placeholder="Sniper, Long Range, IGL"
                />
                <p className="text-[10px] text-white/30 mt-1 pl-1">Comma-separated list of skills</p>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.125em] text-white/40 mb-2">BIO</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-5 py-4 resize-y focus:outline-none focus:border-primary/50"
                placeholder="Player description..."
              />
            </div>

            <div className="flex gap-6 pt-4 border-t border-white/10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isLeader"
                  checked={formData.isLeader}
                  onChange={handleInputChange as any}
                  className="w-5 h-5 accent-primary"
                />
                <span className="text-sm">Is Leader</span>
              </label>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 border border-white/20 hover:bg-white/5 rounded-2xl font-medium transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.nickname}
                className="flex-1 py-4 bg-primary hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-2xl transition-all uppercase tracking-widest text-sm"
              >
                {isSubmitting ? "SAVING..." : isEditing ? "UPDATE MEMBER" : "CREATE MEMBER"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
