"use client";
import {useEditor,EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {useState} from 'react';
export function LiteraryEditor({initial=""}:{initial?:string}){
 const [text,setText]=useState(initial);const [json,setJson]=useState("");
 const editor=useEditor({extensions:[StarterKit],immediatelyRender:false,content:{type:'doc',content:[{type:'paragraph',content:initial?[{type:'text',text:initial}]:[]}]},onUpdate:({editor})=>{setText(editor.getText({blockSeparator:'\n'}));setJson(JSON.stringify(editor.getJSON()));},editorProps:{attributes:{'aria-label':'Manuscript editor','role':'textbox','aria-multiline':'true'}}});
 return <div><div className="editor-toolbar" role="toolbar" aria-label="Literary formatting"><button type="button" onClick={()=>editor?.chain().focus().toggleBold().run()} aria-pressed={editor?.isActive('bold')||false}>Bold</button><button type="button" onClick={()=>editor?.chain().focus().toggleItalic().run()} aria-pressed={editor?.isActive('italic')||false}>Italic</button><button type="button" onClick={()=>editor?.chain().focus().toggleBlockquote().run()}>Quotation</button><button type="button" onClick={()=>editor?.chain().focus().setHardBreak().run()}>Line break</button></div><EditorContent editor={editor} className="editor-content"/><input type="hidden" name="content" value={text}/><input type="hidden" name="rich_content" value={json}/><p className="byline">Use Shift + Enter for a line break, Enter for a new stanza or paragraph.</p></div>;
}
