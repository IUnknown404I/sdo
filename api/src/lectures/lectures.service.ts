import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotValidDataError } from 'errors/NotValidDataError';
import { Model } from 'mongoose';
import { generateSectionElement } from 'src/courses/course-content-generator';
import {
	changeWidthOFCourseSectionElement,
	deleteElementFromSectionContent,
	duplicateItemInCourseSection,
	findElementInSectionContent,
	hideOrShowCourseSectionElement,
	pushElementInSectionContent,
} from 'src/courses/course-content-helpers';
import { checkCommonItemStyles } from 'src/courses/courses-content.service';
import {
	ContentItemLinksType,
	CourseSectionAnyElementType,
	CourseSectionBasicStylesI,
	CourseSectionCardI,
	CourseSectionCardStylesI,
	CourseSectionContainerI,
	CourseSectionItemDocumentI,
	CourseSectionItemHeaderI,
	CourseSectionItemImageStylesI,
	CourseSectionItemLinkI,
	CourseSectionItemsType,
	CourseSectionItemTextI,
	CourseSectionRowContainer,
	isContainersSubTypes,
	isContentItemLinksType,
	isCourseSectionAnyElementType,
	isCourseSectionCard,
	isCourseSectionContainerI,
	isCourseSectionDivider,
	isCourseSectionEmptyDivider,
	isCourseSectionItemDocument,
	isCourseSectionItemHeader,
	isCourseSectionItemImage,
	isCourseSectionItemLecture,
	isCourseSectionItemLink,
	isCourseSectionItemScorm,
	isCourseSectionItemText,
	isCourseSectionRowContainer,
	isCourseSectionTest,
	isDividersSubTypes,
	SectionAnyItemsSubTypes,
} from 'src/courses/courses.types';
import { Lecture, LecturesDocument } from './lectures.schema';

export type LectureItemDetectParamsT = { cslid: string; csiid: string };
const STANDART_LECTURE_PROJECTION = { _id: 0 } as const;

@Injectable()
export class LecturesService {
	constructor(@InjectModel(Lecture.name, 'onyxDB') private lecturesModel: Model<LecturesDocument>) {}

	async getLecture(cslid: string): Promise<Lecture> {
		return this.lecturesModel.findOne({ cslid }, STANDART_LECTURE_PROJECTION);
	}

	async getAllLectures(): Promise<Lecture[]> {
		return this.lecturesModel.find({}, STANDART_LECTURE_PROJECTION);
	}

	async getAllLectureCategories(): Promise<string[]> {
		return Array.from(new Set((await this.lecturesModel.find()).map(lecture => lecture.category)));
	}

	async getLecturesStructure(category?: string): Promise<Lecture[]> {
		if (!category)
			return this.lecturesModel.find(
				{ $or: [{ category: undefined }, { category: '' }, { category: '/' }] },
				STANDART_LECTURE_PROJECTION,
			);
		return this.lecturesModel.find({ category: category.trim() }, STANDART_LECTURE_PROJECTION);
	}

	async createLectureElement(payload: {
		cslid: string;
		type: CourseSectionItemsType;
		subType: SectionAnyItemsSubTypes;
		linkType?: ContentItemLinksType;
		containerID?: string;
	}): Promise<{ result: true }> {
		let { lectureData, lectureContent } = await this.getLectureContent(payload.cslid);
		// check validity of passed container
		const containerData = findElementInSectionContent(lectureContent, payload.containerID) as
			| CourseSectionContainerI
			| CourseSectionRowContainer;
		// check found container
		if (
			(!!payload.containerID && !containerData) ||
			(!!containerData &&
				!(isCourseSectionContainerI(containerData) || isCourseSectionRowContainer(containerData)))
		)
			throw new NotValidDataError('Предоставлен невалидный идентификатор контейнера!');
		// check for container's max-volume overflowing
		if (!!containerData) {
			if (containerData.subType === 'row' && containerData.content.length >= 2)
				throw new NotValidDataError(
					'Контейнер заполнен! Для строковых контейнеров максимальное количество элементов должно быть равно 2!',
				);
			else if (containerData.subType === 'row' && isDividersSubTypes(payload.subType))
				throw new NotValidDataError(
					'Операция отменена! Запрещено добавлять элементы-разделители в строковые контейнеры!',
				);
		}
		// check for valid types for root elements
		if (!payload.containerID) {
			if (
				(!isContainersSubTypes(payload.subType) && !isDividersSubTypes(payload.subType)) ||
				payload.subType === 'course'
			)
				throw new NotValidDataError('Создание запрещенного элемента в рамках запрошенного контейнера!');
		}

		// generate the new Content-Object
		const lectureContentCopy = lectureContent.slice();
		if (!lectureContentCopy?.length)
			lectureContentCopy.push(
				generateSectionElement(payload.type, payload.subType, payload.linkType, {
					orderNumber: 1,
				}),
			);
		else
			pushElementInSectionContent(
				generateSectionElement(payload.type, payload.subType, payload.linkType, {
					parentCsiid: payload.containerID,
				}),
				lectureContentCopy,
				payload.containerID,
			);

		return await this.updateLectureContent({ lectureData, lectureContent: lectureContentCopy });
	}

