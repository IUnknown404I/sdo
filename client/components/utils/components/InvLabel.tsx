export const InvisibleLabel = (props: {
    htmlFor: string,
    style?: React.CSSProperties,
}) => {
	return (
		<label htmlFor={props.htmlFor} style={{ opacity: '0', width: '0', height: '0', margin: '-.5rem 0', padding: '0', ...props.style }} />
	);
};
