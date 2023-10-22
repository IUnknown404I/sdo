import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkProductionMode } from '../../utils/utilityFunctions';

const clearCookiesLogic = async (req: NextApiRequest, res: NextApiResponse) => {
	res.removeHeader('Authorization');
	res.setHeader(
		'Set-Cookie',
		serialize('refreshToken', '', {
			// expires: -1,
			domain: checkProductionMode() ? 'api.sdo.rnprog.ru' : 'localhost',
			path: '/',
			secure: checkProductionMode() ? true : false,
			sameSite: 'lax',
			maxAge: -1000,
			httpOnly: true,
		}),
	);
	res.status(200).send('Refresh token cleared!');
};

export default clearCookiesLogic;
