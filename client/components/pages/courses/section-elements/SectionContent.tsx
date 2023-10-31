import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Button, List, ListItem, Stack } from '@mui/material';
import router from 'next/router';
import React from 'react';
import { useTypedSelector } from '../../../../redux/hooks';
import OnyxLink from '../../../basics/OnyxLink';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import ContentAddElemetModal from '../config-elements/ContentAddElemetModal';
import SectionContentTextBlock from './EditFieldsetTextBlock/EditFieldsetTextBlock';
import SectionContentContainer from './SectionContentContainer/SectionContentContainer';
import SectionContentDivider from './SectionContentDivider/SectionContentDivider';
import SectionContentDocumentItem from './SectionContentDocumentItem/SectionContentDocumentItem';
import SectionContentEmptyElement from './SectionContentEmptyElement/SectionContentEmptyElement';
import SectionContentHeader from './SectionContentHeader/SectionContentHeader';
import SectionContentLectureItem from './SectionContentLectureItem/SectionContentLectureItem';
import SectionContentLinkItem from './SectionContentLinkItem/SectionContentLinkItem';
import SectionContentRowContainer from './SectionContentRowContainer/SectionContentRowContainer';
import { CourseSectionItemFooter, SectionContentSlideTransition } from './SectionItems';
import SectionScormItem from './SectionScormItem/SectionScormItem';

/**
 * @deprecated
 * @IUnknown404I In the full-version of the app the component will be presented as constructor with pool of preconfigured elements.
 * @returns Array of ReactNode elements as the content-section for the sections.
 */
