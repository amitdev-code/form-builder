import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import './TextEditor.css';
import { Icon } from '@iconify/react/dist/iconify.js';

interface TextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSend?: (content: string) => void;
  onCancel?: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  className = '',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'text-editor-content',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const handleLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={`text-editor ${className}`}>
      <EditorContent editor={editor} />
      <div className="text-editor-toolbar flex items-center justify-between">
        <div className="toolbar-button-group flex items-center gap-2">
          <button
            type="button"
            className={`toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <strong>
              <Icon icon="mdi:format-bold" className="w-4 h-4" />
            </strong>
          </button>
          <button
            type="button"
            className={`toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <em>
              <Icon icon="mdi:format-italic" className="w-4 h-4" />
            </em>
          </button>
          <button
            type="button"
            className={`toolbar-button ${editor.isActive('underline') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
          >
            <u>
              <Icon icon="mdi:format-underline" className="w-4 h-4" />
            </u>
          </button>
          <button
            type="button"
            className={`toolbar-button ${editor.isActive('strike') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough (Ctrl+S)"
          >
            <s>
              <Icon icon="gravity-ui:strikethrough" className="w-4 h-4" />
            </s>
          </button>

          <div className="toolbar-separator"></div>

          <button
            type="button"
            className="toolbar-button"
            onClick={handleLink}
            title="Add link"
          >
            <Icon icon="mdi:link" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
