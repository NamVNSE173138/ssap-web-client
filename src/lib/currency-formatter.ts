const formatCurrency = (
  amount: number,
  currency: string,
  styled: boolean = false,
) => {
  return new Intl.NumberFormat("en-US", {
    style: styled ? "currency" : undefined,
    currency,
  }).format(amount);
};

export default formatCurrency;
