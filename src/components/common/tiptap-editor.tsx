'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Table as TableIcon,
  CheckSquare,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'
import { Command, getSuggestionItems, renderContainer } from './slash-command'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

const lowlight = createLowlight(common)

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-h-[400px] object-contain',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Command.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderContainer,
          allow: ({ editor, range }) => {
            const from = range.from
            const $from = editor.state.doc.resolve(from)
            return $from.parent.type.name === 'paragraph' && from === $from.start()
          },
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const files = Array.from(event.dataTransfer.files)
          const images = files.filter(file => file.type.startsWith('image'))
          
          images.forEach(image => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const result = e.target?.result as string
              editor?.chain().focus().setImage({ src: result }).run()
            }
            reader.readAsDataURL(image)
          })
          return true
        }
        return false
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || [])
        const images = items.filter(item => item.type.startsWith('image'))
        
        if (images.length) {
          event.preventDefault()
          images.forEach(image => {
            const file = image.getAsFile()
            if (file) {
              const reader = new FileReader()
              reader.onload = (e) => {
                const result = e.target?.result as string
                editor?.chain().focus().setImage({ src: result }).run()
              }
              reader.readAsDataURL(file)
            }
          })
          return true
        }
        return false
      },
    },
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          editor.chain().focus().setImage({ src: result }).run()
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
  }

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex flex-wrap gap-2 bg-white [&_button]:text-zinc-700 [&_button:hover]:text-zinc-900">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`hover:bg-accent hover:text-accent-foreground text-zinc-700 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('strike') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('taskList') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('codeBlock') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('blockquote') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => addTable()}
          className={`hover:bg-accent hover:text-accent-foreground ${
            editor.isActive('table') ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <TableIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => addImage()}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 min-h-[300px] prose prose-sm sm:prose lg:prose-lg xl:prose-xl bg-white">
        <EditorContent 
          editor={editor} 
          className="min-h-[300px] focus:outline-none bg-white [&_p]:text-zinc-900 [&_h1]:text-zinc-900 [&_h2]:text-zinc-900 [&_h3]:text-zinc-900 [&_ul]:text-zinc-900 [&_ol]:text-zinc-900 [&_li]:text-zinc-900"
        />
      </div>
    </div>
  )
} 