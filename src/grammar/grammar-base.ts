// tom-weatherhead/thaw-interpreter-core/src/grammar/grammar-base.ts

import {
	GrammarSymbol,
	IGrammar,
	IProduction,
	IToken,
	LexicalAnalyzerSelector,
	LexicalState,
	ParserSelector,
	ProductionRhsElementType,
	SemanticStackType
} from 'thaw-interpreter-types';

import { Name } from './name';

import { createProduction } from './production';

import { GrammarException } from '../exceptions/grammar';

// TODO? :
// export abstract class GrammarBase<T> implements IGrammar { ... }
// where T is the base value type for the language; i.e.
// T = number for MinimalLanguage and Chapter1
// T = ISExpression for LISP
// Then semanticStack: Stack<IExpression<T>>

// TODO? We could move these two functions into a utilities.ts file.

export function isTerminalSymbol(gs: GrammarSymbol): boolean {
	return gs > GrammarSymbol.Dot && gs <= GrammarSymbol.terminalEOF;
}

export function isNonTerminalSymbol(gs: GrammarSymbol): boolean {
	return gs > GrammarSymbol.terminalEOF;
}

export abstract class GrammarBase implements IGrammar {
	public readonly terminals: GrammarSymbol[] = [];
	public readonly nonTerminals: GrammarSymbol[] = [];
	public readonly productions: IProduction[] = [];

	protected constructor(public readonly startSymbol: GrammarSymbol) {}

	// 'get' accessors:

	public abstract get languageName(): string;

	public get defaultLexicalAnalyzer(): LexicalAnalyzerSelector {
		return LexicalAnalyzerSelector.MidnightHack;
	}

	public get defaultParser(): ParserSelector {
		return ParserSelector.LL1;
	}

	public get selectorsOfCompatibleParsers(): ParserSelector[] {
		return [this.defaultParser];
	}

	public abstract executeSemanticAction(semanticStack: SemanticStackType, action: string): void;

	public tokenToSymbol(token: IToken): GrammarSymbol {
		const tokenValueAsString: string = token.tokenValue as string;

		switch (token.tokenType) {
			case LexicalState.tokenEOF:
				return GrammarSymbol.terminalEOF;
			case LexicalState.tokenIntLit:
				return GrammarSymbol.terminalIntegerLiteral;
			case LexicalState.tokenFltLit:
				return GrammarSymbol.terminalFloatLiteral;
			case LexicalState.tokenStrLit:
				return GrammarSymbol.terminalStringLiteral;
			case LexicalState.tokenPlus:
				return GrammarSymbol.terminalPlus;
			case LexicalState.tokenMinus:
				return GrammarSymbol.terminalMinus;
			case LexicalState.tokenMult:
				return GrammarSymbol.terminalMultiply;
			case LexicalState.tokenDiv:
				return GrammarSymbol.terminalDivide;
			case LexicalState.tokenEqual:
				return GrammarSymbol.terminalEquals;
			case LexicalState.tokenLess:
				return GrammarSymbol.terminalLessThan;
			case LexicalState.tokenGreater:
				return GrammarSymbol.terminalGreaterThan;
			case LexicalState.tokenLeftBracket:
				return GrammarSymbol.terminalLeftBracket;
			case LexicalState.tokenRightBracket:
				return GrammarSymbol.terminalRightBracket;
			case LexicalState.tokenApostrophe:
				return GrammarSymbol.terminalApostrophe;
			case LexicalState.tokenComma:
				return GrammarSymbol.terminalComma;
			case LexicalState.tokenDollar:
				return GrammarSymbol.terminalDollar;
			case LexicalState.tokenOctothorpe:
				return GrammarSymbol.terminalOctothorpe;
			case LexicalState.tokenIdent:
				switch (tokenValueAsString) {
					case 'define':
						return GrammarSymbol.terminalDefine;
					case 'if':
						return GrammarSymbol.terminalIf;
					case 'while':
						return GrammarSymbol.terminalWhile;
					case 'set':
						return GrammarSymbol.terminalSet;
					case 'begin':
						return GrammarSymbol.terminalBegin;
					case 'print':
						return GrammarSymbol.terminalPrint;
					case 'cond':
						return GrammarSymbol.terminalCond;
					case 'let':
						return GrammarSymbol.terminalLet;
					case 'let*':
						return GrammarSymbol.terminalLetStar;
					case 'random':
						return GrammarSymbol.terminalRandom;
					case 'pow':
						return GrammarSymbol.terminalPow;
					case 'exp':
						return GrammarSymbol.terminalExp;
					case 'ln':
						return GrammarSymbol.terminalLn;
					case 'sin':
						return GrammarSymbol.terminalSin;
					case 'cos':
						return GrammarSymbol.terminalCos;
					case 'tan':
						return GrammarSymbol.terminalTan;
					default:
						return GrammarSymbol.terminalID;
				}

			default:
				throw new GrammarException(
					`GrammarBase.tokenToSymbol() : No grammar symbol matches token ${
						token.tokenType
					} ${LexicalState[token.tokenType]} (value '${token.tokenValue}')`,
					token.line,
					token.column
				);
		}
	}

