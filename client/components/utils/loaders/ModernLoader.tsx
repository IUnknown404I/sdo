import React, { CSSProperties } from 'react';

export interface ModernLoaderI {
	loading?: boolean;
	tripleLoadersMode?: boolean;
	centered?: boolean;
	size?: number;
	sizeUnit?: 'px' | 'em' | 'rem';
	color?: string;
	speedMultiplier?: 1;
	containerSx?: CSSProperties;
}

const DEFAULT_ICONMODE_SIZE = 50;
const DEFAULT_SIZE = 75;
const DEFAULT_UNIT = 'px';
const DEFAULT_COLOR = 'rgb(0, 111, 186)';

const flexCenteredStyles: CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'row',
	alignItems: 'center',
};

/**
 * @IUnknown404I This is a dynamic vortex Loader Element.
 * @param payload all attributes are optional:
 * - loading: default state for loader;
 * - tripleLoadersMode: returns three loaders different sizes for cases like full-page or big-element loading visualizing;
 * - centered: wraps the Loader with centered-styled div (no effect if tripleLoadersMode provided);
 * - size: initial sizes for classic Loader and Loaders for the tripleLoadersMode;
 * - sizeUnit: changing defaults 'px' to er or rem units for calculations;
 * - color: changes defaults color of the Loaders;
 * - speedMultiplier: changes default (1) value to provided;
 * - containerSx: override-css object for the container (will override styles of centered wrapper or tripleLoadersMode wrapper).
 * @returns the Cortex Loader Element.
 */
const ModernLoader = (payload: ModernLoaderI): JSX.Element | null => {
	const [invisible, setInvisible] = React.useState<boolean>(payload.loading === undefined ? false : payload.loading);
	const validSize = `${payload.size || DEFAULT_SIZE}${payload.sizeUnit || DEFAULT_UNIT}`;
	const wrapperStyle: CSSProperties = {
		position: 'relative',
		...flexCenteredStyles,
		display: 'inherit',
		width: validSize,
		height: validSize,
		opacity: invisible ? '0' : '1',
		transition: 'all .35s ease-out',
	};
	const centeredModeStyles: CSSProperties = {
		position: 'absolute',
		...flexCenteredStyles,
		width: '100%',
		padding: '.75rem',
		flexWrap: 'nowrap',
		gap: '.75rem',
	};

	const nodeStyle = (i: number): CSSProperties => {
		const size = payload.size || (payload.centered ? DEFAULT_SIZE : DEFAULT_ICONMODE_SIZE);
		const unit = payload.sizeUnit || DEFAULT_UNIT;
		const color = payload.color || DEFAULT_COLOR;
		const speedMultiplier = payload.speedMultiplier || 1;

		return {
			position: 'absolute',
			height: `${size * (1 - i / 10)}${unit}`,
			width: `${size * (1 - i / 10)}${unit}`,
			borderTop: `1px solid ${color}`,
			borderBottom: 'none',
			borderLeft: `1px solid ${color}`,
			borderRight: 'none',
			borderRadius: '100%',
			transition: '2s',
			top: `${i * 0.7 * 2.5}%`,
			left: `${i * 0.35 * 2.5}%`,
			animation: `ModernLoaderAnime ${1 / speedMultiplier}s ${(i * 0.2) / speedMultiplier}s infinite linear`,
		};
	};

	const Loader = (
		<span
			style={
				payload.containerSx && !(payload.centered || payload.tripleLoadersMode)
					? { ...wrapperStyle, ...payload.containerSx }
					: { ...wrapperStyle }
			}
		>
			<span style={nodeStyle(0)} />
			<span style={nodeStyle(1)} />
			<span style={nodeStyle(2)} />
			<span style={nodeStyle(3)} />
			<span style={nodeStyle(4)} />
		</span>
	);

	// used for soft appearance as the Loader appears behind the pages' content
	React.useEffect(() => {
		const timer = setTimeout(() => setInvisible(() => !payload.loading), 175);
		return () => clearTimeout(timer);
	}, [payload.loading]);

	if (payload.loading === false) return null;
	if (payload.tripleLoadersMode === true) {
		const subsPayload: Omit<ModernLoaderI, 'size' | 'tripleLoadersMode' | 'centered'> = JSON.parse(JSON.stringify(payload));
		if ('size' in subsPayload) delete subsPayload.size;
		if ('tripleLoadersMode' in subsPayload) delete subsPayload.tripleLoadersMode;
		if ('centered' in subsPayload) delete subsPayload.centered;

		return (
			<div style={{ ...centeredModeStyles, ...payload.containerSx }}>
				<ModernLoader loading={payload.loading} size={(payload.size || DEFAULT_SIZE) * 0.85} />
				<ModernLoader loading={payload.loading} size={(payload.size || DEFAULT_SIZE) * 1.25} />
				<ModernLoader loading={payload.loading} size={(payload.size || DEFAULT_SIZE) * 0.85} />
			</div>
		);
	}
	return !payload.centered ? Loader : <div style={{ ...centeredModeStyles, ...payload.containerSx }}> {Loader} </div>;
};

export default ModernLoader;
