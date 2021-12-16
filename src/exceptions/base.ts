// tom-weatherhead/thaw-interpreter-core/src/exceptions/exception-base.ts

import { IStringifiable } from 'thaw-common-utilities.ts';

export abstract class ExceptionBase extends Error implements IStringifiable {
	public readonly str: string;
	public readonly line: number;
	public readonly column: number;

	protected constructor(typeName: string, message: string, line = 0, column = 0) {
		const lineAndColumnText =
			line > 0 && column > 0 ? ` at line ${line}, column ${column}` : '';
		const str = `${typeName}${lineAndColumnText}: ${message}`;

		super(str);

		this.str = str;
		this.line = line;
		this.column = column;
	}

	public override toString(): string {
		return this.str;
	}
}
