import { type Message, useChat } from 'ai/react'
import { cn } from '@/lib/utils'
import { ChatList } from '@/modules/chatbot/chat-ui/chat-list'
import { ChatPanel } from '@/modules/chatbot/chat-ui/chat-panel'
import { EmptyScreen } from '@/modules/chatbot/chat-ui/empty-screen'
import { ChatScrollAnchor } from '@/modules/chatbot/chat-ui/chat-scroll-anchor'
import { useRouter } from 'next/router'
import { useUser } from '@/lib/store/use-user'
import { useEffect, useRef } from 'react'
import { useLocalStorage, useSessionStorage } from 'usehooks-ts'
import { uuid } from 'uuidv4'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQuery } from '@supabase-cache-helpers/postgrest-swr'
import { convesationLogToInitialMessages } from '@/modules/chatbot/helpers'
import * as React from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  chatContainerClass?: string
}

export default function Chat({
  chatbot,
  id,
  className,
  chatContainerClass
}: ChatProps) {
  const {
    query: { chatbot_id }
  } = useRouter()

  const { toast } = useToast()

  const chatArea = useRef<any>()

  const supabase = useSupabaseClient()

  const [sessionId, setSessionId] = useLocalStorage('session-id', uuid())

  const { user } = useUser()

  useEffect(() => {
    if (user?.id) setSessionId(user?.id)
  }, [user])

  // @ts-ignore
  const { data: conversations = [], isLoading: isDataLoading } = useQuery(
    sessionId &&
      supabase
        .from('conversations')
        .select()
        .eq('session_id', sessionId)
        .eq('chatbot_id', chatbot_id)
        .order('created_at', { ascending: true }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const {
    messages = [],
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput
  } = useChat({
    api: '/api/chatbots/chat',
    id: sessionId,
    body: {
      sessionId: sessionId,
      chatbotId: chatbot_id
    },
    onResponse(response) {
      if (response.status === 401) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request. please try again'
        })
      }

    },
    initialMessages: convesationLogToInitialMessages(conversations) as Message[]
  })

  useEffect(() => {
    chatArea?.current?.scrollTo({
      top: chatArea?.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages?.length])

  return (
    <div className="flex">
      <div className={cn('pb-[200px] pt-4 md:pt-10', className || '')}>
        {messages.length ? (
          <div
            ref={chatArea}
            className={cn(
              'h-[50vh] w-full overflow-y-scroll',
              chatContainerClass || ''
            )}
          >
            <ChatList messages={messages} />
            <ChatScrollAnchor area={chatArea} trackVisibility={isLoading} />
          </div>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        chatArea={chatArea}
      />
    </div>
  )
}
