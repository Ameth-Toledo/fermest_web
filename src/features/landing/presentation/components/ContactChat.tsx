import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../../../../lib/utils'
import { useSupportStore } from '../../../../core/store/useSupportStore'

interface ContactChatProps {
  open: boolean
  onClose: () => void
}

type From = 'bot' | 'user'
type Step = 'name' | 'email' | 'message' | 'done'

interface Message { from: From; text: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ContactChat = ({ open, onClose }: ContactChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [step, setStep]         = useState<Step>('name')
  const [typing, setTyping]     = useState(false)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)
  const addTicket               = useSupportStore(s => s.addTicket)

  const botReply = (text: string, delay = 750) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { from: 'bot', text }])
    }, delay)
  }

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      setMessages([{ from: 'bot', text: '¡Hola! 👋 ¿Cuál es tu nombre?' }])
      setStep('name')
      setInput('')
      setName('')
      setEmail('')
      setTyping(false)
      inputRef.current?.focus()
    }, 0)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const handleSend = () => {
    const text = input.trim()
    if (!text || typing || step === 'done') return

    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')

    if (step === 'name') {
      setName(text)
      setStep('email')
      botReply(`Hola, ${text}! ¿Cuál es tu correo electrónico para poder responderte?`)
    } else if (step === 'email') {
      if (!EMAIL_RE.test(text)) {
        botReply('Ese correo no parece válido. ¿Puedes verificarlo?', 500)
        return
      }
      setEmail(text)
      setStep('message')
      botReply('Perfecto. ¿En qué podemos ayudarte?')
    } else if (step === 'message') {
      setStep('done')
      addTicket({ name, email, message: text })
      botReply(`¡Gracias! Recibimos tu mensaje y nos pondremos en contacto contigo en ${email} pronto. 🙌`, 1000)
    }
  }

  const placeholder: Record<Step, string> = {
    name:    'Escribe tu nombre...',
    email:   'tu@correo.com',
    message: 'Escribe tu mensaje...',
    done:    'Conversación finalizada',
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm flex flex-col bg-neutral-950 border-l border-neutral-800 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800">
              <div className="relative flex-shrink-0">
                <img src="/assets/logo.svg" alt="Nich-Ká" className="w-8 h-8 object-contain" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border-2 border-neutral-950" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-none">Equipo Nich-Ká</p>
                <p className="text-xs text-green-400 mt-0.5">En línea</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={cn('flex items-end gap-2', msg.from === 'user' ? 'justify-end' : 'justify-start')}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {msg.from === 'bot' && (
                      <img src="/assets/logo.svg" alt="" className="w-5 h-5 object-contain flex-shrink-0 mb-0.5" />
                    )}
                    <div className={cn(
                      'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      msg.from === 'bot'
                        ? 'bg-neutral-800 text-neutral-200 rounded-bl-sm'
                        : 'bg-green-600 text-white rounded-br-sm'
                    )}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <motion.div
                    key="typing"
                    className="flex items-end gap-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <img src="/assets/logo.svg" alt="" className="w-5 h-5 object-contain flex-shrink-0 mb-0.5" />
                    <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                      {[0, 150, 300].map(delay => (
                        <span
                          key={delay}
                          className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-5 pt-3 border-t border-neutral-800 flex items-center gap-2">
              <input
                ref={inputRef}
                type={step === 'email' ? 'email' : 'text'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={step === 'done' || typing}
                placeholder={placeholder[step]}
                className={cn(
                  'flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600',
                  'bg-neutral-900 border border-neutral-800 outline-none',
                  'focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all duration-200',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || step === 'done' || typing}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ContactChat
