// tom-weatherhead/thaw-interpreter-core/src/grammar/name.ts

import { ArgumentException } from '../exceptions/argument';

export class Name {
	constructor(
		public readonly value: string,
		public readonly line = 0,
		public readonly column = 0
	) {
		if (!value) {
			throw new ArgumentException(
				'Name constructor: A Name cannot have a null or empty value',
				'value'
			);
		}
	}

	public toString(): string {
		return this.value;
	}
}
