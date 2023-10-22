import { Button, Divider, Paper, Stack } from '@mui/material';
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/hooks';
import AuthThunks from '../../../../../redux/thunks/auth';
import OnyxLink from '../../../../basics/OnyxLink';
import { OnyxTypography } from '../../../../basics/OnyxTypography';

type NavigatorWithUserAgentDataT = Navigator & {
	userAgentData: { brands?: Array<{ brand: string; version: string }>; mobile?: boolean; platform?: string };
};

const ProfileSecurityComponent = () => {
	const dispatcher = useTypedDispatch();
	const userData = useTypedSelector(store => store.user);

	const { brands, mobile, platform } = !!(navigator as NavigatorWithUserAgentDataT).userAgentData
		? (navigator as NavigatorWithUserAgentDataT).userAgentData
		: { brands: undefined, mobile: undefined, platform: undefined };
	const browser = !!brands && brands.length > 0 ? brands[brands.length - 1] : undefined;

	return (
		<Paper sx={{ padding: '20px  30px', borderRadius: '20px' }}>
			<Stack direction='column' gap={0} sx={{ '> hr': { margin: '.75rem 0' } }}>
				<OnyxTypography text='Статус учетной записи.' tpColor='secondary' />
				<SystemLine text={'Учетная запись активирована, без ограничений'} marginTop='.5rem' />
				<Divider sx={{ width: '100%' }} />

				<OnyxTypography
					text='Анализ браузера и системы. Рекомендуем к использованию Chrome и Яндекс браузеры.'
					tpColor='secondary'
				/>
				<Stack direction='column' gap={1}>
					<SystemLine
						text={`Система пользователя: ${platform || 'не удалось определить'}`}
						color={!!platform ? (platform.toLowerCase().includes('android') ? 'red' : 'green') : 'orange'}
						marginTop='.5rem'
					/>
					<SystemLine
						text={`Используемый браузер: ${
							!!browser
								? `${
										browser.brand.toLowerCase().includes('yabrowser') ||
										browser.brand.toLowerCase().includes('yandex')
											? 'Яндекс Браузер'
											: browser.brand
								  }, версия ${browser.version}`
								: 'не удалось определить'
						}`}
						color={
							!!browser
								? browser.brand.toLowerCase().includes('yabrowser') ||
								  browser.brand.toLowerCase().includes('chrome')
									? 'green'
									: 'red'
								: 'orange'
						}
					/>
					<SystemLine
						text={`Мобильная версия: ${
							mobile !== undefined
								? mobile
									? 'запущена мобильная версия'
									: 'запущена стандартна версия'
								: 'не удалось определить'
						}`}
						color={mobile !== undefined ? (!!mobile ? 'red' : 'green') : 'orange'}
					/>
				</Stack>
				<Divider sx={{ width: '100%' }} />

				<OnyxLink href='mailto:u2610272@mrgeng.ru' target='_blank' rel='norefferer' fullwidth>
					<Button variant='contained' sx={{ marginTop: '.75rem' }} fullWidth>
						связаться с технической поддержкой
					</Button>
				</OnyxLink>
				<Button
					variant='outlined'
					sx={{ marginTop: '.75rem', marginBottom: '.75rem' }}
					onClick={() => dispatcher(AuthThunks.disconnect())}
				>
					выйти из учетной записи
				</Button>

				{userData.lastFingerprints != null && (
					<>
						<Divider sx={{ width: '100%', marginTop: '1rem' }} />
						<OnyxTypography
							text={`Отпечаток системы: ${userData.lastFingerprints}`}
							tpColor='secondary'
							tpSize='.75rem'
							boxWrapper
							boxAlign='center'
						/>
					</>
				)}
			</Stack>
		</Paper>
	);
};

function SystemLine(payload: { text: string; color?: ColoredCircleColors; marginTop?: string }) {
	return (
		<Stack alignItems='center' direction='row' gap={2} sx={{ marginTop: payload.marginTop, fontSize: '1.1rem' }}>
			<ColoredCircle color={payload.color} />
			<OnyxTypography text={payload.text} tpSize='inherit' />
		</Stack>
	);
}

type ColoredCircleColors = 'green' | 'orange' | 'red';
function ColoredCircle(payload: { color?: ColoredCircleColors }) {
	return (
		<div
			style={{
				backgroundColor:
					payload.color === undefined || payload.color === 'green'
						? 'green'
						: payload.color === 'red'
						? 'red'
						: 'orange',
				width: '12px',
				height: '12px',
				borderRadius: '50%',
			}}
		/>
	);
}

export default ProfileSecurityComponent;
