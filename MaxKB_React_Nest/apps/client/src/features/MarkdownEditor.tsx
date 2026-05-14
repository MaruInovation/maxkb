import MDEditor from "@uiw/react-md-editor";
import "./markdown.css";

type MarkdownEditorProps = {
	value: string;
	onChange: (value: string) => void;
};

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
	return (
		<div className="markdown-editor">
			<MDEditor
				value={value}
				onChange={(nextValue) => onChange(nextValue ?? "")}
				height={360}
				preview="edit"
			/>
		</div>
	);
}
