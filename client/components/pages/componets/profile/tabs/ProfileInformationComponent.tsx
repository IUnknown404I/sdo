import { Paper, Stack } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import useLoading from '../../../../../hooks/useLoading';
import { OnyxApiErrorResponseType, rtkApi } from '../../../../../redux/api';
import { useTypedSelector } from '../../../../../redux/hooks';
import { UserPersonalT } from '../../../../../redux/slices/user';
import { YUP_SCHEMA_HELPERS } from '../../../../../utils/yup/validationSchemaHelpers';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { notification } from '../../../../utils/notifications/Notification';
import ProfileForm from '../components/ProfileForm';

const profileValidationSchema = yup.object({
	surname: YUP_SCHEMA_HELPERS.SURNAME,
	name: YUP_SCHEMA_HELPERS.NAME,
	tel: YUP_SCHEMA_HELPERS.TEL,
	company: YUP_SCHEMA_HELPERS.COMPANY,
	city: YUP_SCHEMA_HELPERS.CITY,
	position: YUP_SCHEMA_HELPERS.POSITION,
});

const ProfileInformationComponent = () => {
	const userDTO = useTypedSelector(state => state.user);
	const { Loader, state: isLoading, setState: setIsLoading } = useLoading({ iconVariant: true });

	const { data: userPersonal } = rtkApi.usePersonalQuery('');
	const [personalDataUpdate] = rtkApi.usePutPersonalMutation();

	function fillFormData(personal?: UserPersonalT) {
		formik.setValues({
			surname: personal?.surname || '',
			name: personal?.name || '',
			tel: personal?.tel || '',
			company: personal?.company || '',
			city: personal?.city || '',
			position: personal?.position || '',
		});
	}

	const formik = useFormik({
		initialValues: {
			surname: userPersonal?.surname || '',
			name: userPersonal?.name || '',
			tel: userPersonal?.tel || '',
			company: userPersonal?.company || '',
			city: userPersonal?.city || '',
			position: userPersonal?.position || '',
		},
		validationSchema: profileValidationSchema,
		onSubmit: async values => {
			if (!checkForChanges(userPersonal || {}, values)) {
				notification({
					type: 'warning',
					message: 'Ещё не было внесено изменений в ваши персональные данные для сохранения.',
				});
				return;
			}
			setIsLoading(prev => !prev);

			personalDataUpdate
				.call('', { ...values, avatar: userPersonal?.avatar })
				.then(response => {
					if (typeof response === 'object' && 'error' in response)
						notification({
							message: (response.error as OnyxApiErrorResponseType).data?.message,
							type: 'error',
						});
					else
						notification({
							type: 'success',
							message: 'Персональные данные успешно изменены!',
						});
				})
				.catch(e => {
					if (!!e?.response?.data?.message)
						notification({
							message: e.response.data.message,
							type: 'error',
						});
					else
						notification({
							message:
								'Произошла ошибка в процессе изменения персональных данных! Обновите страницу и попробуйте ещё раз или обратитесь в техническу поддержку.',
							type: 'error',
						});
				})
				.finally(() => setIsLoading(prev => !prev));
		},
	});

	React.useEffect(() => {
		if (userPersonal != null) fillFormData(userPersonal);
	}, [userPersonal]);

	return (
		<Paper sx={{ padding: '20px  30px', borderRadius: '20px' }}>
			<ProfileForm
				formik={formik}
				Loader={Loader}
				loadingState={isLoading}
				onCancelEditingHandler={() => fillFormData(userPersonal)}
			/>
			<Stack sx={{ marginTop: '.75rem' }} direction='row' justifyContent='space-between' alignItems='center'>
				<OnyxTypography boxWrapper tpColor='darkgray' tpSize='1rem' boxWidth='fit-content'>
					Учетная запись создана: {userDTO.createdAt || 'не определено'}
				</OnyxTypography>
				<OnyxTypography boxWrapper tpColor='darkgray' tpSize='1rem' boxWidth='fit-content'>
					Последний вход: {userDTO.lastLoginIn || 'не определено'}
				</OnyxTypography>
			</Stack>
		</Paper>
	);
};

/**
 * @IUnknown404I Function for compairing states of objects for changes.
 * @param initialValues as initial data.
 * @param newValues as changed data.
 * @returns undefined if not valid data passed and boolean as a comparisson result.
 */
function checkForChanges(initialValues: UserPersonalT, newValues: UserPersonalT): boolean | undefined {
	if (Object.keys(initialValues).length == null || Object.keys(newValues).length == null) return undefined;

	let flag = false;
	const keysArray = Object.keys(newValues);
	for (let key of keysArray)
		if (
			newValues[key as keyof typeof initialValues] !== initialValues[key as keyof typeof initialValues] &&
			(initialValues[key as keyof typeof initialValues] === undefined
				? newValues[key as keyof typeof initialValues] !== ''
				: true)
		) {
			flag = true;
			break;
		}
	return flag;
}

export default ProfileInformationComponent;
