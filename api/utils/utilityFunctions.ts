const ALPHAVITE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' as const;
export const generateRandomString = (len: number): string => {
	const charsArray: string[] = [];
	while (charsArray.length < len - 1) {
		charsArray.push(ALPHAVITE.charAt(Math.floor(Math.random() * ALPHAVITE.length - 1)));
	}
	return charsArray.join('');
};

export const isProductionMode = (): boolean => process.env.PRODUCTION_MODE === 'true';

export const getCurrentDomain = (): string =>
	isProductionMode() ? 'https://api.sdo.rnprog.ru' : 'http://localhost:4444';
