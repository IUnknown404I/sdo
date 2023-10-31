import { Box, Button, List, ListItem, Stack, SxProps } from '@mui/material';
import React, { ComponentProps, HTMLAttributeAnchorTarget } from 'react';
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
	const [innerState, setInnerState] = React.useState<boolean>(false);

	const [breadcrumbsItems, innerBreadcrumbsItems] = React.useMemo(() => {
		let breadcrumbs: typeof props.itemList = [];
		let innerBreadcrumbs: typeof props.itemList = [];
		if (!windowDimensions || windowDimensions.clientWidth >= 1200) {
			// if cant read the dimensions or its normal width
			props.itemList.length <= 3
				? (breadcrumbs = [...props.itemList])
				: props.itemList.forEach((item, index) => {
						if (index === 0 || index >= props.itemList.length - 2) breadcrumbs.push(item);
						if (index !== 0 && breadcrumbs.length === 1) innerBreadcrumbs.push(item);
						// if (index !== 0 && breadcrumbs.length === 1) breadcrumbs.push({ element: '...' });
				  });
		} else if (windowDimensions.clientWidth < 1200) {
			// for small viewports
			props.itemList.forEach((item, index) => {
				if (index === 0 || index === props.itemList.length - 1) breadcrumbs.push(item);
				if (index !== 0 && breadcrumbs.length === 1) innerBreadcrumbs.push(item);
				// if (index !== 0 && breadcrumbs.length === 1) breadcrumbs.push({ element: '...' });
			});
		}
		return [breadcrumbs, innerBreadcrumbs];
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
				{breadcrumbsItems.map((crumb, index) => (
					<>
						<CrumbContent
							{...crumb}
							href={index !== breadcrumbsItems.length - 1 ? crumb.href : undefined}
							lkProps={crumb.linkProps}
							tpColor={props.color || 'secondary'}
							tpSize={
								!!windowDimensions && windowDimensions.clientWidth <= 800
									? '.85rem'
									: props.fontSize || '.9rem'
							}
						/>

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

						{index === 0 && !!innerBreadcrumbsItems.length && (
							<>
								<Button
									size='small'
									variant='text'
									sx={{ position: 'relative', minWidth: '25px' }}
									onClick={() => setInnerState(prev => !prev)}
								>
									...
									<List
										dense
										disablePadding
										sx={{
											display: innerState ? '' : 'none',
											position: 'absolute',
											top: '100%',
											left: '100%',
											widows: '100%',
											transition: 'all .25s',
											opacity: innerState ? '1' : '0',
											transform: 'translateX(-50%)',
											backgroundColor: theme =>
												theme.palette.mode === 'light'
													? 'rgba(255,255,255,.85)'
													: 'rgba(29,43,58, .9)',
											border: '1px solid lightgray',
											borderRadius: '8px',
											gap: '.25rem',
										}}
									>
										{innerBreadcrumbsItems.map((crumb, index) => (
											<ListItem
												key={index}
												disablePadding
												sx={{
													padding: '.5rem',
													display: 'flex',
													gap: '.5rem',
													whiteSpace: 'nowrap',
													textTransform: 'none',
													svg: { fontSize: '1.35rem' },
												}}
											>
												<CrumbContent
													{...crumb}
													lkHref={
														index !== props.itemList.length - 1 ? crumb.href : undefined
													}
													lkProps={crumb.linkProps}
													tpColor={'primary'}
													tpSize={
														!!windowDimensions && windowDimensions.clientWidth <= 800
															? '.85rem'
															: props.fontSize || '.9rem'
													}
												/>
											</ListItem>
										))}
									</List>
								</Button>

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
							</>
						)}
					</>
				))}
			</Stack>
		</Box>
	);
};

function CrumbContent(crumb: BreadcrumbItem & ComponentProps<typeof OnyxTypography>) {
	return (
		<OnyxTypography
			component='p'
			aria-hidden={typeof crumb.element === 'string'}
			lkTitle='Перейти'
			lkHref={crumb.href}
			lkProps={crumb.linkProps}
			tpColor={crumb.tpColor || 'secondary'}
			tpSize={crumb.tpSize}
			sx={{
				width: 'fit-content',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '.5rem',
				svg: { fontSize: '1.15rem', color: theme => theme.palette.primary.main },
			}}
		>
			{crumb.icon && crumb.iconPosition !== 'end' && crumb.icon}
			{crumb.icon && crumb.iconPosition !== 'end' && typeof crumb.icon === 'string' && <>&nbsp;</>}

			{crumb.element}

			{crumb.icon && !!crumb.iconPosition && crumb.iconPosition !== 'start' && typeof crumb.icon === 'string' && (
				<>&nbsp;</>
			)}
			{crumb.icon && !!crumb.iconPosition && crumb.iconPosition !== 'start' && crumb.icon}
		</OnyxTypography>
	);
}

export default OnyxBreacrumbs;
