import React from 'react';
import OnyxAlertModal from '../../../basics/OnyxAlertModal';
import { OnyxTypography } from '../../../basics/OnyxTypography';

interface ContentAddElemetModalI {
	modalTitle?: string;
	state: boolean;
	setState: React.Dispatch<React.SetStateAction<boolean>>;
	exclude?: {
		containers?: true;
		dividers?: true;
		lectures?: true;
		scorms?: true;
		documents?: true;
		links?: true;
	};
}

const ContentAddElemetModal = (props: ContentAddElemetModalI) => {
	const [] = React.useState();

	return (
		<OnyxAlertModal
			uncontrolled
			disableButton
			state={props.state}
			setState={props.setState}
			title={props.modalTitle || 'Добавление элемента'}
			width='800px'
		>
			<OnyxTypography tpSize='.85rem' tpColor='secondary'>
				Выберите элемент из списка, заполните необходимые поля и нажмите на кнопку &nbsp;Добавить элемент&nbsp;.
				После чего выбранный элемент будет добавлен в конец соответствующего контейнера.
			</OnyxTypography>
		</OnyxAlertModal>
	);
};

export default ContentAddElemetModal;
