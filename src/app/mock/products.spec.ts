import { PRODUCTS } from './products';

describe('PRODUCTS mock data', () => {
  it('should contain 10 products', () => {
    expect(PRODUCTS.length).toBe(10);
  });

  it('should have unique, non-empty ids', () => {
    const ids = PRODUCTS.map((p) => p.id);
    const uniqueIds = new Set(ids);

    expect(ids.every((id) => !!id)).toBeTrue();
    expect(uniqueIds.size).toBe(PRODUCTS.length);
  });

  it('should have a positive price for every product', () => {
    expect(PRODUCTS.every((p) => p.price > 0)).toBeTrue();
  });

  it('should have a previousPrice that is either null or greater than the current price', () => {
    const valid = PRODUCTS.every(
      (p) => p.previousPrice === null || p.previousPrice > p.price
    );
    expect(valid).toBeTrue();
  });

  it('should have non-negative review counts', () => {
    expect(PRODUCTS.every((p) => p.reviews >= 0)).toBeTrue();
  });

  it('should have a name and description for every product', () => {
    expect(PRODUCTS.every((p) => !!p.name && !!p.description)).toBeTrue();
  });
});
