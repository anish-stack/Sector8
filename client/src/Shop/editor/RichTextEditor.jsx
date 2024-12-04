import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Undo,
  Redo,
  Text as Paragraph,
  Heading,

  Slash,
  Minus,
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const applyHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="border-b border-gray-200 p-2 flex gap-2 flex-wrap">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-100' : ''
        }`}
      >
        <Bold className="w-4 h-4" />
      </button>
      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-100' : ''
        }`}
      >
        <Italic className="w-4 h-4" />
      </button>
      {/* Strike */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('strike') ? 'bg-gray-100' : ''
        }`}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      {/* Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('code') ? 'bg-gray-100' : ''
        }`}
      >
        <Code className="w-4 h-4" />
      </button>
      {/* Clear Marks */}
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="p-2 rounded hover:bg-gray-100"
      >
        <Slash className="w-4 h-4" />
      </button>
      {/* Clear Nodes */}
      <button
        onClick={() => editor.chain().focus().clearNodes().run()}
        className="p-2 rounded hover:bg-gray-100"
      >
        <Minus className="w-4 h-4" />
      </button>
      {/* Paragraph */}
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('paragraph') ? 'bg-gray-100' : ''
        }`}
      >
        <Paragraph className="w-4 h-4" />
      </button>
      {/* Headings */}
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <button
          key={level}
          onClick={() => applyHeading(level)}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('heading', { level }) ? 'bg-gray-100' : ''
          }`}
        >
          <Heading className="w-4 h-4" />
          <span className="text-xs">{`H${level}`}</span>
        </button>
      ))}
      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bulletList') ? 'bg-gray-100' : ''
        }`}
      >
        <List className="w-4 h-4" />
      </button>
      {/* Ordered List */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('orderedList') ? 'bg-gray-100' : ''
        }`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      {/* Blockquote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('blockquote') ? 'bg-gray-100' : ''
        }`}
      >
        
        Blockquote
      </button>
      {/* Horizontal Rule */}
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded hover:bg-gray-100"
      >
        <Minus className="w-4 h-4" />
      </button>
      {/* Undo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <Undo className="w-4 h-4" />
      </button>
      {/* Redo */}
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
      />
      
    </div>
  );
};

export default RichTextEditor;
