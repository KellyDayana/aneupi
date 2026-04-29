'use client';

import { useState, useRef, useEffect } from "react";
import { Send, Bot, MessageCircle, X, Play, FileText, Camera } from "lucide-react";
import ChatMessage from "./chatMessage";

// --- INTERFACES ---
interface Intent {
  id: number;
  label: string;
  name: string;
  keywords: string;
  active: boolean;
  response?: string;
}

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  contentType?: 'reproductor_tv' | 'formulario_entrevista' | 'formulario_noticia' | 'menu_opciones';
}

interface ChatBotProps {
  intencionesData: Intent[];
  botName?: string;
  onFormSubmit: (data: { 
    tipo: string, 
    usuario: string, 
    contenido: string, 
    correo?: string, 
    titulo?: string, 
    ubicacion?: string 
  }) => void;
}

// --- SUB-COMPONENTES VISUALES (WIDGETS) ---

const WidgetOpciones = ({ onOptionClick }: { onOptionClick: (val: string) => void }) => {
  const opciones = [
    { label: "📺 Ver TV en Vivo", value: "vivo" },
    { label: "📝 Agendar Entrevista", value: "entrevista" },
    { label: "📢 Publicar Noticia", value: "noticia" },
    { label: "📞 Publicar Denuncia", value: "denuncia" }
  ];

  return (
    <div className="ml-10 mt-2 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-left-2 max-w-[280px]">
      {opciones.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onOptionClick(opt.value)}
          className="bg-white border border-[#003952] text-[#003952] px-2 py-2 rounded-xl text-[10px] font-bold hover:bg-[#003952] hover:text-white transition-all shadow-sm active:scale-95 text-center flex items-center justify-center min-h-[40px]"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

const WidgetReproductorTV = () => (
  <div className="ml-10 mt-2 overflow-hidden rounded-xl border-2 border-[#003952] bg-black shadow-lg animate-in zoom-in duration-300">
    <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
      <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Stream" />
      <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded animate-pulse">EN VIVO</div>
      <div className="flex flex-col items-center z-10 text-center">
        <Play size={32} className="text-white mb-2 fill-white opacity-90" />
        <span className="text-white text-[10px] font-bold tracking-widest uppercase">TV ANEUPI STREAMING</span>
      </div>
    </div>
    <div className="bg-[#1A1A1A] p-2 flex justify-between items-center">
      <span className="text-[10px] text-gray-400 font-mono">SEÑAL HD 1080p</span>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
    <button className="w-full bg-[#003952] text-white py-2 text-[11px] font-bold hover:bg-[#00283d] transition-colors uppercase tracking-tighter">Haz clic para ver el en vivo</button>
  </div>
);

// --- FORMULARIO DE ENTREVISTA ACTUALIZADO ---
// --- WIDGET FORMULARIO ENTREVISTA ACTUALIZADO ---
const WidgetFormularioEntrevista = ({ onFormSubmit }: { onFormSubmit: (data: any) => void }) => {
  const [form, setForm] = useState({ remitente: '', correo: '', descripcion: '' });
  const [error, setError] = useState(false);

  const handleSend = () => {
    if(!form.remitente.trim() || !form.correo.trim() || !form.descripcion.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onFormSubmit({
        tipo: 'Entrevista',
        usuario: form.remitente,
        correo: form.correo, // Aseguramos que se envíe esta propiedad
        contenido: form.descripcion
    });
  };

  return (
    <div className="ml-10 mt-2 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-in slide-in-from-left-4">
      <div className="bg-[#003952] p-3 text-white flex items-center gap-2">
        <FileText size={14} /><span className="text-[11px] font-bold uppercase tracking-tight">Solicitud de Entrevista</span>
      </div>
      <div className="p-4 space-y-3 bg-gray-50/50">
        <input type="text" placeholder="Remitente (Nombre Completo)" value={form.remitente} onChange={(e) => setForm({...form, remitente: e.target.value})} className={`w-full p-2.5 bg-white border ${error && !form.remitente ? 'border-red-500' : 'border-gray-200'} rounded-lg text-xs outline-none focus:border-[#003952]`} />
        {/* Campo de Correo Electrónico */}
        <input type="email" placeholder="Correo electrónico de contacto" value={form.correo} onChange={(e) => setForm({...form, correo: e.target.value})} className={`w-full p-2.5 bg-white border ${error && !form.correo ? 'border-red-500' : 'border-gray-200'} rounded-lg text-xs outline-none focus:border-[#003952]`} />
        <textarea placeholder="Descripción del tema..." rows={3} value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} className={`w-full p-2.5 bg-white border ${error && !form.descripcion ? 'border-red-500' : 'border-gray-200'} rounded-lg text-xs outline-none focus:border-[#003952] resize-none`} />
        {error && <p className="text-[9px] text-red-500 font-bold animate-pulse">* Por favor, completa todos los campos.</p>}
        <button onClick={handleSend} className="w-full bg-[#003952] text-white py-2.5 rounded-lg text-[11px] font-bold transition-all active:scale-[0.98]">Enviar Datos</button>
      </div>
    </div>
  );
};

// --- WIDGET FORMULARIO NOTICIA ACTUALIZADO ---
const WidgetFormularioNoticia = ({ onFormSubmit }: { onFormSubmit: (msg: string, data: any) => void }) => {
  const [form, setForm] = useState({ remitente: '', correo: '', titulo: '', ubicacion: '', descripcion: '' });
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!form.remitente.trim() || !form.correo.trim() || !form.titulo.trim() || !form.ubicacion.trim() || !form.descripcion.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onFormSubmit(
        "✅ ¡Gracias! Nuestro personal revisará tu reporte y te daremos una respuesta lo antes posible.",
        form // Este objeto ahora incluye 'correo'
    );
  };

  return (
    <div className="ml-10 mt-2 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-in slide-in-from-left-4">
      <div className="bg-[#003952] p-3 text-white flex items-center gap-2"><Camera size={14} /><span className="text-[11px] font-bold uppercase tracking-tight">Publicar Noticia / Denuncia</span></div>
      <div className="p-4 space-y-3 bg-gray-50/50">
        <input type="text" placeholder="Nombre del Remitente" value={form.remitente} onChange={(e) => setForm({...form, remitente: e.target.value})} className={`w-full p-2.5 bg-white border ${error && !form.remitente ? 'border-red-500' : 'border-gray-200'} rounded-lg text-xs outline-none focus:border-[#003952]`} />
        {/* Nuevo campo de Correo para Noticias */}
        <input type="email" placeholder="Tu correo electrónico" value={form.correo} onChange={(e) => setForm({...form, correo: e.target.value})} className={`w-full p-2.5 bg-white border ${error && !form.correo ? 'border-red-500' : 'border-gray-200'} rounded-lg text-xs outline-none focus:border-[#003952]`} />
        <input type="text" placeholder="Título o tema central" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} className={`w-full p-2.5 bg-white border ${error && !form.titulo ? 'border-red-500' : 'border-gray-200'} rounded-lg text-xs outline-none focus:border-[#003952]`} />
        <input type="text" placeholder="Ubicación de los hechos" value={form.ubicacion} onChange={(e) => setForm({...form, ubicacion: e.target.value})} className={`w-full p-2.5 bg-white border ${error && !form.ubicacion ? 'border-red-500' : 'border-gray-200'} rounded-lg text-xs outline-none focus:border-[#003952]`} />
        <textarea placeholder="Describe lo ocurrido detalladamente..." rows={3} value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} className={`w-full p-2.5 bg-white border ${error && !form.descripcion ? 'border-red-500' : 'border-gray-200'} rounded-lg text-xs outline-none focus:border-[#003952] resize-none`} />
        {error && <p className="text-[9px] text-red-500 font-bold animate-pulse">* Por favor, completa todos los campos.</p>}
        <button onClick={handleSubmit} className="w-full bg-[#003952] text-white py-2.5 rounded-lg text-[11px] font-bold shadow-sm hover:brightness-110 active:scale-[0.98] transition-all">Enviar Reporte</button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

const ChatBot = ({ intencionesData, botName = "Chat bot TV Aneupi", onFormSubmit }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: `¡Bienvenido a TV ANEUPI! 👋\nSoy ${botName}, tu asistente virtual. Puedes preguntarme sobre la TV en vivo, noticias o escribir "información" para ver opciones.` },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const processResponse = (text: string) => {
    const inputLower = text.toLowerCase();
    let type: Message['contentType'] = undefined;
    let customBotText = "";

    const esInformacion = ["informacion", "información", "opciones", "ayuda", "menu", "menú"].some(k => inputLower.includes(k));

    if (esInformacion) {
      type = "menu_opciones";
      customBotText = "¡Claro! Aquí tienes las opciones principales para ayudarte:";
    } 
    else if (inputLower.includes("vivo") || inputLower.includes("señal") || inputLower.includes("streaming")) {
      type = "reproductor_tv";
    } else if (inputLower.includes("entrevista") || inputLower.includes("agendar")) {
      type = "formulario_entrevista";
    } else if (inputLower.includes("denuncia") || inputLower.includes("noticia") || inputLower.includes("publicar")) {
      type = "formulario_noticia";
    }

    const match = intencionesData.find(intent => 
      intent.active && intent.keywords.toLowerCase().split(',').some(k => inputLower.includes(k.trim()))
    );

    const finalBotText = esInformacion 
      ? customBotText 
      : (match ? (match.response || "Cargando respuesta...") : "No entiendo tu consulta, pero intenta con 'información' o 'vivo'.");

    const botMsg: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: finalBotText,
      contentType: type
    };

    setMessages(prev => [...prev, botMsg]);
  };

  const handleSend = (textOverride?: string) => {
    const text = textOverride || inputValue.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: "user", text }]);
    setInputValue("");
    setTimeout(() => processResponse(text), 800);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 bg-[#003952]">
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300 w-[350px] h-[520px]">
          <div className="p-4 text-white flex items-center gap-3 shrink-0" style={{ backgroundColor: "#003952" }}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10"><Bot size={22} /></div>
            <div className="min-w-0">
              <p className="font-bold text-[15px] leading-tight truncate">{botName}</p>
              <div className="flex items-center gap-1.5 mt-0.5"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span><span className="text-[10px] text-green-400 font-bold uppercase tracking-tighter">En línea ahora</span></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#f8fafc]">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                <ChatMessage sender={msg.sender} text={msg.text} />
                
                {msg.contentType === "menu_opciones" && (
                    <WidgetOpciones onOptionClick={(val) => handleSend(val)} />
                )}
                
                {msg.contentType === "reproductor_tv" && <WidgetReproductorTV />}
                
                {msg.contentType === "formulario_entrevista" && (
                  <WidgetFormularioEntrevista onFormSubmit={(formData) => {
                    setMessages(prev => [...prev, { id: Date.now(), sender: "bot", text: "✅ Solicitud enviada correctamente." }]);
                    
                    // Al pasar formData directamente, asegúrate de que el widget 
                    // incluya: { tipo, usuario, correo, contenido }
                    onFormSubmit({
                      ...formData,
                      tipo: 'Entrevista' // Forzamos el tipo por seguridad
                    });
                  }} />
                )}
                
                {msg.contentType === "formulario_noticia" && (
                  <WidgetFormularioNoticia onFormSubmit={(successMsg, formData) => {
                    setMessages(prev => [...prev, { id: Date.now(), sender: "bot", text: successMsg }]);
                    
                    onFormSubmit({
                      tipo: 'Noticia',
                      usuario: formData.remitente,
                      correo: formData.correo,
                      // Guardamos estos para el modal de detalles
                      titulo: formData.titulo,
                      ubicacion: formData.ubicacion,
                      // Concatenamos para que se vea bien en la vista previa de la tabla
                      contenido: `[${formData.titulo.toUpperCase()}] - DETALLE: ${formData.descripcion}`
                    });
                  }} />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t flex gap-2 items-center">
            <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleSend()} 
                placeholder="Escribe tu duda aquí..." 
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-[#003952] transition-all" 
            />
            <button 
                onClick={() => handleSend()} 
                className="p-2.5 rounded-full text-white shadow-md bg-[#003952] transition-transform active:scale-90"
            >
                <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;