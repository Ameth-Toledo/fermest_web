import { create } from 'zustand'

export type TicketStatus = 'pending' | 'answered'

export interface TicketMessage {
  from: 'bot' | 'user' | 'agent'
  text: string
  createdAt: string
}

export interface SupportTicket {
  id: string
  name: string
  email: string
  message: string
  messages: TicketMessage[]
  status: TicketStatus
  createdAt: string
}

interface SupportStore {
  tickets: SupportTicket[]
  addTicket: (data: { name: string; email: string; message: string }) => void
  addReply: (ticketId: string, text: string) => void
  markAnswered: (ticketId: string) => void
}

const ago = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString()

const mock = (name: string, email: string, message: string, status: TicketStatus, minutesAgo: number): SupportTicket => {
  const now = ago(minutesAgo)
  return {
    id: crypto.randomUUID(),
    name, email, message, status,
    createdAt: now,
    messages: [
      { from: 'bot',  text: '¡Hola! 👋 ¿Cuál es tu nombre?',                                        createdAt: now },
      { from: 'user', text: name,                                                                     createdAt: now },
      { from: 'bot',  text: `Hola, ${name}! ¿Cuál es tu correo electrónico para poder responderte?`, createdAt: now },
      { from: 'user', text: email,                                                                    createdAt: now },
      { from: 'bot',  text: 'Perfecto. ¿En qué podemos ayudarte?',                                   createdAt: now },
      { from: 'user', text: message,                                                                  createdAt: now },
      { from: 'bot',  text: `¡Gracias! Recibimos tu mensaje y nos pondremos en contacto contigo en ${email} pronto. 🙌`, createdAt: now },
    ],
  }
}

const MOCK_TICKETS: SupportTicket[] = [
  mock('Luis Hernández', 'luis@cafetero.mx',  'No puedo iniciar sesión, me dice que las credenciales son incorrectas.', 'pending',  4),
  mock('Ana García',     'ana@finca.com',     'Al subir el reporte de fermentación me aparece un error 500.',           'pending',  17),
  mock('Roberto Jiménez','roberto@coop.org',  '¿Cómo configuro los umbrales de pH en los sensores?',                   'pending',  45),
  mock('María López',    'maria@cafegourmet.mx','El código de activación que me dieron no funciona.',                  'answered', 120),
  mock('Carlos Méndez',  'carlos@finca.mx',   'No veo la sección de gráficas en mi cuenta de estudiante.',             'answered', 300),
]

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: MOCK_TICKETS,

  addTicket: ({ name, email, message }) => {
    const now = new Date().toISOString()
    const ticket: SupportTicket = {
      id: crypto.randomUUID(),
      name,
      email,
      message,
      status: 'pending',
      createdAt: now,
      messages: [
        { from: 'bot',   text: '¡Hola! 👋 ¿Cuál es tu nombre?',                                         createdAt: now },
        { from: 'user',  text: name,                                                                      createdAt: now },
        { from: 'bot',   text: `Hola, ${name}! ¿Cuál es tu correo electrónico para poder responderte?`, createdAt: now },
        { from: 'user',  text: email,                                                                     createdAt: now },
        { from: 'bot',   text: 'Perfecto. ¿En qué podemos ayudarte?',                                    createdAt: now },
        { from: 'user',  text: message,                                                                   createdAt: now },
        { from: 'bot',   text: `¡Gracias! Recibimos tu mensaje y nos pondremos en contacto contigo en ${email} pronto. 🙌`, createdAt: now },
      ],
    }
    set(s => ({ tickets: [ticket, ...s.tickets] }))
  },

  addReply: (ticketId, text) => {
    const now = new Date().toISOString()
    set(s => ({
      tickets: s.tickets.map(t =>
        t.id === ticketId
          ? { ...t, status: 'answered', messages: [...t.messages, { from: 'agent', text, createdAt: now }] }
          : t
      ),
    }))
  },

  markAnswered: (ticketId) => {
    set(s => ({
      tickets: s.tickets.map(t => t.id === ticketId ? { ...t, status: 'answered' } : t),
    }))
  },
}))
