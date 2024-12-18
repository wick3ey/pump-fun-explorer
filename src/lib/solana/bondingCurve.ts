export type BondingCurveType = 'linear' | 'exponential';

export interface BondingCurveParams {
  type: BondingCurveType;
  basePrice: number;
  slope?: number;
  exponent?: number;
}

export class BondingCurve {
  private params: BondingCurveParams;

  constructor(params: BondingCurveParams) {
    this.params = params;
  }

  calculatePrice(supply: number): number {
    switch (this.params.type) {
      case 'linear':
        return this.params.basePrice + (this.params.slope || 0.0001) * supply;
      case 'exponential':
        return this.params.basePrice * Math.pow(supply, this.params.exponent || 1.5);
      default:
        return this.params.basePrice;
    }
  }

  calculateSupplyForPrice(targetPrice: number): number {
    switch (this.params.type) {
      case 'linear':
        return (targetPrice - this.params.basePrice) / (this.params.slope || 0.0001);
      case 'exponential':
        return Math.pow(targetPrice / this.params.basePrice, 1 / (this.params.exponent || 1.5));
      default:
        return 0;
    }
  }
}

export const createDefaultBondingCurve = (): BondingCurve => {
  return new BondingCurve({
    type: 'exponential',
    basePrice: 0.0001,
    exponent: 1.5
  });
};