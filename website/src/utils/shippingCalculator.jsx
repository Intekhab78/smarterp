// utils/shippingCalculator.js

export function calculateShippingByWeight(totalWeightKg) {
    const weightGrams = totalWeightKg * 1000;

    if (weightGrams <= 50) return 47;
    if (weightGrams <= 250) return 63;
    if (weightGrams <= 500) return 82;

    const extraSlabs = Math.ceil((weightGrams - 500) / 500);
    return 82 + extraSlabs * 40; // ₹40 per extra 500g
}
