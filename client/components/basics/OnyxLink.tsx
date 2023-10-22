import Link, { LinkProps } from 'next/link';
import React from 'react';

/**
 * @IUnknown404I Corporate stylizated Link component.
 * @param payload as props for Next Link & fullwidth and blockElement [boolean] attribute for block-passed children elements.
 * @returns Link component.
 */
const OnyxLink = (
	payload: LinkProps &
		React.AnchorHTMLAttributes<HTMLAnchorElement> & { blockElement?: boolean; fullwidth?: boolean },
) => {
	let payloadCopy: typeof payload = { href: '' };
	for (const attribute in payload)
		try {
			payloadCopy[attribute as keyof typeof payload] = JSON.parse(
				JSON.stringify(payload[attribute as keyof typeof payload]),
			);
		} catch (e) {}
	if ('blockElement' in payloadCopy) delete payloadCopy.blockElement;
	if ('fullwidth' in payloadCopy) delete payloadCopy.fullwidth;

	return (
		<Link
			{...payloadCopy}
			href={payload.href}
			style={{
				color: 'inherit',
				display: payload.blockElement ? 'block' : '',
				...payload.style,
				width: payload.fullwidth ? '100%' : undefined,
			}}
		>
			{payload.children}
		</Link>
	);
};

export default OnyxLink;
