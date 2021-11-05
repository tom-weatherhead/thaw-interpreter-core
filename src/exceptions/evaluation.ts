// tom-weatherhead/thaw-interpreter-core/src/exceptions/evaluation.ts

import { ExceptionBase } from './base';

export class EvaluationException extends ExceptionBase {
	constructor(message: string, line = 0, column = 0) {
		super('EvaluationException', message, line, column);
	}
}
