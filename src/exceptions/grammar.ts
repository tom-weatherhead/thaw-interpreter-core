// tom-weatherhead/thaw-interpreter-core/src/exceptions/grammar.ts

import { ExceptionBase } from './exception-base';

export class GrammarException extends ExceptionBase {
	constructor(message: string, line = 0, column = 0) {
		super('GrammarException', message, line, column);
	}
}
