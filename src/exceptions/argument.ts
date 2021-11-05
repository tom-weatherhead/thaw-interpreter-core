// tom-weatherhead/thaw-interpreter-core/src/exceptions/argument.ts

import { ExceptionBase } from './base';

export class ArgumentException extends ExceptionBase {
	// public readonly argumentName: string;

	constructor(message: string, public readonly argumentName: string, line = 0, column = 0) {
		super('ArgumentException', message, line, column);

		this.argumentName = argumentName;
	}
}
