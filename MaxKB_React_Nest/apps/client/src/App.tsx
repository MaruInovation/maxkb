import { useState } from "react";
import { MyButton } from "@/components/MyButton";
import { MarkdownEditor } from "@/features/MarkdownEditor";
import { MarkdownPreview } from "@/features/MarkdownPreview";

const initialMarkdown = `# MaxKB Markdown

\`\`\`ts
const message: string = "highlight.js works";
console.log(message);
\`\`\`

| Feature | Status |
| --- | --- |
| GFM | Ready |
| KaTeX | Ready |
`;

export default function App() {
	const [markdown, setMarkdown] = useState(initialMarkdown);

	return (
		<main>
			123123
			<MyButton>公共按钮</MyButton>
			<MarkdownEditor value={markdown} onChange={setMarkdown} />
			<MarkdownPreview source={markdown} />
		</main>
	);
}
