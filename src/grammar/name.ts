// tom-weatherhead/thaw-interpreter-core/src/grammar/name.ts

// import { ArgumentNullException } from '../exceptions/argument-null-exception';

export class Name {
	constructor(
		public readonly value: string,
		public readonly line = 0,
		public readonly column = 0
	) {
		if (!value) {
			// throw new ArgumentNullException('A Name cannot have a null or empty value', 'value');
			throw new Error('Name constructor: A Name cannot have a falsy value.');
		}
	}

	public toString(): string {
		return this.value;
	}
}
