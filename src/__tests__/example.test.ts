// Test d'exemple pour vérifier que Jest est correctement configuré
describe('Example Test Suite', () => {
  it('should pass this test', () => {
    expect(true).toBe(true);
  });

  it('should add two numbers correctly', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(2, 3)).toBe(5);
  });
});
