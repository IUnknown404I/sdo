import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Box, Button, Stack } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import OnyxAlertModal from '../../../../basics/OnyxAlertModal';
import OnyxSpeedDial from '../../../../basics/OnyxSpeedDial';
import { EditFieldset, EditFieldsetLegend } from '../SectionEditElements';

// @ts-ignore
const CustomTextEditor = dynamic(() => import('../../../../editors/TextEditor'), {
	ssr: false,
});

export function SectionContentTextBlock(
	props: { content: string; children?: undefined } | { children: ReactNode | ReactNode[] },
) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const TextBlock = (
		<Box className='ck-content' sx={{ fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			{'content' in props ? <div dangerouslySetInnerHTML={{ __html: props.content }} /> : props.children}
		</Box>
	);

	return viewMode === 'observe' ? TextBlock : <EditFieldsetTextBlock>{TextBlock}</EditFieldsetTextBlock>;
}

export default SectionContentTextBlock;

function EditFieldsetTextBlock(props: { children: ReactNode | ReactNode[] }) {
	const [modalState, setModalState] = React.useState<boolean>(false);
	return (
		<EditFieldset styles={{ borderStyle: 'solid' }}>
			<EditFieldsetLegend>
				Текстовый блок
				<OnyxSpeedDial
					icon={<SettingsIcon />}
					blockElement
					disableOpenIcon
					disableBackdrop
					size='small'
					placement='top'
					itemsPlacement='right'
					ariaLabel='Container config'
					items={[{ name: 'Редактировать', icon: <EditIcon />, onClick: e => setModalState(true) }]}
					containerSx={{ position: 'absolute', right: '-27px', top: '-7px' }}
				/>
				<OnyxSpeedDial
					icon={<SwapVertIcon />}
					blockElement
					disableOpenIcon
					disableBackdrop
					size='small'
					placement='top'
					itemsPlacement='right'
					ariaLabel='Container movement'
					items={[
						{ name: 'Переместить вниз', icon: <ArrowDropDownIcon /> },
						{ name: 'Переместить вверх', icon: <ArrowDropUpIcon /> },
					]}
					containerSx={{ position: 'absolute', right: '-52px', top: '-7px' }}
				/>
				<OnyxSpeedDial
					icon={<ErrorIcon />}
					blockElement
					disableOpenIcon
					disableBackdrop
					size='small'
					placement='top'
					itemsPlacement='right'
					ariaLabel='Container movement'
					items={[
						{ name: 'Удалить элемент', icon: <DeleteForeverIcon color='error' /> },
						{ name: 'Дублировать элемент', icon: <ControlPointDuplicateIcon /> },
					]}
					containerSx={{ position: 'absolute', right: '-77px', top: '-7px' }}
				/>
			</EditFieldsetLegend>

			{props.children}

			<OnyxAlertModal
				state={modalState}
				setState={setModalState}
				title='Редактирование текстового блока'
				fullWidth
				disableButton
				disableCloseButton
				sx={{ minHeight: '500px' }}
			>
				<Box sx={{ minHeight: 450, marginBottom: '.5rem', border: '1px solid lightgray' }}>
					{/* @ts-ignore */}
					<CustomTextEditor content={getTestLectureText()} />
				</Box>
				<Stack width='100%' direction='row' justifyContent='flex-end' alignItems='center' gap={1.5}>
					<Button sx={{ paddingInline: '2.75rem' }} onClick={() => setModalState(false)} variant='contained'>
						Сохранить
					</Button>
					<Button sx={{ paddingInline: '1.75rem' }} onClick={() => setModalState(false)} variant='outlined'>
						Отменить
					</Button>
				</Stack>
			</OnyxAlertModal>
		</EditFieldset>
	);
}

export function getTestLectureText(): string {
	return `
    <b>Средства индивидуальной защиты (СИЗ)</b> — средства, используемые работником для
							предотвращения или уменьшения воздействия вредных и опасных производственных факторов, а
							также для защиты от загрязнения. Применяются в тех случаях,&nbsp;
							<i>
								когда безопасность работ не может быть обеспечена конструкцией оборудования,
								организацией производственных процессов, архитектурно-планировочными решениями и
								средствами коллективной защиты
							</i>
							.</br></br>
                            В соответствии с Трудовым кодексом Российской Федерации и санитарным законодательством, на
							работах с вредными и (или) опасными условиями труда, а также на работах, выполняемых в
							особых температурных условиях или связанных с загрязнением, работникам выдаются
							сертифицированные средства индивидуальной защиты, смывающие и обеззараживающие средства в
							соответствии с нормами, утвержденными в порядке, установленном Правительством Российской
							Федерации.
                            </br></br>
                            Приобретение, хранение, стирка, ремонт, дезинфекция и обеззараживание средств индивидуальной
							защиты работников осуществляется за счет средств работодателя.
                            </br></br>
                            Эффективное применение средств индивидуальной защиты предопределяется правильностью выбора
							конкретной марки, поддержание в исправном состоянии и степенью обученности персонала
							правилам их использования в соответствии с инструкциями по эксплуатации.
                            </br></br>
                            Важно отметить, что на каждом предприятии, где применяются средства индивидуальной защиты,
							должен быть назначен работник, в обязанности которого входит контроль за правильностью
							хранения, эксплуатацией и своевременным использованием средств защиты.
    `;
}
