interface IEvaluations {
	title: string;
	grade: number;
	try: number;
	maxTry: number;
	link: string;
}

export interface IEducationEvaluationProps {
	id: string;
	sectionTitle: string;
	evaluation: IEvaluations[];
}
