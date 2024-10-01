import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Button, Stack } from '@mui/material';
import router from 'next/router';
import React from 'react';
import { useTypedSelector } from '../../../../redux/hooks';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import ContentAddElemetModal from '../add-elements/ContentAddElemetModal';
import { SectionContentContainerOnlyType } from '../courseItemsTypes';
import SectionContentTextBlock from './EditFieldsetTextBlock/EditFieldsetTextBlock';
import SectionCardItem from './SectionCardItem/SectionCardItem';
import SectionContentContainer from './SectionContentContainer/SectionContentContainer';
import SectionContentDivider from './SectionContentDivider/SectionContentDivider';
import SectionContentDocumentItem from './SectionContentDocumentItem/SectionContentDocumentItem';
import SectionContentEmptyElement from './SectionContentEmptyElement/SectionContentEmptyElement';
import SectionContentHeader from './SectionContentHeader/SectionContentHeader';
import SectionContentImage from './SectionContentImage/SectionContentImage';
import SectionContentLectureItem from './SectionContentLectureItem/SectionContentLectureItem';
import SectionContentLinkItem from './SectionContentLinkItem/SectionContentLinkItem';
import SectionContentRowContainer from './SectionContentRowContainer/SectionContentRowContainer';
import { SectionContentSlideTransition } from './SectionItems';
import SectionScormItem from './SectionScormItem/SectionScormItem';

interface ISectionContent extends SectionContentContainerOnlyType {}

/**
 * @deprecated
 * @IUnknown404I In the full-version of the app the component will be presented as constructor with pool of preconfigured elements.
 * @returns Array of ReactNode elements as the content-section for the sections.
 */
