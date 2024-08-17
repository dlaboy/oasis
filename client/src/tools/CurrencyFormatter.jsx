
function CurrencyFormatter({ value, currency = 'USD', locale = 'en-US' }) {
    // Create an instance of Intl.NumberFormat configured for currency
    console.log("Type of number to be converted",typeof(value))
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    });

    // Format the value as currency
    const formattedValue = formatter.format(value);

    return <span>{formattedValue}</span>;
}

export default CurrencyFormatter