const SectionContent = () => {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const [addModalState, setAddModalState] = React.useState<boolean>(false);

	return (
		<Stack id='section-content' component='section' direction='column' gap={2} sx={{ marginTop: '1rem' }}>
			<SectionContentSlideTransition direction='left'>
				<SectionContentContainer>
					<SectionContentTextBlock>
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
							В соответствии с Трудовым кодексом Российской Федерации и санитарным законодательством, на
							работах с вредными и (или) опасными условиями труда, а также на работах, выполняемых в
							особых температурных условиях или связанных с загрязнением, работникам выдаются
							сертифицированные средства индивидуальной защиты, смывающие и обеззараживающие средства в
							соответствии с нормами, утвержденными в порядке, установленном Правительством Российской
							Федерации.
						</OnyxTypography>
						<OnyxTypography tpSize='1.1rem'>
							Приобретение, хранение, стирка, ремонт, дезинфекция и обеззараживание средств индивидуальной
							защиты работников осуществляется за счет средств работодателя.
						</OnyxTypography>
						<OnyxTypography tpSize='1.1rem'>
							Эффективное применение средств индивидуальной защиты предопределяется правильностью выбора
							конкретной марки, поддержание в исправном состоянии и степенью обученности персонала
							правилам их использования в соответствии с инструкциями по эксплуатации.
						</OnyxTypography>
						<OnyxTypography tpSize='1.1rem'>
							Важно отметить, что на каждом предприятии, где применяются средства индивидуальной защиты,
							должен быть назначен работник, в обязанности которого входит контроль за правильностью
							хранения, эксплуатацией и своевременным использованием средств защиты.
						</OnyxTypography>
					</SectionContentTextBlock>
				</SectionContentContainer>
			</SectionContentSlideTransition>

			<SectionContentEmptyElement />

			<SectionContentSlideTransition direction='left'>
				<SectionContentContainer>
					<SectionContentRowContainer>
						<SectionContentLectureItem
							viewed
							basis={50}
							text='Лекция. Спецодежда'
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
						/>
						<SectionContentLectureItem
							viewed
							basis={50}
							text='Лекция. Спецобувь'
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
						/>
					</SectionContentRowContainer>
					<SectionContentRowContainer>
						<SectionContentLectureItem
							viewed
							basis={50}
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
							text='Лекция. Дерматологические средства защиты'
						/>
						<SectionContentLectureItem
							basis={50}
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
							text='Лекция. Средства защиты органов дыхания, рук, головы, лица, органа слуха, глаз'
						/>
					</SectionContentRowContainer>
					<SectionContentRowContainer>
						<SectionContentLectureItem
							basis={50}
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
							text='Лекция. Средства защиты от падения с высоты'
						/>
						<SectionContentLectureItem
							basis={50}
							href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=ysjKhfvbOMzcesA`}
							text='Лекция. Другие средства индивидуальной защиты'
						/>
					</SectionContentRowContainer>
				</SectionContentContainer>
			</SectionContentSlideTransition>

			<SectionContentDivider />

			<SectionContentSlideTransition>
				<SectionContentContainer>
					<SectionContentHeader title='Интерактивные курсы и презентации' />
					<SectionContentContainer styles={{ elevation: 3 }}>
						<SectionContentRowContainer alignItems='center'>
							<OnyxTypography
								ttNode='Перейти к интерактивному курсу'
								sx={{ flexBasis: '25%', display: 'flex', alignItems: 'center' }}
							>
								<OnyxLink
									href='https://ecology.rnprog.ru'
									target='_blank'
									style={{ width: 'fit-content', marginInline: 'auto' }}
								>
									<Button
										variant='contained'
										sx={{
											flexDirection: 'column',
											alignItems: 'center',
											borderRadius: '15px',
											paddingInline: '1.5rem',
											gap: '.75rem',
										}}
									>
										<img
											alt='Interactive course icon'
											src='/images/courses/sections/interactive.png'
											style={{ width: '175px' }}
										/>
										<OnyxTypography text='Интерактивный курс' tpSize='.8rem' tpColor='white' />
									</Button>
								</OnyxLink>
							</OnyxTypography>

							<OnyxTypography component='div' sx={{ flexBasis: '100%' }}>
								Для освоения интерактивного курса вам необходимо:
								<List
									component='ol'
									sx={{
										fontSize: '1rem',
										li: { padding: '.25rem', paddingLeft: '1.5rem' },
									}}
								>
									<ListItem>
										<OnyxTypography
											text='1. Перейти по ссылке к интерактивному курсу;'
											tpWeight='bold'
											lkHref='https://ecology.rnprog.ru'
											lkProps={{ target: '_blank' }}
											ttNode='Интерактивный курс'
											sx={{ fontSize: 'inherit' }}
										/>
									</ListItem>
									<ListItem>
										<b>2. Ввести кодовое слово;</b>
									</ListItem>
									<ListItem>
										3. Изучить структурированный учебный материал, взимодействуя с активными
										элементами (кнопки, окна, вкладки и пр.);
									</ListItem>
									<ListItem>
										4. Пройти тестирование в рамках самоподготовки (количество попыток не
										ограничено);
									</ListItem>
									<ListItem>
										5. При успешном выполнении всех заданий перейти к следующему разделу.
									</ListItem>
								</List>
							</OnyxTypography>
						</SectionContentRowContainer>
						<CourseSectionItemFooter viewed />
					</SectionContentContainer>

					<SectionContentRowContainer>
						<SectionScormItem
							scid='hjkas724lf9s8askljbg432sadgbase7'
							type='storyline'
							text='Интерактивная презентация. Основы диспетчерского управления системами газоснабжения'
						/>
					</SectionContentRowContainer>
					<SectionContentRowContainer>
						<SectionScormItem
							scid='hsa3fewa2htyjdsdsfdtrhdsahfg7gafsf2'
							type='storyline'
							text='Интерактивная презентация. Мой Оффис - Таблицы'
						/>
						<SectionScormItem
							scid='hjsd7fyt39dsajhb276fg2gdsahfg732sad6'
							type='ispring'
							text='Интерактивная презентация. Общие сведения - ССофт:Сигнал'
						/>
					</SectionContentRowContainer>
				</SectionContentContainer>

				<SectionContentDivider />
			</SectionContentSlideTransition>

			<SectionContentSlideTransition>
				<SectionContentContainer>
					<SectionContentHeader title='Приказы, государственные стандарты и иные документы' />
					<SectionContentRowContainer>
						<SectionContentDocumentItem
							viewed
							basis={50}
							fileSize={348}
							type='pdf'
							href={`/courses/${router.query.cid}/${router.query.csid}/document?csdid=ysjKhfvbOMzcesA`}
							text='Приказ Минпромторга России от 27.05.2021 N 1934 "Об утверждении форм сертификата соответствия и декларации о соответствии и составов сведений, содержащихся в них"'
						/>
						<SectionContentDocumentItem
							viewed
							basis={50}
							fileSize={512}
							type='pdf'
							href={`/courses/${router.query.cid}/${router.query.csid}/document?csdid=ysjKhfvbOMzcesA`}
							text='Приказ Минтруда России от 09.12.2014 N 997н "Об утверждении Типовых норм бесплатной выдачи специальной одежды, специальной обуви и других средств индивидуальной защиты работникам..."'
						/>
					</SectionContentRowContainer>

					<SectionContentRowContainer>
						<SectionContentDocumentItem
							viewed
							basis={50}
							fileSize={810}
							type='excel'
							href={`/courses/${router.query.cid}/${router.query.csid}/document?csdid=ysjKhfvbOMzcesA`}
							text='Решение Коллегии Евразийской экономической комиссии от 25.12.2012 N 293 (ред. от 20.12.2022) "О единых формах сертификата соответствия и декларации о соответствии требованиям технических регламентов"'
						/>
						<SectionContentDocumentItem
							basis={50}
							fileSize={177}
							type='word'
							href={`/courses/${router.query.cid}/${router.query.csid}/document?csdid=ysjKhfvbOMzcesA`}
							text='ГОСТ 24297-2013 «Межгосударственный стандарт. Верификация закупленной продукции. Организация проведения и методы контроля»'
						/>
					</SectionContentRowContainer>

					<SectionContentRowContainer>
						<SectionContentDocumentItem
							basis={100}
							fileSize={562}
							type='ppt'
							target='_blank'
							href={`/courses/${router.query.cid}/${router.query.csid}/document?csdid=ysjKhfvbOMzcesA`}
							text='Приказ Минтруда России от 29.10.2021 N 767н "Об утверждении Единых типовых норм выдачи средств индивидуальной защиты и смывающих средств" (вступает в силу с 01.09.2023г)'
						/>
					</SectionContentRowContainer>
				</SectionContentContainer>
			</SectionContentSlideTransition>

			<SectionContentDivider />

			<SectionContentSlideTransition>
				<SectionContentContainer>
					<SectionContentHeader title='Дополнительные материалы к программе' />

					<SectionContentRowContainer>
						<SectionContentLinkItem
							viewed
							type='video'
							text='Правила входного контроля СИЗ. Запись вебинара 02.10.23'
						/>
						<SectionContentLinkItem
							type='video'
							text='Правила входного контроля СИЗ. Запись вебинара 03.10.23'
						/>
					</SectionContentRowContainer>

					<SectionContentRowContainer>
						<SectionContentLinkItem
							type='link'
							text='Вводный инструктаж по работе с образовательной платформой'
						/>
						<SectionContentLinkItem type='link' text='Архив прошедших мероприятий' />
					</SectionContentRowContainer>
				</SectionContentContainer>
			</SectionContentSlideTransition>

			<SectionContentDivider />

			<SectionContentSlideTransition>
				<SectionContentContainer>
					<SectionContentHeader title='Отзыв о курсе по завершении программы' />
					<SectionContentLinkItem
						basis={75}
						type='feedback'
						href='https://support.mrgeng.ru/outcome-training-program/'
						text='Оцените образовательную программу - анкета обратной связи'
					/>
				</SectionContentContainer>
			</SectionContentSlideTransition>

			{viewMode === 'editor' && (
				<>
					<Stack width='100%' direction='row' justifyContent='center' alignItems='center' gap={2}>
						<OnyxTypography
							component='div'
							ttFollow={false}
							ttPlacement='top'
							ttNode='Добавить элемент в контейнер'
							sx={{ marginTop: '.5rem', width: 'fit-content' }}
						>
							<Button
								variant='text'
								size='small'
								color='success'
								onClick={() => setAddModalState(prev => !prev)}
							>
								<ControlPointIcon sx={{ fontSize: '2.25rem' }} />
								&nbsp; Добавить контейнер
							</Button>
						</OnyxTypography>

						<OnyxTypography
							component='div'
							ttFollow={false}
							ttPlacement='top'
							ttNode='Добавить элемент в контейнер'
							sx={{ marginTop: '.5rem', width: 'fit-content' }}
						>
							<Button
								variant='text'
								size='small'
								color='success'
								onClick={() => setAddModalState(prev => !prev)}
							>
								<ControlPointIcon sx={{ fontSize: '2.25rem' }} />
								&nbsp; Добавить разделитель
							</Button>
						</OnyxTypography>

						<OnyxTypography
							component='div'
							ttFollow={false}
							ttPlacement='top'
							ttNode='Добавить элемент в контейнер'
							sx={{ marginTop: '.5rem', width: 'fit-content' }}
						>
							<Button
								variant='text'
								size='small'
								color='success'
								onClick={() => setAddModalState(prev => !prev)}
							>
								<ControlPointIcon sx={{ fontSize: '2.25rem' }} />
								&nbsp; Добавить пустой блок
							</Button>
						</OnyxTypography>
					</Stack>

					<ContentAddElemetModal state={addModalState} setState={setAddModalState} />
				</>
			)}
		</Stack>
	);
};

export default SectionContent;