const SectionContent = (props: Partial<ISectionContent>) => {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const [addModalState, setAddModalState] = React.useState<boolean>(false);

	return (
		<Stack
			gap={2}
			component='section'
			direction='column'
			sx={{ marginTop: '1rem' }}
			id={!!props.containerPickMode ? 'minified-section-content' : 'section-content'}
		>
			<SectionContentSlideTransition direction='left'>
				<SectionContentContainer
					csiid='hjlsad98234nhklklfd09213jkl'
					containerPickMode={props.containerPickMode}
				>
					<SectionContentRowContainer
						csiid='jjahgdsfibaysbduy23476gdyu21'
						containerPickMode={props.containerPickMode}
					>
						<SectionContentImage
							preview
							mdid='klhjahrh987234b98fhskj21h4r9821hi'
							skeleton={!!props.containerPickMode}
							styles={{ aligment: 'center' }}
							basis={50}
						/>
						<SectionContentTextBlock basis={50} skeleton={!!props.containerPickMode}>
							<OnyxTypography tpSize='1.1rem'>
								<b>Средства индивидуальной защиты (СИЗ)</b> — средства, используемые работником для
								предотвращения или уменьшения воздействия вредных и опасных производственных факторов, а
								также для защиты от загрязнения. Применяются в тех случаях,&nbsp;
								<i>
									когда безопасность работ не может быть обеспечена конструкцией оборудования,
									организацией производственных процессов, архитектурно-планировочными решениями и
									средствами коллективной защиты
								</i>
								.
							</OnyxTypography>
							<OnyxTypography tpSize='1.1rem'>
								В соответствии с Трудовым кодексом Российской Федерации и санитарным законодательством,
								на работах с вредными и (или) опасными условиями труда, а также на работах, выполняемых
								в особых температурных условиях или связанных с загрязнением, работникам выдаются
								сертифицированные средства индивидуальной защиты, смывающие и обеззараживающие средства
								в соответствии с нормами, утвержденными в порядке, установленном Правительством
								Российской Федерации.
							</OnyxTypography>
							<OnyxTypography tpSize='1.1rem'>
								Приобретение, хранение, стирка, ремонт, дезинфекция и обеззараживание средств
								индивидуальной защиты работников осуществляется за счет средств работодателя.
							</OnyxTypography>
						</SectionContentTextBlock>
					</SectionContentRowContainer>
				</SectionContentContainer>
			</SectionContentSlideTransition>

			<SectionContentEmptyElement skeleton={!!props.containerPickMode} />

			<SectionContentSlideTransition direction='left'>
				<SectionContentContainer
					csiid='lkashd09234gdskfn203jrlkejfd7f'
					containerPickMode={props.containerPickMode}
				>
					<SectionContentRowContainer
						containerPickMode={props.containerPickMode}
						csiid='jksdf9823rnfosfd02134'
					>
						<SectionContentLectureItem
							skeleton={!!props.containerPickMode}
							viewed
							basis={50}
							text='Лекция. Спецодежда'
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
						/>
						<SectionContentLectureItem
							skeleton={!!props.containerPickMode}
							viewed
							basis={50}
							text='Лекция. Спецобувь'
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
						/>
					</SectionContentRowContainer>
					<SectionContentRowContainer
						containerPickMode={props.containerPickMode}
						csiid='asdm2983uernfsuidh8723'
					>
						<SectionContentLectureItem
							skeleton={!!props.containerPickMode}
							viewed
							basis={50}
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
							text='Лекция. Дерматологические средства защиты'
						/>
						<SectionContentLectureItem
							skeleton={!!props.containerPickMode}
							basis={50}
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
							text='Лекция. Средства защиты органов дыхания, рук, головы, лица, органа слуха, глаз'
						/>
					</SectionContentRowContainer>
					<SectionContentRowContainer
						containerPickMode={props.containerPickMode}
						csiid='slfdkkjnf1293rmkdsf78321l'
					>
						<SectionContentLectureItem
							skeleton={!!props.containerPickMode}
							basis={50}
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
							text='Лекция. Средства защиты от падения с высоты'
						/>
						<SectionContentLectureItem
							skeleton={!!props.containerPickMode}
							basis={50}
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
							text='Лекция. Другие средства индивидуальной защиты'
						/>
					</SectionContentRowContainer>
				</SectionContentContainer>
			</SectionContentSlideTransition>

			<SectionContentDivider skeleton={!!props.containerPickMode} />

			<SectionContentSlideTransition>
				<SectionContentContainer csiid='jhsah21980hf873201kda8sd1h' containerPickMode={props.containerPickMode}>
					<SectionContentHeader
						skeleton={!!props.containerPickMode}
						title='Интерактивные курсы и презентации'
					/>
					<SectionContentContainer
						csiid='nnbvfuan9213nb7vn2wq04e21ml87'
						styles={{ elevation: 1 }}
						containerPickMode={props.containerPickMode}
					>
						<SectionContentRowContainer
							containerPickMode={props.containerPickMode}
							csiid='aslkdmn219034mnfzslfdsdaas87214'
						>
							<SectionCardItem
								basis={75}
								mdid='hbd834ebghsad8774eg21ejhbwa8d1'
								header='Интерактивная программа'
								text='Перейдите к интерактивному курсу и изучите учебный материал. Пройдите тестирование в рамках
						самоподготовки и переходите к следующим материалам программы.'
								href='https://ecology.rnprog.ru'
								target='_blank'
							/>

							<SectionContentContainer
								csiid='jhbsaduyb213984b282374gi214'
								containerPickMode={props.containerPickMode}
							>
								<SectionScormItem
									skeleton={!!props.containerPickMode}
									scid='hjkas724lf9s8askljbg432sadgbase7'
									type='storyline'
									text='Интерактивная презентация. Основы диспетчерского управления системами газоснабжения'
								/>
								<SectionScormItem
									skeleton={!!props.containerPickMode}
									scid='hsa3fewa2htyjdsdsfdtrhdsahfg7gafsf2'
									type='storyline'
									text='Интерактивная презентация. Мой Оффис - Таблицы'
								/>
								<SectionScormItem
									skeleton={!!props.containerPickMode}
									scid='hjsd7fyt39dsajhb276fg2gdsahfg732sad6'
									type='ispring'
									text='Интерактивная презентация. Общие сведения - ССофт:Сигнал'
								/>
							</SectionContentContainer>
						</SectionContentRowContainer>
					</SectionContentContainer>
				</SectionContentContainer>

				<SectionContentDivider skeleton={!!props.containerPickMode} />
			</SectionContentSlideTransition>

			<SectionContentSlideTransition>
				<SectionContentContainer csiid='asydgqbwudh98213njad71' containerPickMode={props.containerPickMode}>
					<SectionContentHeader
						skeleton={!!props.containerPickMode}
						title='Приказы, государственные стандарты и иные документы'
					/>
					<SectionContentRowContainer
						containerPickMode={props.containerPickMode}
						csiid='amdkhq87432921h32980f1jnflkmsaf0921'
					>
						<SectionContentDocumentItem
							docid='sfdjhhjk428fbdk9143nk1398yfb'
							skeleton={!!props.containerPickMode}
							viewed
							basis={50}
							fileSize={348}
							text='Приказ Минпромторга России от 27.05.2021 N 1934 "Об утверждении форм сертификата соответствия и декларации о соответствии и составов сведений, содержащихся в них"'
						/>
						<SectionContentDocumentItem
							docid='ksadjhfm284na0sj213iuh184ndfaanf821344'
							skeleton={!!props.containerPickMode}
							viewed
							basis={50}
							fileSize={512}
							text='Архив нормативной документации по организации проверки загрязнения на высоте'
						/>
					</SectionContentRowContainer>

					<SectionContentRowContainer
						containerPickMode={props.containerPickMode}
						csiid='af2398hdsjf2qoiruj190832udhajsfdh98321'
					>
						<SectionContentDocumentItem
							docid='ahynb324u24yanandb2d347189rh24'
							skeleton={!!props.containerPickMode}
							viewed
							basis={50}
							fileSize={810}
							text='Решение Коллегии Евразийской экономической комиссии от 25.12.2012 N 293 (ред. от 20.12.2022) "О единых формах сертификата соответствия и декларации о соответствии требованиям технических регламентов"'
						/>
						<SectionContentDocumentItem
							docid='kjshb824hjfdb823b18iuhf9fhb219484'
							skeleton={!!props.containerPickMode}
							basis={50}
							fileSize={177}
							text='ГОСТ 24297-2013 «Межгосударственный стандарт. Верификация закупленной продукции. Организация проведения и методы контроля»'
						/>
					</SectionContentRowContainer>

					<SectionContentRowContainer
						containerPickMode={props.containerPickMode}
						csiid='asdn18u2y34u10jdoiu321gfr1290ru'
					>
						<SectionContentDocumentItem
							docid='ubysdbnkj439nfms249xfmnsakjr2359'
							skeleton={!!props.containerPickMode}
							basis={100}
							fileSize={562}
							text='Приказ Минтруда России от 29.10.2021 N 767н "Об утверждении Единых типовых норм выдачи средств индивидуальной защиты и смывающих средств" (вступает в силу с 01.09.2023г)'
						/>
					</SectionContentRowContainer>
					{/* <SectionContentRowContainer
						containerPickMode={props.containerPickMode}
						csiid='asdn18u451y34u10jdoiu1231gfr1290ru'
					> */}
					<SectionContentDocumentItem
						docid='lbfsjd9234bafd2ld8sfjvcnb1239k'
						skeleton={!!props.containerPickMode}
						basis={100}
						fileSize={702}
						text='Выдаваемый документ при успешном прохождении профессиональной программы обучения'
					/>
					{/* </SectionContentRowContainer> */}
				</SectionContentContainer>
			</SectionContentSlideTransition>

			<SectionContentDivider skeleton={!!props.containerPickMode} />

			<SectionContentSlideTransition>
				<SectionContentContainer
					csiid='eyri1h43u19ie08mnfda9ascxSxasm'
					containerPickMode={props.containerPickMode}
				>
					<SectionContentHeader
						skeleton={!!props.containerPickMode}
						title='Дополнительные материалы к программе'
					/>

					<SectionContentRowContainer
						containerPickMode={props.containerPickMode}
						csiid='dsalfm12i3kdsfmn21034743kdsanr10'
					>
						<SectionContentLinkItem
							skeleton={!!props.containerPickMode}
							viewed
							linkType='video'
							text='Правила входного контроля СИЗ. Запись вебинара 02.10.23'
						/>
						<SectionContentLinkItem
							skeleton={!!props.containerPickMode}
							linkType='video'
							text='Правила входного контроля СИЗ. Запись вебинара 03.10.23'
						/>
					</SectionContentRowContainer>

					<SectionContentRowContainer
						containerPickMode={props.containerPickMode}
						csiid='sdmfrokj90321u4gfsdkmfn2187u31tr1eru1'
					>
						<SectionContentLinkItem
							skeleton={!!props.containerPickMode}
							linkType='link'
							text='Вводный инструктаж по работе с образовательной платформой'
						/>
						<SectionContentLinkItem
							skeleton={!!props.containerPickMode}
							linkType='link'
							text='Архив прошедших мероприятий'
						/>
					</SectionContentRowContainer>
				</SectionContentContainer>
			</SectionContentSlideTransition>

			<SectionContentEmptyElement skeleton={!!props.containerPickMode} />

			<SectionContentSlideTransition>
				<SectionContentContainer
					csiid='H2asdnba41IKS0DunasnD82b3s'
					containerPickMode={props.containerPickMode}
					styles={{ centered: true }}
				>
					<SectionContentHeader
						skeleton={!!props.containerPickMode}
						title='Отзыв о курсе по завершении программы'
						styles={{ fullwidth: false, borderWidth: 0 }}
					/>
					<SectionContentLinkItem
						skeleton={!!props.containerPickMode}
						basis={75}
						linkType='feedback'
						href='https://support.mrgeng.ru/outcome-training-program/'
						text='Оцените образовательную программу - анкета обратной связи'
					/>
				</SectionContentContainer>
			</SectionContentSlideTransition>

			{!props.containerPickMode && viewMode === 'editor' && (
				<>
					<Stack
						width='100%'
						direction='row'
						justifyContent='center'
						alignItems='center'
						gap={2}
						marginTop='.75rem'
					>
						<Button
							variant='text'
							size='small'
							color='success'
							onClick={() => setAddModalState(prev => !prev)}
						>
							<ControlPointIcon sx={{ fontSize: '2.25rem' }} />
							&nbsp; Добавить контейнер или разделитель
						</Button>
					</Stack>

					<ContentAddElemetModal
						state={addModalState}
						setState={setAddModalState}
						exclude={{ contentElements: true, cards: true, medias: true, text: true }}
					/>
				</>
			)}
		</Stack>
	);
};

export default SectionContent;
