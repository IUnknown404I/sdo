import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import React from 'react';
import logapp from '../../utils/logapp';

//props: { content: string, updateContent: (content: string) => void }
const TextEditor = props => {
	const editorRef = React.useRef();

	return (
		<CKEditor
			editor={Editor}
			config={getEditorConfiguration()}
			// data='<p>Текстовый редактор успешно инициализирован! <br/> Начните вводить данные.</p>'
			data={props?.content || '<p>Текстовый редактор успешно инициализирован! <br/> Начните вводить данные.</p>'}
			onReady={editor => {
				logapp.log('Editor is ready to use!', editor);

				// Insert the toolbar before the editable area.
				editor?.ui
					?.getEditableElement()
					?.parentElement?.insertBefore(
						editor.ui.view.toolbar.element,
						editor.ui.getEditableElement() === undefined ? null : editor.ui.getEditableElement(),
					);
				editorRef.current = editor;
			}}
			onError={(error, { willEditorRestart }) => {
				// If the editor is restarted, the toolbar element will be created once again.
				// The `onReady` callback will be called again and the new toolbar will be added.
				// This is why you need to remove the older toolbar.
				if (willEditorRestart) {
					editorRef.current?.ui?.view?.toolbar?.element?.remove();
				}
			}}
			// onChange={(event, editor) => {
			// 	const data = editor.getData();
			// 	logapp.log({ event, editor, data });
			// }}
			onBlur={(event, editor) => {
				const currentContent = editor.getData();
				if (!!props.updateContent && currentContent !== props.content) props.updateContent(currentContent);
				logapp.log('OnBlur new content save!');
			}}
			// onFocus={(event, editor) => {
			// 	logapp.log('Focus.', editor);
			// }}
		/>
	);
};

function getEditorConfiguration() {
	return {
		language: 'ru',
		toolbar: {
			items: [
				'heading',
				// 'style',
				'|',
				'fontSize',
				'fontFamily',
				'|',
				'fontColor',
				'fontBackgroundColor',
				'highlight',
				'|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'|',
				'numberedList',
				'bulletedList',
				'alignment',
				'|',
				'outdent',
				'indent',
				'|',
				'link',
				'blockQuote',
				'insertTable',
				'mediaEmbed',
				'|',
				'findAndReplace',
				// 'sourceEditing',
				'removeFormat',
				'|',
				'undo',
				'redo',
			],
			shouldNotGroupWhenFull: true,
		},
		image: {
			toolbar: [
				'imageTextAlternative',
				'toggleImageCaption',
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side',
			],
		},
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties'],
		},
	};
}

export default TextEditor;
