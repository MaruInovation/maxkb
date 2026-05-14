import MarkdownPreviewComponent from "@uiw/react-markdown-preview";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/atom-one-dark.css";
import "katex/dist/katex.min.css";
import "./markdown.css";

type MarkdownPreviewProps = {
	source: string;
};

export function MarkdownPreview({ source }: MarkdownPreviewProps) {
	return (
		<div className="markdown-preview">
			<MarkdownPreviewComponent
				source={source}
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeSanitize, rehypeKatex]}
			/>
		</div>
	);
}
