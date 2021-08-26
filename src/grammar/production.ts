// tom-weatherhead/thaw-grammar/src/grammar/production.ts

import { IEqualityComparable, IStringifiable } from 'thaw-common-utilities.ts';

import { GrammarSymbol, IProduction, ProductionRhsElementType } from 'thaw-interpreter-types';

// A user-defined type guard. See e.g. https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

// export
const typenameProduction = 'Production';

export function isProduction(obj: unknown): obj is IProduction {
	const otherProduction = obj as Production;
	const lhs = otherProduction.lhs;
	const rhs = otherProduction.rhs;
	// const num = otherProduction.num;

	return (
		typeof otherProduction !== 'undefined' &&
		otherProduction.typename === typenameProduction &&
		typeof lhs !== 'undefined' &&
		typeof lhs === 'number' &&
		typeof rhs !== 'undefined' &&
		rhs instanceof Array &&
		rhs.every((element: unknown) => typeof element === 'number' || typeof element === 'string') // &&
		// typeof num !== 'undefined' &&
		// typeof num === 'number'
	);
}

class Production implements IEqualityComparable, IProduction, IStringifiable {
	public readonly typename: string = typenameProduction;

	constructor(
		public readonly lhs: GrammarSymbol,
		public readonly rhs: ProductionRhsElementType[],
		private readonly num: number
	) {}

	public toString(): string {
		const lhsAsString: string = GrammarSymbol[this.lhs];
		const rhsAsString: string = this.rhs
			.map((s: ProductionRhsElementType) => {
				if (typeof s === 'string') {
					return s;
				} else {
					return GrammarSymbol[s];
				}
			})
			.join(' ');

		return `${this.num}: ${lhsAsString} -> ${rhsAsString}`;
	}

	public equals(other: unknown): boolean {
		const otherProduction = other as IProduction;

		if (
			!isProduction(other) ||
			this.lhs !== otherProduction.lhs ||
			this.rhs.length !== otherProduction.rhs.length
		) {
			//  || this.num !== otherProduction.num // Ignore the production number in this equality comparison.
			return false;
		}

		for (let i = 0; i < this.rhs.length; i++) {
			if (this.rhs[i] !== otherProduction.rhs[i]) {
				return false;
			}
		}

		return true;
	}

	public getRHSWithNoSemanticActions(): GrammarSymbol[] {
		return this.rhs
			.filter((s: ProductionRhsElementType) => typeof s !== 'string')
			.map((s: ProductionRhsElementType) => s as GrammarSymbol);
	}

	public stripOutSemanticActions(): IProduction {
		return new Production(this.lhs, this.getRHSWithNoSemanticActions(), this.num);
	}

	public containsSymbol(symbol: GrammarSymbol): boolean {
		return (
			this.lhs === symbol ||
			typeof this.rhs.find((s: ProductionRhsElementType) => s === symbol) !== 'undefined'
		);
	}
}

export function createProduction(
	lhs: GrammarSymbol,
	rhs: ProductionRhsElementType[],
	num = 0
): IProduction {
	return new Production(lhs, rhs, num);
}