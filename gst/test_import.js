const fs = require('fs');
const readline = require('readline');
const sequelize = require('./config/database'); // adjust if needed
const { gst_portal } = require('./models/gst_portal'); // adjust the path
const BATCH_SIZE = 1000; // You can tune this depending on your DB

async function importCSV(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let rows = [];
    let isHeader = true;
    let insertedRows = 0;

    for await (const line of rl) {
        if (isHeader) {
            isHeader = false;
            continue; // Skip header
        }

        const fields = line.split(',');

        const rowObj = {
            po_no: BigInt(fields[0]),
            gst_supplier: fields[1],
            invoice_no: fields[2],
            invoice_date: fields[3],
            invoice_type: fields[4],
            taxable_amount: parseFloat(fields[5]),
            state_tax: parseFloat(fields[6]),
            central_tax: parseFloat(fields[7]),
            total_amount: parseFloat(fields[8]),
            month: fields[9],
            plant_no: parseInt(fields[10]),
            miro_no: BigInt(fields[11]),
            miro_year: parseInt(fields[12]),
            migo_no: BigInt(fields[13]),
            migo_year: parseInt(fields[14]),
        };

        rows.push(rowObj);

        if (rows.length >= BATCH_SIZE) {
            await gst_portal.bulkCreate(rows);
            insertedRows += rows.length;
            console.log(`✅ Inserted ${insertedRows} rows...`);
            rows = []; // Clear after insert
        }
    }

    // Insert any remaining rows
    if (rows.length > 0) {
        await gst_portal.bulkCreate(rows);
        insertedRows += rows.length;
        console.log(`✅ Inserted total ${insertedRows} rows (final batch).`);
    }

    console.log(`🎯 Done! Total rows inserted: ${insertedRows}`);
}

// MAIN
async function main() {
    try {
        await sequelize.authenticate().then(()=>{
            sequelize.sync().then(()=>console.log("Sync Success")
            )
        });
        console.log('🔌 Database connection established successfully.');

        await importCSV('test_data.csv'); // Adjust path if needed

        await sequelize.close();
        console.log('🔒 Database connection closed.');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