	async activationLectureElement(cslid: string, csiid: string): Promise<{ result: true }> {
		if (!cslid || !csiid)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		const { lectureData, lectureContent } = await this.getLectureContent(cslid);
		hideOrShowCourseSectionElement(csiid, lectureContent);
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async widthChangeLectureElement(cslid: string, csiid: string, width: number): Promise<{ result: true }> {
		if (!cslid || !csiid || !width)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		const { lectureData, lectureContent } = await this.getLectureContent(cslid);
		changeWidthOFCourseSectionElement(csiid, width, lectureContent);
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async duplicateLectureElement(cslid: string, csiid: string): Promise<{ result: true }> {
		if (!cslid || !csiid)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		const { lectureData, lectureContent } = await this.getLectureContent(cslid);
		duplicateItemInCourseSection(csiid, lectureContent);
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async deleteLectureElement(cslid: string, csiid: string): Promise<{ result: true }> {
		if (!cslid || !csiid)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		let { lectureData, lectureContent } = await this.getLectureContent(cslid);
		return await this.updateLectureContent({
			lectureData,
			lectureContent: deleteElementFromSectionContent(csiid, lectureContent),
		});
	}

	async moveUpDownLectureElement(cslid: string, csiid: string, direction: 'up' | 'down'): Promise<{ result: true }> {
		if (!cslid || !csiid || !direction)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		let { lectureData, lectureContent } = await this.getLectureContent(cslid);
		const { element, parent } = findElementInSectionContent(lectureContent, csiid, true);
		if (!element) throw new NotValidDataError('Предоставлен невалидный идентификатор элемента контента!');
		if (!!parent && !(isCourseSectionContainerI(parent) || isCourseSectionRowContainer(parent)))
			throw new NotValidDataError(
				'Родителем выбранного элемента определён невалидный объект. Операция отменена.',
			);
		if (element.orderNumber === 1 && direction === 'up')
			throw new NotValidDataError(`Элемент уже находится в начале ${!!parent ? 'контейнера' : 'списка'}!`);
		if (
			element.orderNumber ===
				(!!parent ? (parent as CourseSectionContainerI).content.length : lectureContent.length) &&
			direction === 'down'
		)
			throw new NotValidDataError(`Элемент уже находится в конце ${!!parent ? 'контейнера' : 'списка'}!`);

		// move element and recalc the order of lecture's content
		const oldOrderNumber = element.orderNumber;
		const newOrderNumber = element.orderNumber + (direction === 'up' ? -1 : 1);
		if (!!parent) {
			const deletedElement = (parent as CourseSectionContainerI).content.splice(oldOrderNumber - 1, 1)[0];
			(parent as CourseSectionContainerI).content.splice(newOrderNumber - 1, 0, deletedElement);
			(parent as CourseSectionContainerI).content = (parent as CourseSectionContainerI).content.map(
				(element, index) => ({ ...element, orderNumber: index + 1 }),
			);
		} else {
			const deletedElement = lectureContent.splice(oldOrderNumber - 1, 1)[0];
			lectureContent.splice(newOrderNumber - 1, 0, deletedElement);
			lectureContent = lectureContent.map((element, index) => ({ ...element, orderNumber: index + 1 }));
		}

		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async moveOutLectureElement(cslid: string, csiid: string): Promise<{ result: true }> {
		if (!cslid || !csiid)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		let { lectureData, lectureContent } = await this.getLectureContent(cslid);
		const { element, parent } = findElementInSectionContent(lectureContent, csiid, true);
		if (!element) throw new NotValidDataError('Предоставлен невалидный идентификатор элемента контента!');
		if (!parent)
			throw new NotValidDataError('Выбранный элемент уже находится на вернхнем уровне вложенности контента!');
		if (!(isCourseSectionContainerI(parent) || isCourseSectionRowContainer(parent)))
			throw new NotValidDataError(
				'Родителем выбранного элемента определён невалидный объект. Операция отменена.',
			);
		const { parent: upperParent } = findElementInSectionContent(lectureContent, parent.csiid, true);

		if (!!upperParent) {
			if (!(isCourseSectionContainerI(upperParent) || isCourseSectionRowContainer(upperParent)))
				throw new NotValidDataError(
					'Родителем контейнера выбранного элемента определён невалидный объект. Операция отменена.',
				);
			if (
				isCourseSectionRowContainer(upperParent) &&
				(isCourseSectionDivider(element) || isCourseSectionEmptyDivider(element))
			)
				throw new NotValidDataError('В строковых контейнерах запрещено размещать разделители!');

			const deletedElement = (parent as CourseSectionContainerI | CourseSectionRowContainer).content.splice(
				element.orderNumber - 1,
				1,
			)[0];
			(parent as CourseSectionContainerI | CourseSectionRowContainer).content.forEach((element, index) => ({
				...element,
				orderNumber: index + 1,
			}));

			upperParent.content.splice(parent.orderNumber === 0 ? 0 : parent.orderNumber - 1, 0, {
				...deletedElement,
				parentCsiid: upperParent.csiid,
			});
			upperParent.content = upperParent.content.map((element, index) => ({
				...element,
				orderNumber: index + 1,
			}));
		} else {
			if (
				!(
					isCourseSectionContainerI(element) ||
					isCourseSectionRowContainer(element) ||
					isCourseSectionDivider(element) ||
					isCourseSectionEmptyDivider(element)
				)
			)
				throw new NotValidDataError(
					'На верхнем уровне разрешено размещение только контейнеров или разделителей! Операция отменена.',
				);
			const deletedElement = (parent as CourseSectionContainerI | CourseSectionRowContainer).content.splice(
				element.orderNumber - 1,
				1,
			)[0];
			(parent as CourseSectionContainerI | CourseSectionRowContainer).content.forEach((element, index) => ({
				...element,
				orderNumber: index + 1,
			}));

			lectureContent.splice(parent.orderNumber === 0 ? 0 : parent.orderNumber - 1, 0, {
				...deletedElement,
				parentCsiid: '',
			});
			lectureContent = lectureContent.map((element, index) => ({ ...element, orderNumber: index + 1 }));
		}

		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async moveTOLectureElement(cslid: string, csiid: string, targetID: string): Promise<{ result: true }> {
		if (!cslid || !csiid || !targetID)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		let { lectureData, lectureContent } = await this.getLectureContent(cslid);
		const { element, parent } = findElementInSectionContent(lectureContent, csiid, true);
		if (!element) throw new NotValidDataError('Предоставлен невалидный идентификатор элемента контента!');
		const targetContainer = findElementInSectionContent(lectureContent, targetID);
		if (
			!targetContainer ||
			!(isCourseSectionContainerI(targetContainer) || isCourseSectionRowContainer(targetContainer))
		)
			throw new NotValidDataError('Предоставлен невалидный идентификатор целевого контейнера!');
		if (isCourseSectionRowContainer(targetContainer)) {
			if (targetContainer.content.length >= 2)
				throw new NotValidDataError(
					'Целевой строковый контейнер уже заполнен! Строковые контейнеры не могут содержать больше 2-ух элементов.',
				);
			if (isCourseSectionDivider(element) || isCourseSectionEmptyDivider(element))
				throw new NotValidDataError('В строковых контейнерах запрещено размещать разделители!');
		}

		// delete element and recalc section's order
		let deletedElement: undefined | CourseSectionAnyElementType = undefined;
		if (!!parent) {
			if (!(isCourseSectionContainerI(parent) || isCourseSectionRowContainer(parent)))
				throw new NotValidDataError(
					'Родителем выбранного элемента определён невалидный объект. Операция отменена.',
				);
			deletedElement = parent.content.splice(element.orderNumber - 1, 1)[0];
			parent.content = parent.content.map((element, index) => ({
				...element,
				orderNumber: index + 1,
			}));
		} else {
			deletedElement = lectureContent.splice(element.orderNumber - 1, 1)[0];
			lectureContent = lectureContent.map((element, index) => ({
				...element,
				orderNumber: index + 1,
			}));
		}

		// move to target container
		if (isCourseSectionAnyElementType(deletedElement))
			(targetContainer.content as CourseSectionAnyElementType[]).push({
				...deletedElement,
				parentCsiid: targetContainer.csiid,
			});

		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async updateLectureContainer(
		payload: LectureItemDetectParamsT & {
			hide: boolean;
			centered: boolean;
			elevation: number;
			borderWidth: number;
			borderColor: string;
			borderStyle: string;
		},
	): Promise<{ result: true }> {
		if (typeof payload.hide !== 'boolean') throw new NotValidDataError('Передан некорректный тип атрибута width!');
		if (typeof payload.centered !== 'boolean')
			throw new NotValidDataError('Передан некорректный тип атрибута centered!');
		if (typeof payload.elevation !== 'number')
			throw new NotValidDataError('Передан некорректный тип атрибута elevation!');
		if (typeof payload.borderWidth !== 'number')
			throw new NotValidDataError('Передан некорректный тип атрибута borderWidth!');
		if (typeof payload.borderColor !== 'string')
			throw new NotValidDataError('Передан некорректный тип атрибута borderColor!');
		if (typeof payload.borderStyle !== 'string')
			throw new NotValidDataError('Передан некорректный тип атрибута borderStyle!');

		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);
		if (!isCourseSectionContainerI(element) && !isCourseSectionRowContainer(element))
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');

		element.hide = payload.hide;
		element.styles.centered = payload.centered;
		element.styles.elevation = payload.elevation;
		element.styles.borderColor = payload.borderColor;
		element.styles.borderStyle = payload.borderStyle;
		element.styles.borderWidth = payload.borderWidth;
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async editLectureCardMedia(payload: LectureItemDetectParamsT & { mdid: string }): Promise<{ result: true }> {
		if (!payload.cslid || !payload.csiid)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		if (!payload.mdid || typeof payload.mdid !== 'string')
			throw new NotValidDataError('Передан некорректное значение ключа медиа-контента!');

		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);
		if (!isCourseSectionCard(element))
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');

		element.mdid = payload.mdid;
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async editLectureLink(
		payload: LectureItemDetectParamsT & {
			basis: number;
			title: string;
			linkType: CourseSectionItemLinkI['linkType'];
			href: string;
			styles: CourseSectionItemLinkI['styles'];
		},
	): Promise<{ result: true }> {
		if (!payload.cslid || !payload.csiid || !payload.styles)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		if (!payload.linkType || !isContentItemLinksType(payload.linkType))
			throw new NotValidDataError('Передан некорректное значение типа ссылочного элемента!');
		if (!payload.title || typeof payload.title !== 'string')
			throw new NotValidDataError('Передан некорректный заголовок!');
		if (!payload.href || typeof payload.href !== 'string')
			throw new NotValidDataError('Передан некорректная ссылка!');
		checkCommonItemStyles(payload.styles);

		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);
		if (!isCourseSectionItemLink(element))
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');

		element.basis = payload.basis;
		element.title = payload.title;
		element.linkType = payload.linkType;
		element.href = payload.href;
		element.styles = payload.styles;
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async editLectureCardParams(
		payload: LectureItemDetectParamsT & {
			params: Pick<CourseSectionCardI, 'href' | 'target' | 'header' | 'text'>;
			styles: CourseSectionCardStylesI;
			basis?: number;
		},
	): Promise<{ result: true }> {
		if (!payload.cslid || !payload.csiid || !payload.params || !payload.styles)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		if (!payload.params.header || typeof payload.params.header !== 'string')
			throw new NotValidDataError('Передан некорректное значение заголовка!');
		if (!payload.params.text || typeof payload.params.text !== 'string')
			throw new NotValidDataError('Передан некорректное текстовое содержание!');
		if (payload.styles.imageHeight === undefined || typeof payload.styles.imageHeight !== 'number')
			throw new NotValidDataError('Передан некорректный тип атрибута высоты изображения!');
		checkCommonItemStyles(payload.styles);

		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);
		if (!isCourseSectionCard(element))
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');

		element.header = payload.params.header;
		element.text = payload.params.text;
		element.href = payload.params.href;
		element.target = payload.params.target;
		element.styles = payload.styles;
		if (payload.basis !== undefined && typeof payload.basis === 'number') element.basis = payload.basis;
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async editLectureDocumentScormLectureOrTestParams(
		type: 'doc' | 'scorm' | 'lecture' | 'test',
		payload: LectureItemDetectParamsT & {
			basis: number;
			title: string;
			styles: Omit<CourseSectionBasicStylesI, 'elevation'>;
		},
	): Promise<{ result: true }> {
		if (!type || !payload.cslid || !payload.csiid || !payload.basis || !payload.styles)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		if (!payload.basis || typeof payload.basis !== 'number')
			throw new NotValidDataError('Передан некорректное текстовое содержание!');
		checkCommonItemStyles(payload.styles);

		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);
		try {
			if (type === 'doc' && !isCourseSectionItemDocument(element)) throw new Error();
			if (type === 'scorm' && !isCourseSectionItemScorm(element)) throw new Error();
			if (type === 'lecture' && !isCourseSectionItemLecture(element)) throw new Error();
			if (type === 'test' && !isCourseSectionTest(element)) throw new Error();
		} catch (_) {
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');
		}

		(element as CourseSectionItemDocumentI).title = payload.title;
		(element as CourseSectionItemDocumentI).styles = payload.styles;
		if (payload.basis !== undefined && typeof payload.basis === 'number')
			(element as CourseSectionItemDocumentI).basis = payload.basis;
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async editLectureDocumentScormLectureOrTestSource(
		type: 'doc' | 'scorm' | 'lecture' | 'test',
		payload: LectureItemDetectParamsT & {
			id: string;
		},
	): Promise<{ result: true }> {
		if (!payload.cslid || !payload.csiid || !payload.id || typeof payload.id !== 'string')
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);

		try {
			if (type === 'doc') {
				if (!isCourseSectionItemDocument(element)) throw new Error();
				element.docid = payload.id;
			}
			if (type === 'scorm') {
				if (!isCourseSectionItemScorm(element)) throw new Error();
				element.scid = payload.id;
			}
			if (type === 'lecture') {
				if (!isCourseSectionItemLecture(element)) throw new Error();
				element.cslid = payload.id;
			}
			if (type === 'test') {
				if (!isCourseSectionTest(element)) throw new Error();
				element.tid = payload.id;
			}
		} catch (_) {
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');
		}
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async editLectureMedia(
		payload: LectureItemDetectParamsT & {
			basis: number;
			preview: boolean;
			styles: CourseSectionItemImageStylesI;
		},
	): Promise<{ result: true }> {
		if (!payload.cslid || !payload.csiid || !payload.basis || !payload.styles)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		if (!payload.basis || typeof payload.basis !== 'number')
			throw new NotValidDataError('Передан некорректное текстовое содержание!');
		if (!!payload.styles.backgroundColor && typeof payload.styles.backgroundColor !== 'string')
			throw new NotValidDataError('Передан некорректный тип атрибута фонового цвета!');
		checkCommonItemStyles(payload.styles);

		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);
		if (!isCourseSectionItemImage(element))
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');

		element.styles = payload.styles;
		element.preview = payload.preview;
		if (payload.basis !== undefined && typeof payload.basis === 'number') element.basis = payload.basis;
		if (!payload.styles.backgroundColor) delete element.styles.backgroundColor;
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async editLectureMediaSource(
		payload: LectureItemDetectParamsT & {
			mdid: string;
		},
	): Promise<{ result: true }> {
		if (!payload.cslid || !payload.csiid || !payload.mdid || typeof payload.mdid !== 'string')
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);
		if (!isCourseSectionItemImage(element))
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');

		element.mdid = payload.mdid;
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async updateLectureHeaderElement(
		payload: LectureItemDetectParamsT & {
			title: string;
			styles: CourseSectionItemHeaderI['styles'];
		},
	): Promise<{ result: true }> {
		if (!payload.cslid || !payload.csiid)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		if (!!payload.styles.fullwidth && typeof payload.styles.fullwidth !== 'boolean')
			throw new NotValidDataError('Передан некорректный тип атрибута width!');
		checkCommonItemStyles(payload.styles);

		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);
		if (!isCourseSectionItemHeader(element))
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');

		element.title = payload.title;
		element.styles.fullwidth = payload.styles.fullwidth;
		if (!!element.styles.fullwidth) element.basis = 100;
		element.styles.color = payload.styles.color;
		element.styles.borderColor = payload.styles.borderColor;
		element.styles.borderStyle = payload.styles.borderStyle;
		element.styles.borderWidth = payload.styles.borderWidth;
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	async updateLectureTextBlockElement(
		payload: LectureItemDetectParamsT & {
			content?: string;
			styles?: CourseSectionItemTextI['styles'];
		},
	): Promise<{ result: true }> {
		if (!payload.cslid || !payload.csiid)
			throw new NotValidDataError('Переданые невалидные данные для удаления элемента контента!');
		if (!payload.content && !payload.styles)
			throw new NotValidDataError('Не переданы обновлённые параметры текстового блока для изменения!');
		if (
			!!payload.content &&
			(payload.content.includes('<script') ||
				payload.content.includes('alert(') ||
				payload.content.includes('prompt(') ||
				payload.content.includes('send(') ||
				payload.content.includes('<iframe') ||
				payload.content.includes('XMLHttpRequest(') ||
				payload.content.includes('<embed') ||
				payload.content.includes('fetch(') ||
				payload.content.includes('<html') ||
				payload.content.includes('<body'))
		)
			throw new UnauthorizedException(
				'Зафиксирована попытка внедрения вредоносного контента! Действия пользователя были записаны в журнал защиты.',
			);
		if (!!payload.styles) {
			if (!!payload.styles.width && typeof payload.styles.width !== 'number')
				throw new NotValidDataError('Передан некорректный тип атрибута width!');
			checkCommonItemStyles(payload.styles);
		}

		const { lectureData, lectureContent, element } = await this.getLectureContentElement(
			payload.cslid,
			payload.csiid,
		);
		if (!isCourseSectionItemText(element))
			throw new NotValidDataError('Запрос на изменение невалидного по типу элемента.');

		if (!!payload.content) element.content = payload.content;
		if (!!payload.styles) {
			element.styles.width = payload.styles.width;
			element.styles.color = payload.styles.color;
			element.styles.borderColor = payload.styles.borderColor;
			element.styles.borderStyle = payload.styles.borderStyle;
			element.styles.borderWidth = payload.styles.borderWidth;
		}
		return await this.updateLectureContent({ lectureData, lectureContent });
	}

	/**
	 * @throws NotValidDataError if the passed data is invalid (couldn't find the element or upper parents).
	 * @IUnknown404I Finds out the element within the passed keys for course section content.
	 * @returns object with course data, section content, found element and boolean isAdditionalsSectionsData returned.
	 */
	private async getLectureContentElement(
		cslid: string,
		csiid: string,
	): Promise<{
		lectureData: Lecture;
		lectureContent: CourseSectionAnyElementType[];
		element: CourseSectionAnyElementType;
	}> {
		const { lectureData, lectureContent } = await this.getLectureContent(cslid);
		const element = findElementInSectionContent(lectureContent, csiid);
		if (!element) throw new NotValidDataError('Предоставлен невалидный идентификатор элемента контента!');
		return { lectureData, lectureContent, element };
	}

	/**
	 * @throws NotValidDataError if the passed data is invalid (couldn't find the course os section).
	 * @IUnknown404I Finds out the section and course contents.
	 * @returns object with course data, section content and boolean isAdditionalsSectionsData returned.
	 */
	private async getLectureContent(cslid: string): Promise<{
		lectureData: Lecture;
		lectureContent: Array<CourseSectionAnyElementType>;
	}> {
		if (!cslid) throw new NotValidDataError('Передан некорректный идентификатор лекции!');
		const lectureData = await this.getLecture(cslid);
		if (!lectureData) throw new NotValidDataError('Предоставлен невалидный идентификатор лекции!');
		return { lectureData, lectureContent: lectureData.content?.slice() ?? [] };
	}

	private async updateLectureContent(payload: {
		lectureData: Lecture;
		lectureContent: CourseSectionAnyElementType[];
	}): Promise<{ result: true }> {
		if (!payload.lectureData || !payload.lectureContent || !Array.isArray(payload.lectureContent))
			throw new NotValidDataError('Передан некорректный идентификатор лекции!');
		await this.lecturesModel.updateOne({ cslid: payload.lectureData.cslid }, { content: payload.lectureContent });
		return { result: true };
	}
}
