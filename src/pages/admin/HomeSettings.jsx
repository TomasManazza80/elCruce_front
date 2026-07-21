import React, { useState, useRef, useEffect } from 'react';
import Home from '../content/Home';
import { Save, Check, Loader2, X, Bold, Italic, Megaphone } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function HomeSettings() {
  const [content, setContent] = useState(null);
  const contentRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const infoRef = useRef(null);
  const promoRef = useRef(null);
  const activeRef = useRef(null);

  const emojis = ['🔥', '🥩', '🍖', '🔪', '🎁', '🎉', '⭐', '💯', '👇', '📍', '📱', '⏰'];

  const execCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    activeRef.current?.focus();
  };

  const insertEmoji = (emoji) => {
    document.execCommand('insertText', false, emoji);
    activeRef.current?.focus();
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    contentRef.current = newContent;
    setSaveSuccess(false); // Reset success state when editing
  };

  const handleSave = async (overrideContent) => {
    // Wait a brief moment to allow any pending onBlur events (which have a 150ms timeout) to update the state
    await new Promise(resolve => setTimeout(resolve, 200));

    const dataToSave = (overrideContent && !overrideContent.nativeEvent) ? overrideContent : contentRef.current;
    if (!dataToSave) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem('accessToken') || ''; // Adjust depending on auth setup
      const res = await fetch(`${apiUrl}/api/settings/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ homeContent: dataToSave })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Error al guardar los cambios.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-gray-900 overflow-x-hidden flex flex-col">
      {/* Live Preview Wrapper */}
      <div className="pointer-events-auto flex-grow">
        <Home editMode={true} homeContentData={content} onContentChange={handleContentChange} />
      </div>

      {/* Admin Toolbar (Bottom) */}
      <div className="w-full bg-black/80 backdrop-blur-md border-t border-white/20 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6 mt-8 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-bold tracking-widest">MODO EDICIÓN EN VIVO</span>
          </div>
          <div className="w-px h-6 bg-white/20 hidden md:block"></div>
          <p className="text-gray-300 text-xs hidden md:block">Haz clic en cualquier texto punteado para modificarlo.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPromoModalOpen(true)}
            className="bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-full text-sm font-bold tracking-wider flex items-center gap-2 transition-all"
          >
            <Megaphone className="w-4 h-4" />
            Editar Promo Superior
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
          className="bg-[#b91c1c] hover:bg-[#991b1b] text-white px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          ) : saveSuccess ? (
            <><Check className="w-4 h-4" /> ¡Guardado!</>
          ) : (
            <><Save className="w-4 h-4" /> Guardar Cambios</>
          )}
        </button>
        </div>
      </div>

      {/* Promo Edit Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#333]">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-[#b91c1c]" />
                Cartel de Promociones
              </h2>
              <button 
                onClick={() => setIsPromoModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-400 text-sm mb-4">
                Redacta el texto que aparecerá moviéndose en la parte superior de la web. Puedes usar negrita, cursiva y emojis para hacerlo destacar.
              </p>

              {/* Rich Text Toolbar */}
              <div className="flex items-center gap-4 bg-[#2a2a2a] p-2 rounded-t-xl border border-[#333] border-b-0">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => execCommand('bold')}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-[#444] rounded-lg font-serif font-bold text-xl transition-colors"
                    title="Negrita"
                  >
                    B
                  </button>
                  <button 
                    onClick={() => execCommand('italic')}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-[#444] rounded-lg font-serif italic text-xl transition-colors"
                    title="Cursiva"
                  >
                    I
                  </button>
                </div>
                <div className="w-px h-6 bg-[#444]"></div>
                <div className="flex items-center gap-1 flex-wrap">
                  {emojis.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => insertEmoji(emoji)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#444] rounded-lg text-2xl transition-all hover:scale-110"
                      title="Insertar Emoji"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Area - Horarios */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-bold mb-2">Información General / Horarios</label>
                <div 
                  ref={infoRef}
                  onFocus={() => activeRef.current = infoRef.current}
                  className="w-full min-h-[80px] bg-[#111] border border-[#333] border-t-0 p-4 text-white font-sans text-lg focus:outline-none focus:border-[#b91c1c] transition-colors overflow-y-auto"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  dangerouslySetInnerHTML={{ __html: content?.headerTopBarText || '' }}
                />
              </div>

              {/* Editable Area - Promos */}
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">Ofertas y Promociones</label>
                <div 
                  ref={promoRef}
                  onFocus={() => activeRef.current = promoRef.current}
                  className="w-full min-h-[80px] bg-[#111] border border-[#333] rounded-b-xl p-4 text-white font-sans text-lg focus:outline-none focus:border-[#b91c1c] transition-colors overflow-y-auto"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  dangerouslySetInnerHTML={{ __html: content?.headerPromoText || '' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-[#333] gap-4">
              <button 
                onClick={() => setIsPromoModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-gray-300 font-medium hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  const newContent = { ...content };
                  if (infoRef.current) newContent.headerTopBarText = infoRef.current.innerHTML;
                  if (promoRef.current) newContent.headerPromoText = promoRef.current.innerHTML;
                  handleContentChange(newContent);
                  setIsPromoModalOpen(false);
                  handleSave(newContent);
                }}
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-white px-8 py-2.5 rounded-xl font-bold tracking-wide transition-all shadow-lg"
              >
                Aplicar Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
