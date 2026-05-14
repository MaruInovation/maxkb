import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./MyButton.module.css";

export type ButtonVariant = "primary" | "secondary" | "text";
export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	fullWidth?: boolean;
	children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function joinClassNames(...classNames: Array<string | false | undefined>): string {
	return classNames.filter(Boolean).join(" ");
}

export function MyButton({
	variant = "primary",
	size = "medium",
	loading = false,
	fullWidth = false,
	disabled,
	className,
	children,
	type = "button",
	...buttonProps
}: ButtonProps) {
	const isDisabled = disabled || loading;

	return (
		<button
			{...buttonProps}
			className={joinClassNames(
				styles.button,
				styles[variant],
				styles[size],
				fullWidth && styles.fullWidth,
				loading && styles.loading,
				className,
			)}
			disabled={isDisabled}
			type={type}
		>
			{loading ? <span aria-hidden className={styles.spinner} /> : null}
			{children}
		</button>
	);
}
