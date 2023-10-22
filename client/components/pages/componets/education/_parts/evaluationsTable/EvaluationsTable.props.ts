interface Evaluations {
	nameProp: string;
	typeProp: string;
	statusProp: string;
	currTryProp: number;
	maxTryProp: number;
	gradeProp: number;
	linkProp: string;
}
export interface IEvaluationTableProps {
	dataRows: Evaluations[];
}
