const { faker } = require('@faker-js/faker');
const fs = require('fs');

const rowsToGenerate = 5000; // Change to 10000 or whatever you want
const outputFile = 'test_data.csv';

const invoiceTypes = ['Goods', 'Services'];
const plantNumbers = [100, 200, 300, 400, 500]; // Example plants

function randomGstNumber() {
    const stateCode = faker.number.int({ min: 10, max: 35 }).toString().padStart(2, '0');
    const chars = faker.string.alpha({ length: 5, casing: 'upper' });
    const digits = faker.number.int({ min: 1000, max: 9999 }).toString();
    const endChar = faker.string.alpha({ length: 1, casing: 'upper' });
    const suffix = '1Z' + faker.number.int({ min: 1, max: 9 }).toString();
    return stateCode + chars + digits + endChar + suffix;
}


function generateRow() {
    const taxableAmount = parseFloat(faker.finance.amount(1000, 50000, 2));
    const stateTax = parseFloat((taxableAmount * 0.09).toFixed(2));
    const centralTax = parseFloat((taxableAmount * 0.09).toFixed(2));
    const totalAmount = parseFloat((taxableAmount + stateTax + centralTax).toFixed(2));
    const invoiceDate = faker.date.between({ from: '2023-01-01', to: '2025-04-01' });
    const month = invoiceDate.toLocaleString('default', { month: 'long' });

    return [
        faker.number.int({ min: 4500000000, max: 4599999999 }), // po_no
        randomGstNumber(), // gst supplier
        'INV' + faker.number.int({ min: 20230000, max: 20259999 }), // invoice_no
        invoiceDate.toISOString().split('T')[0], // invoice_date
        faker.helpers.arrayElement(['Goods', 'Services']), // invoice type
        taxableAmount,
        stateTax,
        centralTax,
        totalAmount,
        month,
        faker.helpers.arrayElement([100, 200, 300, 400, 500]), // plant_no
        faker.number.int({ min: 6000000000, max: 6999999999 }), // miro_no
        invoiceDate.getFullYear(), // miro_year
        faker.number.int({ min: 5000000000, max: 5999999999 }), // migo_no
        invoiceDate.getFullYear() // migo_year
    ];
}


// Create CSV header
const headers = [
    'po_no', 'gst_supplier', 'invoice_no', 'invoice_date', 'invoice_type',
    'taxable_amount', 'state_tax', 'central_tax', 'total_amount',
    'month', 'plant_no', 'miro_no', 'miro_year', 'migo_no', 'migo_year'
];

function main() {
    const writeStream = fs.createWriteStream(outputFile);
    writeStream.write(headers.join(',') + '\n');

    for (let i = 0; i < rowsToGenerate; i++) {
        const row = generateRow().join(',');
        writeStream.write(row + '\n');
    }

    writeStream.end(() => {
        console.log(`✅ Successfully generated ${rowsToGenerate} rows in ${outputFile}`);
    });
}

main();
