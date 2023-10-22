import { Paper, Stack } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import useLoading from '../../../../../hooks/useLoading';
import { rtkApi } from '../../../../../redux/api';
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
	const [personalDataUpdate] = rtkApi.usePutPersonalMutation();
	const { data: userPersonal } = rtkApi.usePersonalQuery('');
	const { Loader, state: isLoading, setState: setIsLoading } = useLoading({ iconVariant: true });

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
			if (!checkForChanges(userPersonal || {}, values)) return;
			setIsLoading(prev => !prev);

			personalDataUpdate
				.call('', { ...values, avatar: userPersonal?.avatar })
				.then(res =>
					'data' in res &&
					'modifiedCount' in res.data &&
					res.data.modifiedCount === 1 &&
					'data' in res &&
					'matchedCount' in res.data &&
					res.data.matchedCount === 1
						? true
						: false,
				)
				.then(res => {
					//@ts-ignore
					if (!res) userPersonal !== undefined ? formik.setValues(userPersonal, false) : formik.resetForm();
					notification({
						type: res ? 'success' : 'error',
						message: res
							? 'Личные данные успешно изменены!'
							: 'Не удалось изменить личные данные. Обновите странице и попробуйте ещё раз.',
					});
				})
				.finally(() => setIsLoading(prev => !prev));
		},
	});

	React.useEffect(() => {
		if (userPersonal != null)
			formik.setValues({
				surname: userPersonal?.surname || '',
				name: userPersonal?.name || '',
				tel: userPersonal?.tel || '',
				company: userPersonal?.company || '',
				city: userPersonal?.city || '',
				position: userPersonal?.position || '',
			});
	}, [userPersonal]);

	return (
		<Paper sx={{ padding: '20px  30px', borderRadius: '20px' }}>
			<ProfileForm formik={formik} loadingState={isLoading} Loader={Loader} />
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
		if (newValues[key as keyof typeof initialValues] !== initialValues[key as keyof typeof initialValues]) {
			flag = true;
			break;
		}
	return flag;
}

export default ProfileInformationComponent;
