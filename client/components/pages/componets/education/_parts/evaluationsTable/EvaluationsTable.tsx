import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Button, Chip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Stack } from '@mui/system';
import * as React from 'react';
import { useState } from 'react';
import OnyxImage from '../../../../../basics/OnyxImage';
import OnyxLink from '../../../../../basics/OnyxLink';
import { IEvaluationTableProps } from './EvaluationsTable.props';

interface Column {
	id: 'nameEv' | 'typeEv' | 'statusEv' | 'attemptsEv' | 'gradeEv' | 'linkEv';
	label: string;
	minWidth?: number;
	align?: 'left' | 'right' | 'center';
	format?: (value: number) => string;
}

const templateNameEv = (nameProp: string, typeProp: string) => {
	if (typeProp === 'тестирование') {
		return (
			<Stack direction={'row'} spacing={2} alignItems={'center'}>
				<OnyxImage src='/icons/tests.svg' alt='1' width='50px' height='50px' />
				<Typography variant='body1' width={'100%'}>
					{nameProp}
				</Typography>
			</Stack>
		);
	} else if (typeProp === 'практическое занятие') {
		return (
			<Stack direction={'row'} spacing={2} alignItems={'center'}>
				<OnyxImage src='/icons/caret.svg' alt='1' width='50px' height='50px' />
				<Typography variant='body1' width={'100%'}>
					{nameProp}
				</Typography>
			</Stack>
		);
	}
};

const templateTypeEv = (typeProp: string) => {
	return <Chip size={'small'} label={typeProp} />;
};

const templateStatusEv = (statusProp: string) => {
	if (statusProp === 'завершено') {
		return <Chip size={'small'} icon={<TaskAltIcon />} label={statusProp} color='success' />;
	} else if (statusProp === 'на проверке') {
		return <Chip size={'small'} icon={<HourglassEmptyOutlinedIcon />} label={statusProp} color='info' />;
	} else if (statusProp === 'требуется пересдача') {
		return <Chip size={'small'} icon={<ErrorOutlineOutlinedIcon />} label={statusProp} color='error' />;
	} else if (statusProp === 'нет попыток') {
		return <Chip size={'small'} icon={<DoNotDisturbOnOutlinedIcon />} label={statusProp} color='default' />;
	} else {
		return <Chip size={'small'} icon={<DoNotDisturbOnOutlinedIcon />} label={statusProp} color='default' />;
	}
};

const templateAttemptsEv = (currTryProp: number, maxTryProp: number) => {
	return (
		<Typography variant='body1' width={'100%'}>
			{currTryProp} из {maxTryProp}
		</Typography>
	);
};
const templateGradeEv = (gradeProp: number) => {
	return (
		<Typography variant={'body1'} fontWeight={'bold'} color={gradeProp < 3 ? 'red' : 'green'}>
			{gradeProp < 2 ? (
				<Typography variant='inherit' color={'gray'}>
					-
				</Typography>
			) : (
				gradeProp
			)}
		</Typography>
	);
};
const templateLinkEv = (linkProp: string) => {
	return (
		<OnyxLink href={linkProp} blockElement>
			<Button variant={'text'} size={'small'}>
				перейти
			</Button>
		</OnyxLink>
	);
};

const createDataRow = (
	nameProp: string,
	typeProp: string,
	statusProp: string,
	currTryProp: number,
	maxTryProp: number,
	gradeProp: number,
	linkProp: string,
) => {
	const nameEv = templateNameEv(nameProp, typeProp);
	const typeEv = templateTypeEv(typeProp);
	const statusEv = templateStatusEv(statusProp);
	const attemptsEv = templateAttemptsEv(currTryProp, maxTryProp);
	const gradeEv = templateGradeEv(gradeProp);
	const linkEv = templateLinkEv(linkProp);

	return { nameEv, typeEv, statusEv, attemptsEv, gradeEv, linkEv };
};

export const EvaluationTable = ({ dataRows }: IEvaluationTableProps) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const columns: readonly Column[] = [
		{ id: 'nameEv', label: 'Наименование', minWidth: 170 },
		{ id: 'typeEv', label: 'Форма контроля', minWidth: 100, align: 'right' },
		{ id: 'statusEv', label: 'Статус', minWidth: 100, align: 'left' },
		{
			id: 'attemptsEv',
			label: 'Попытки',
			minWidth: 170,
			align: 'center',
			format: (value: number) => value.toLocaleString('en-US'),
		},

		{
			id: 'gradeEv',
			label: 'Оценка',
			minWidth: 170,
			align: 'center',
			format: (value: number) => value.toLocaleString('en-US'),
		},

		{
			id: 'linkEv',
			label: 'Ссылка',
			minWidth: 100,
			align: 'right',
			format: (value: number) => value.toFixed(2),
		},
	];
	const rows = dataRows.map(el => {
		return createDataRow(
			el.nameProp,
			el.typeProp,
			el.statusProp,
			el.currTryProp,
			el.maxTryProp,
			el.gradeProp,
			el.linkProp,
		);
	});

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '20px', padding: '10px' }}>
			<TableContainer sx={{ maxHeight: 440, borderRadius: '20px' }}>
				<Table stickyHeader aria-label='sticky table'>
					<TableHead>
						<TableRow>
							{columns.map(column => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
							return (
								<TableRow hover role='checkbox' tabIndex={-1} key={index}>
									{columns.map(column => {
										const value = row[column.id];
										return (
											<TableCell key={column.id} align={column.align}>
												{column.format && typeof value === 'number'
													? column.format(value)
													: value}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component='div'
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};
