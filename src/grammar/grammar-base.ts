// tom-weatherhead/thaw-interpreter-core/src/grammar/grammar-base.ts

import {
	GrammarSymbol,
	IGrammar,
	IProduction,
	IToken,
	ParserSelector,
	ProductionRhsElementType,
	SemanticStackType
} from 'thaw-interpreter-types';

import { createProduction } from './production';

import { GrammarException } from '../exceptions/grammar';

// TODO? :
// export abstract class GrammarBase<T> implements IGrammar { ... }
// where T is the base value type for the language; i.e.
// T = number for MinimalLanguage and Chapter1
// T = ISExpression for LISP
// Then semanticStack: Stack<IExpression<T>>

export abstract class GrammarBase implements IGrammar {
	public readonly terminals: GrammarSymbol[] = [];
	public readonly nonTerminals: GrammarSymbol[] = [];
	public readonly productions: IProduction[] = [];

	protected constructor(public readonly startSymbol: GrammarSymbol) {}

	public abstract get languageName(): string; // This is a 'get' accessor.

	public abstract get selectorsOfCompatibleParsers(): ParserSelector[]; // This is a 'get' accessor.

	public abstract executeSemanticAction(semanticStack: SemanticStackType, action: string): void;

	public abstract tokenToSymbol(token: IToken): GrammarSymbol;
	// public tokenToSymbol(token: Token): GrammarSymbol {

	// 	switch (token.tokenType)
	// 	{
	// 		case LexicalState.tokenEOF: return Symbol.terminalEOF;
	// 		case LexicalState.tokenIntLit: return Symbol.terminalIntegerLiteral;
	// 		case LexicalState.tokenFltLit: return Symbol.terminalFloatLiteral;
	// 		case LexicalState.tokenStrLit: return Symbol.terminalStringLiteral;
	// 		case LexicalState.tokenIdent: return Symbol.terminalID;
	// 		// case TokenType.T_Assign: return Symbol.T_Assign;
	// 		// case TokenType.T_Semicolon: return Symbol.T_Semicolon;
	// 		case LexicalState.tokenLeftBracket: return Symbol.terminalLeftBracket;
	// 		case LexicalState.tokenRightBracket: return Symbol.terminalRightBracket;
	// 		case LexicalState.tokenComma: return Symbol.terminalComma;
	// 		case LexicalState.tokenPlus: return Symbol.terminalPlus;
	// 		// case TokenType.T_Minus: return Symbol.T_Minus;

	// 		// Inference only.
	// 		// case TokenType.T_Exclamation: return Symbol.T_Exclamation;
	// 		// case TokenType.T_Variable: return Symbol.T_Variable;
	// 		// case TokenType.T_2OrBar: return Symbol.T_2OrBar;

	// 		default:
	// 			break;
	// 	}

	// 	throw new GrammarException(`No grammar symbol matches token ${token.tokenType} ${token.tokenValue}`);
	// }

	public abstract pushTokenOntoSemanticStack(
		semanticStack: SemanticStackType,
		tokenAsSymbol: GrammarSymbol,
		token: IToken
	): void;

	public findStartingProduction(): IProduction {
		const results: IProduction[] = [];

		for (const p of this.productions) {
			if (p.lhs === this.startSymbol) {
				const p2 = p.stripOutSemanticActions();

				if (p2.rhs.length > 0) {
					const lastObject = p2.rhs[p2.rhs.length - 1];

					if (lastObject === GrammarSymbol.terminalEOF) {
						results.push(p2);
					}
				}
			}
		}

		if (results.length !== 1) {
			throw new GrammarException(
				`GrammarBase.FindStartingProduction() : Expected one starting production; found ${results.length}.`
			);
		}

		return results[0];
	}

	// public removeProductionsContainingSymbol(symbol: number): void {
	// 	this.productions = this.productions.filter((production: Production) => !production.ContainsSymbol(symbol));
	// }

	protected addProduction(lhs: GrammarSymbol, rhs: ProductionRhsElementType[], n = NaN): void {
		this.productions.push(
			createProduction(lhs, rhs, Number.isNaN(n) ? this.productions.length + 1 : n)
		);
	}
}
