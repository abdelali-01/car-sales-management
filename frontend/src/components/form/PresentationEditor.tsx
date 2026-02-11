import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
    Bold, 
    Italic, 
    List, 
    ListOrdered, 
    Quote
} from 'lucide-react';
import Label from './Label';

interface PresentationEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function PresentationEditor({ value, onChange }: PresentationEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'list-disc pl-6 my-4'
                    }
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'list-decimal pl-6 my-4'
                    }
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic'
                    }
                }
            })
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[200px] p-4 focus:outline-none'
            }
        }
    });

    // Update editor content when value prop changes (for editing existing products)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
    }, [value, editor]);

    return (
        <div className='space-y-4'>
            <h5 className='font-semibold text-gray-800 dark:text-white'>Product Presentation</h5>
            <div className='p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg'>
                <div className='space-y-4'>
                    <div>
                        <Label className='font-semibold text-gray-400'>Presentation</Label>
                        <div className='border border-gray-200 dark:border-white/[0.05] rounded-lg overflow-hidden'>
                            <div className='flex items-center gap-2 p-2 border-b border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02] dark:text-white'>
                                <button
                                    type="button"
                                    onClick={() => editor?.chain().focus().toggleBold().run()}
                                    className={`p-1 hover:bg-gray-200 dark:hover:bg-white/[0.05] rounded ${editor?.isActive('bold') ? 'bg-gray-200 dark:bg-white/[0.05]' : ''}`}
                                    title="Bold"
                                >
                                    <Bold size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                                    className={`p-1 hover:bg-gray-200 dark:hover:bg-white/[0.05] rounded ${editor?.isActive('italic') ? 'bg-gray-200 dark:bg-white/[0.05]' : ''}`}
                                    title="Italic"
                                >
                                    <Italic size={18} />
                                </button>
                                <div className='w-px h-6 bg-gray-200 dark:bg-white/[0.05] mx-1'></div>
                                <button
                                    type="button"
                                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                    className={`p-1 hover:bg-gray-200 dark:hover:bg-white/[0.05] rounded ${editor?.isActive('bulletList') ? 'bg-gray-200 dark:bg-white/[0.05]' : ''}`}
                                    title="Bullet List"
                                >
                                    <List size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                    className={`p-1 hover:bg-gray-200 dark:hover:bg-white/[0.05] rounded ${editor?.isActive('orderedList') ? 'bg-gray-200 dark:bg-white/[0.05]' : ''}`}
                                    title="Numbered List"
                                >
                                    <ListOrdered size={18} />
                                </button>
                                <div className='w-px h-6 bg-gray-200 dark:bg-white/[0.05] mx-1'></div>
                                <button
                                    type="button"
                                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                                    className={`p-1 hover:bg-gray-200 dark:hover:bg-white/[0.05] rounded ${editor?.isActive('blockquote') ? 'bg-gray-200 dark:bg-white/[0.05]' : ''}`}
                                    title="Quote"
                                >
                                    <Quote size={18} />
                                </button>
                            </div>
                            <EditorContent editor={editor} className="min-h-[200px] p-4 dark:text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 