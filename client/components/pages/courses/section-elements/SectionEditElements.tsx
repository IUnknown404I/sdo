import { Box, SxProps } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';
import { SectionContentBlockTitle } from './SectionItems';

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
};

export function EditFieldsetTitleWrapper(props: {
	text: ComponentProps<typeof SectionContentBlockTitle>['text'];
	children: ReactNode;
}) {
	return (
		<EditFieldset styles={{ borderStyle: 'solid' }}>
			<EditFieldsetLegend>Заголовок</EditFieldsetLegend>
			{props.children}
		</EditFieldset>
	);
}

export function EditFieldset(props: { children: ReactNode | ReactNode[]; styles?: SxProps }) {
	return (
		<Box
			component='fieldset'
			sx={{
				width: '100%',
				position: 'relative',
				padding: '10px 4px',
				border: '1px dashed #c7c7c7',
				borderRadius: '7px',
				zIndex: 0,
				'&:hover': { zIndex: 1 },
				...props.styles,
			}}
		>
			{props.children}
		</Box>
	);
}

export function EditFieldsetLegend(props: { children: ReactNode; styles?: SxProps }) {
	return (
		<Box
			component='legend'
			sx={{
				position: 'relative',
				paddingInline: '.5rem',
				marginLeft: '.75rem',
				fontStyle: 'italic',
				fontSize: '.7rem',
				lineHeight: 1,
				color: 'grey',
				zIndex: 1,
				...props.styles,
			}}
		>
			{props.children}
		</Box>
	);
}
