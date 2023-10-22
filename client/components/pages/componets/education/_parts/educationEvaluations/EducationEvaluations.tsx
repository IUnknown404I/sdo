import { Grid } from '@mui/material';
import { EvaluationTable } from '../evaluationsTable/EvaluationsTable';

const evaluationData = [
	{
		id: 1,
		nameProp: 'Тема 1. Общие сведения о средствах индивидуальной защиты',
		typeProp: 'тестирование',
		statusProp: 'завершено',
		currTryProp: 2,
		maxTryProp: 2,
		gradeProp: 5,
		linkProp: '/events',
	},
	{
		id: 2,
		nameProp: 'Тема 2. Входной контроль при поставках средств индивидуальной защиты',
		typeProp: 'тестирование',
		statusProp: 'завершено',
		currTryProp: 1,
		maxTryProp: 2,
		gradeProp: 4,
		linkProp: '/events',
	},
	{
		id: 3,
		nameProp: 'Тема 3. Требования к составу сопроводительной документации, упаковке и маркировке СИЗ',
		typeProp: 'тестирование',
		statusProp: 'требуется пересдача',
		currTryProp: 1,
		maxTryProp: 2,
		gradeProp: 2,
		linkProp: '/events',
	},
	{
		id: 4,
		nameProp: 'Тема 4. Выявление нарушений при входном контроле СИЗ',
		typeProp: 'тестирование',
		statusProp: 'нет попыток',
		currTryProp: 0,
		maxTryProp: 2,
		gradeProp: 0,
		linkProp: '/events',
	},
	{
		id: 5,
		nameProp: 'Тема 5. Списание и утилизация средств индивидуальной защиты',
		typeProp: 'тестирование',
		statusProp: 'нет попыток',
		currTryProp: 0,
		maxTryProp: 2,
		gradeProp: 0,
		linkProp: '/events',
	},
	{
		id: 6,
		nameProp: 'Практическое занятие №1',
		typeProp: 'практическое занятие',
		statusProp: 'на проверке',
		currTryProp: 1,
		maxTryProp: 1,
		gradeProp: 0,
		linkProp: '/events',
	},
	{
		id: 7,
		nameProp: 'Практическое занятие №2',
		typeProp: 'практическое занятие',
		statusProp: 'на проверке',
		currTryProp: 1,
		maxTryProp: 1,
		gradeProp: 0,
		linkProp: '/events',
	},
	{
		id: 8,
		nameProp: 'Практическое занятие №3',
		typeProp: 'практическое занятие',
		statusProp: 'нет попыток',
		currTryProp: 0,
		maxTryProp: 1,
		gradeProp: 0,
		linkProp: '/events',
	},
	{
		id: 9,
		nameProp: 'Итоговая аттестация. Теоретическая часть',
		typeProp: 'тестирование',
		statusProp: 'нет попыток',
		currTryProp: 0,
		maxTryProp: 2,
		gradeProp: 0,
		linkProp: '/events',
	},
];

export const EducationEvaluations = () => {
	return (
		<>
			<Grid container>
				<Grid item xs={12} md={12} lg={12}>
					<EvaluationTable dataRows={evaluationData} />
				</Grid>
			</Grid>
		</>
	);
};
