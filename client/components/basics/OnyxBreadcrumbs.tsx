import { Box, Stack, SxProps } from '@mui/material';
import React, { HTMLAttributeAnchorTarget } from 'react';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { OnyxTypography } from './OnyxTypography';

export interface BreadcrumbItem {
	href?: string;
	element: string | React.ReactElement;
	icon?: string | React.ReactElement;
	iconPosition?: 'start' | 'end';
	linkProps?: { target?: HTMLAttributeAnchorTarget; rel?: 'norefferer' | string };
}

/**
 * @IUnknown404I Corporative breadcrumbs element with build-in adaptivity and auto-changing max-elements-size duo to the viewport dimensions.
 * @param props an Object:
 * - itemlist: list of items to be processed as links { href: string, element: ReactElement, linkProps: BasicLinkProps };
 * - color: as mui-color declaration (secondary by default);
 * - fontSize: as string;
 * - separator: as ReactNode or string for the separating passed items.
 * @returns an ReactNode element.
 */
const OnyxBreacrumbs = (props: {
	itemList: BreadcrumbItem[];
	color?: 'secondary' | 'secondary' | string;
	fontSize?: string;
	separator?: string | React.ReactElement;
	sx?: SxProps;
}) => {
	const windowDimensions = useWindowDimensions();

	const breadcrumbsItems = React.useMemo(() => {
		let breadcrumbs: typeof props.itemList = [];
		if (!windowDimensions || windowDimensions.clientWidth >= 1200) {
			// if cant read the dimensions or its normal width
			props.itemList.length <= 3
				? (breadcrumbs = [...props.itemList])
				: props.itemList.forEach((item, index) => {
						if (index === 0 || index >= props.itemList.length - 2) breadcrumbs.push(item);
						if (index !== 0 && breadcrumbs.length === 1) breadcrumbs.push({ element: '...' });
				  });
		} else if (windowDimensions.clientWidth < 1200) {
			// for small viewports
			props.itemList.forEach((item, index) => {
				if (index === 0 || index === props.itemList.length - 1) breadcrumbs.push(item);
				if (index !== 0 && breadcrumbs.length === 1) breadcrumbs.push({ element: '...' });
			});
		}
		return breadcrumbs;
	}, [windowDimensions]);

	return (
		<Box component='nav' width='100%' sx={props.sx} aria-label='breadcrumbs'>
			<Stack
				component='ol'
				width='100%'
				direction='row'
				flexWrap='wrap'
				alignItems='center'
				justifyContent='flex-start'
				gap={1}
				sx={{ listStyleType: 'none' }}
			>
				{breadcrumbsItems.map((item, index) => (
					<>
						<Stack
							key={index}
							component='li'
							direction='row'
							width='fit-content'
							alignItems='center'
							justifyContent='center'
							aria-hidden={typeof item.element === 'string'}
							sx={{ svg: { fontSize: '1.15rem', color: theme => theme.palette.primary.main } }}
							gap={0.75}
						>
							{item.icon && item.iconPosition !== 'end' && item.icon}

							<OnyxTypography
								lkTitle='Перейти'
								lkHref={index !== props.itemList.length - 1 ? item.href : undefined}
								lkProps={item.linkProps}
								tpColor={props.color || 'secondary'}
								tpSize={
									!!windowDimensions && windowDimensions.clientWidth <= 800
										? '.85rem'
										: props.fontSize || '.9rem'
								}
							>
								{item.element}
							</OnyxTypography>

							{item.icon && !!item.iconPosition && item.iconPosition !== 'start' && item.icon}
						</Stack>

						{index !== breadcrumbsItems.length - 1 && (
							<li style={{ width: 'fit-content' }} aria-hidden={true}>
								<OnyxTypography
									tpColor={props.color || 'secondary'}
									tpSize={
										!!windowDimensions && windowDimensions.clientWidth <= 800
											? '.85rem'
											: props.fontSize || '.9rem'
									}
								>
									{props.separator || '>'}
								</OnyxTypography>
							</li>
						)}
					</>
				))}
			</Stack>
		</Box>
	);
};

export default OnyxBreacrumbs;
