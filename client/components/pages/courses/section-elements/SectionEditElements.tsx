import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, SxProps } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';
import OnyxSpeedDial from '../../../basics/OnyxSpeedDial';
import { OnyxTypography } from '../../../basics/OnyxTypography';

export const configSxProps = (orderNumber: number = 1, configState: boolean = false): SxProps => ({
	top: '-6px',
	right: configState ? `-${(orderNumber + 1) * 17 + (orderNumber - 1) * 10}px` : '0',
	opacity: configState ? '1' : '0',
	position: 'absolute',
	transition: 'all .25s ease-out',
	'&:hover': { zIndex: 2 },
});

interface ISectionEditCofigButton {
	configState: boolean;
	setConfigState: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SectionEditCofigButton = (props: ISectionEditCofigButton) => {
	return (
		<OnyxTypography
			component='div'
			ttPlacement='top'
			ttFollow={false}
			ttNode={props.configState ? 'Свернуть опции' : 'Редактировать'}
			sx={{
				position: 'absolute',
				top: '-9px',
				right: '2px',
				width: 'fit-conent',
				'&:hover': { zIndex: 2 },
			}}
		>
			<Button onClick={() => props.setConfigState(prev => !prev)} sx={{ padding: 'unset', minWidth: 'unset' }}>
				<SettingsIcon
					sx={{
						fontSize: '1.75rem',
						transition: 'all .3s ease-out',
						color: props.configState ? 'gray' : undefined,
						transform: props.configState ? 'rotate(125deg)' : '',
					}}
				/>
			</Button>
		</OnyxTypography>
	);
};

export interface ISectionEditConfigSubDial {
	configState: boolean;
	items: ComponentProps<typeof OnyxSpeedDial>['items'];
	ariaLabel?: string;
	orderNumber?: number;
	icon?: ComponentProps<typeof OnyxSpeedDial>['icon'];
}

export const SectionEditConfigSubDial = (props: ISectionEditConfigSubDial) => {
	return (
		<OnyxSpeedDial
			icon={props.icon || <SettingsIcon />}
			blockElement
			disableOpenIcon
			disableBackdrop
			size='small'
			placement='top'
			itemsPlacement='right'
			ariaLabel={props.ariaLabel || 'Config options'}
			items={props.items}
			containerSx={configSxProps(props.orderNumber || 1, props.configState)}
		/>
	);
};

export const LINK_ITEM_MAP = {
	lecture: {
		href: '/images/courses/sections/abstract.png',
		width: '50px',
		hrefTitle: 'Перейти к лекции',
		fileType: 'Лекционные материалы',
	},
	course: {
		href: '/images/courses/sections/interactive.png',
		width: '200px',
		hrefTitle: 'Интерактивный курс',
		fileType: 'Веб-курс',
	},
	scorm: {
		href: '/images/courses/sections/scorm.png',
		width: '50px',
		hrefTitle: 'Интерактивная презентация',
		fileType: 'Scorm-пакет',
	},
	link: { href: '/images/courses/sections/link.png', width: '35px', hrefTitle: 'Перейти', fileType: 'Веб-ссылка' },
	pdf: {
		href: '/images/courses/sections/pdf.png',
		width: '50px',
		hrefTitle: 'Открыть документ',
		fileType: 'Pdf-документ',
	},
	ppt: {
		href: '/images/courses/sections/ppt.png',
		width: '50px',
		hrefTitle: 'Открыть презентацию',
		fileType: 'Ppt-презентация',
	},
	video: {
		href: '/images/courses/sections/video.png',
		width: '40px',
		hrefTitle: 'Перейти к видео',
		fileType: 'Видеофайл',
	},
	feedback: {
		href: '/images/courses/sections/feedback.png',
		width: '50px',
		hrefTitle: 'Заполнить анкету',
		fileType: 'Опросный лист',
	},
	webinar: {
		href: '/images/courses/sections/webinar.png',
		width: '50px',
		hrefTitle: 'Перейти к вебинару',
		fileType: 'Вебинар',
		target: '_blank',
	},
};

export function EditFieldset(props: { children: ReactNode | ReactNode[]; styles?: SxProps; onClick?: Function }) {
	return (
		<Box
			component='fieldset'
			sx={{
				width: '100%',
				position: 'relative',
				padding: '.75rem',
				border: '1px dashed #c7c7c7',
				borderRadius: '7px',
				zIndex: 0,
				'&:hover': { zIndex: '2 !important' },
				...props.styles,
			}}
			onClick={
				!!props.onClick
					? e => {
							e.stopPropagation();
							props.onClick!();
					  }
					: undefined
			}
		>
			{props.children}
		</Box>
	);
}

export function EditFieldsetLegend(props: { children: ReactNode; styles?: SxProps; onClick?: Function }) {
	return (
		<Box
			component='legend'
			sx={{
				position: 'relative',
				paddingInline: '.5rem',
				paddingRight: '32px',
				marginLeft: '.75rem',
				fontStyle: 'italic',
				fontSize: '.7rem',
				lineHeight: 1,
				color: 'grey',
				zIndex: 1,
				...props.styles,
			}}
			onClick={!!props.onClick ? () => props.onClick!() : undefined}
		>
			{props.children}
		</Box>
	);
}
