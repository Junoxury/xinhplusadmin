import { ReactNode } from 'react'
import { Editor, Range, Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import Suggestion from '@tiptap/suggestion'
import tippy from 'tippy.js'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Table as TableIcon,
  Image as ImageIcon,
} from 'lucide-react'

interface CommandItemProps {
  title: string
  description: string
  icon: ReactNode
}

interface CommandProps {
  editor: Editor
  range: Range
}

const slashCommandKey = new PluginKey('slash-command')

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: '제목 1',
      description: '큰 제목',
      icon: <Heading1 className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 1 })
          .run()
      },
    },
    {
      title: '제목 2',
      description: '중간 제목',
      icon: <Heading2 className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 2 })
          .run()
      },
    },
    {
      title: '글머리 기호',
      description: '글머리 기호 목록',
      icon: <List className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run()
      },
    },
    {
      title: '번호 매기기',
      description: '번호가 있는 목록',
      icon: <ListOrdered className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run()
      },
    },
    {
      title: '할 일 목록',
      description: '체크박스가 있는 목록',
      icon: <CheckSquare className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run()
      },
    },
    {
      title: '코드 블록',
      description: '코드를 위한 블록',
      icon: <Code className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
      },
    },
    {
      title: '인용구',
      description: '텍스트 인용',
      icon: <Quote className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run()
      },
    },
    {
      title: '표',
      description: '3x3 표 삽입',
      icon: <TableIcon className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3 })
          .run()
      },
    },
  ].filter((item) => {
    if (typeof query === 'string' && query.length > 0) {
      return item.title.toLowerCase().includes(query.toLowerCase())
    }
    return true
  })
}

const renderContainer = () => {
  let popup: any = null

  return {
    onStart: (props: { clientRect: () => DOMRect }) => {
      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: '',
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
        theme: 'light',
        animation: 'scale',
      })[0]
    },

    onUpdate: (props: { items: CommandItemProps[]; command: any }) => {
      const container = document.createElement('div')
      container.classList.add('p-1', 'bg-white', 'rounded-lg', 'shadow-lg', 'border')

      props.items.forEach((item: CommandItemProps) => {
        const button = document.createElement('button')
        button.className = 'flex items-center gap-2 w-full p-2 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded'

        const iconHtml = (() => {
          if (item.icon.type === Heading1) return '<path d="M4 12h16M4 6h16M4 18h16"/>'
          if (item.icon.type === Heading2) return '<path d="M4 12h8M4 6h16M4 18h16"/>'
          if (item.icon.type === List) return '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
          if (item.icon.type === ListOrdered) return '<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M4 18h1v-4M4 14h2"/>'
          if (item.icon.type === CheckSquare) return '<path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'
          if (item.icon.type === Code) return '<path d="m10 20-6-6 6-6M14 4l6 6-6 6"/>'
          if (item.icon.type === Quote) return '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>'
          if (item.icon.type === TableIcon) return '<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/>'
          return ''
        })()

        button.innerHTML = `
          <div class="flex items-center justify-center text-muted-foreground">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${iconHtml}
            </svg>
          </div>
          <div>
            <p class="font-medium">${item.title}</p>
            <p class="text-xs text-muted-foreground">${item.description}</p>
          </div>
        `

        button.addEventListener('click', () => {
          props.command(item)
          popup.hide()
        })

        container.appendChild(button)
      })

      popup.setContent(container)
    },

    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.hide()
        return true
      }
      return false
    },

    onExit: () => {
      popup?.destroy()
      popup = null
    },
  }
}

const Command = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
          props.command({ editor, range })
        },
        items: getSuggestionItems,
        render: renderContainer,
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          return $from.parent.type.name === 'paragraph'
        },
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: slashCommandKey,
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export { Command, getSuggestionItems, renderContainer } 