	public pushTokenOntoSemanticStack(
		semanticStack: SemanticStackType,
		tokenAsSymbol: GrammarSymbol,
		token: IToken
	): void {
		switch (tokenAsSymbol) {
			case GrammarSymbol.terminalID:
			case GrammarSymbol.terminalPrint:
			case GrammarSymbol.terminalPlus:
			case GrammarSymbol.terminalMinus:
			case GrammarSymbol.terminalMultiply:
			case GrammarSymbol.terminalDivide:
			case GrammarSymbol.terminalEquals:
			case GrammarSymbol.terminalLessThan:
			case GrammarSymbol.terminalGreaterThan:
			case GrammarSymbol.terminalLet:
			case GrammarSymbol.terminalLetStar:
			case GrammarSymbol.terminalRandom:
			case GrammarSymbol.terminalPow:
			case GrammarSymbol.terminalExp:
			case GrammarSymbol.terminalLn:
			case GrammarSymbol.terminalSin:
			case GrammarSymbol.terminalCos:
			case GrammarSymbol.terminalTan:
			case GrammarSymbol.terminalThrow:
				// case GrammarSymbol.terminalAtan2:
				// case GrammarSymbol.terminalFloor:
				// case GrammarSymbol.terminalStringLessThan:
				// case GrammarSymbol.terminalStrlen:
				// case GrammarSymbol.terminalSubstr:
				// case GrammarSymbol.terminalTypename:
				semanticStack.push(new Name(token.tokenValue as string, token.line, token.column));
				break;

			// case GrammarSymbol.terminalIntegerLiteral:
			// 	break;

			// case GrammarSymbol.terminalFloatLiteral:
			//     break;
			//
			// case GrammarSymbol.terminalStringLiteral:
			//     break;

			case GrammarSymbol.terminalLeftBracket:
			case GrammarSymbol.terminalRightBracket:
			case GrammarSymbol.terminalBegin:
			case GrammarSymbol.terminalCond:
			case GrammarSymbol.terminalDefine:
			case GrammarSymbol.terminalIf:
			case GrammarSymbol.terminalSet:
			case GrammarSymbol.terminalWhile:
			case GrammarSymbol.terminalEOF:
				// For these terminals, push nothing onto the semantic stack.
				break;

			default:
				throw new GrammarException(
					`pushTokenOntoSemanticStack() : Unexpected tokenAsSymbol ${GrammarSymbol[tokenAsSymbol]} (${tokenAsSymbol})`,
					token.line,
					token.column
				);
		}
	}

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

		for (const sym of [lhs, ...rhs]) {
			if (typeof sym !== 'number' /* || Number.isNaN(sym) */) {
				continue;
			}

			if (isTerminalSymbol(sym) && this.terminals.indexOf(sym) < 0) {
				this.terminals.push(sym);
			}

			if (isNonTerminalSymbol(sym) && this.nonTerminals.indexOf(sym) < 0) {
				this.nonTerminals.push(sym);
			}
		}
	}
}
