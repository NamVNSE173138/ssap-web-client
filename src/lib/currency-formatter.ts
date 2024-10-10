const formatCurrency = (amount: number, currency: string, styled: boolean = false) => {
    return new Intl.NumberFormat('vi-VN', {
        style: styled ? 'currency' : undefined,
        currency,
    }).format(amount);
};

export default formatCurrency;
