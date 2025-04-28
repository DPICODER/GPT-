const express = require('express');
const { gst_portal } = require('../models/gst_portal');  // Adjust path
const router = express.Router();
const { Op } = require("sequelize"); // Make sure to import Op

router.get('/plantView',async(req,res)=>{
    try {
        console.log("Rendering Gst View");
        
        res.render('gst_view');
    } catch (error) {
        console.log("Error :",error);
        console.log("Error :",error.message);
        console.log("Error :",error.stack);
    }
})
// Route to fetch data from server-side for DataTable
// Route to fetch data from server-side for DataTable
router.get('/getData', async (req, res) => {
    console.log("--- Raw Request Query ---");
    console.log(JSON.stringify(req.query, null, 2));

    try {
        // Direct access for core DataTables parameters
        const draw = req.query.draw;
        const start = req.query.start;
        const length = req.query.length;
        const globalSearchValue = req.query['search[value]'];
        const orderColumnIndexStr = req.query['order[0][column]'];
        const orderDirection = req.query['order[0][dir]'];

        // ***********************************************************
        // *** 1. Define Your Fixed Custom WHERE Conditions Here ***
        // ***********************************************************
        const customWhereConditions = {
            // invoice_no : "",
            // Replace with your actual column names from the gst_portal model
            // and the values you want to filter by permanently.
            // Examples:
            // plant_no: 'YOUR_SPECIFIC_PLANT_NUMBER', // e.g., only show records for plant '1234'
            // status_column: 'ACTIVE',              // e.g., only show records with status 'ACTIVE'
            // some_flag: true,

            // Add as many fixed conditions as you need.
            // If you have no fixed conditions, just leave it as an empty object: {}
        };
        console.log("Custom Fixed Conditions:", JSON.stringify(customWhereConditions));
        // ***********************************************************

        // --- Build Dynamic Where Clause from Global Search ---
        let dynamicSearchCondition = null; // Initialize search part

        if (globalSearchValue && globalSearchValue.trim() !== '') {
            const searchValue = `%${globalSearchValue}%`;
            const searchableDbColumns = [
                'po_no', 'gst_supplier', 'invoice_no', 'invoice_type', 'month',
                'plant_no', 'miro_no', 'migo_no'
                // Add other ACTUAL TEXT-BASED database column names here
            ];

            // This is the Op.or part for the search term across specified columns
            dynamicSearchCondition = {
                [Op.or]: searchableDbColumns.map(dbColumnName => ({
                    [dbColumnName]: {
                        [Op.like]: searchValue // Using basic, often case-insensitive LIKE
                    }
                }))
            };

            console.log(`--- Global Search ---`);
            console.log(`Searching for: ${globalSearchValue}`);
            console.log(`Dynamic Search Condition: ${JSON.stringify(dynamicSearchCondition, null, 2)}`);
        } else {
            console.log(`--- Global Search ---`);
            console.log(`No global search term provided.`);
        }
        // --- End Dynamic Where Clause ---


        // ***********************************************************
        // *** 2. Combine Custom Conditions and Dynamic Search     ***
        // ***********************************************************
        let finalWhereClause = {}; // Start with an empty clause

        const hasCustomConditions = Object.keys(customWhereConditions).length > 0;
        const hasDynamicSearch = dynamicSearchCondition !== null;

        if (hasCustomConditions && hasDynamicSearch) {
            // --- Both custom AND dynamic search exist: Combine with Op.and ---
            finalWhereClause = {
                [Op.and]: [
                    customWhereConditions,  // Your fixed conditions must be met
                    dynamicSearchCondition  // AND the dynamic search conditions must be met
                ]
            };
        } else if (hasCustomConditions) {
            // --- Only custom conditions exist ---
            finalWhereClause = customWhereConditions;
        } else if (hasDynamicSearch) {
            // --- Only dynamic search exists ---
            finalWhereClause = dynamicSearchCondition;
        }
        // If neither exists, finalWhereClause remains {} (finds all records)

        console.log(`Final WHERE Clause Sent to Sequelize: ${JSON.stringify(finalWhereClause, null, 2)}`);
        // ***********************************************************


        // --- Basic Sorting (using direct access parameters) ---
        // (Sorting logic remains the same as before)
        let orderClause = [['po_no', 'ASC']]; // Default order
        try {
            if (orderColumnIndexStr !== undefined && orderDirection) {
                const clientColumns = [
                    'po_no', 'gst_supplier', 'invoice_no', 'invoice_date', 'invoice_type',
                    'taxable_amount', 'state_tax', 'central_tax', 'total_amount', 'month',
                    'plant_no', 'miro_no', 'miro_year', 'migo_no', 'migo_year'
                ];
                const colIndex = parseInt(orderColumnIndexStr, 10);
                const direction = orderDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
                if (!isNaN(colIndex) && colIndex >= 0 && colIndex < clientColumns.length) {
                    const dbColumnToSort = clientColumns[colIndex];
                    orderClause = [[dbColumnToSort, direction]];
                } else {
                     console.warn(`Invalid column index received for sorting: ${orderColumnIndexStr}`);
                }
            }
        } catch (sortError) {
            console.error("Error processing sort parameters:", sortError);
        }
        console.log(`Applied ORDER BY: ${JSON.stringify(orderClause)}`);
        // --- End Basic Sorting ---


        // --- Database Query ---
        const totalRecords = await gst_portal.count({
             // Get total count respecting ONLY the fixed custom conditions
             // This ensures pagination works correctly relative to the base filtered set
             where: customWhereConditions
        });
        const recordsFiltered = await gst_portal.count({
            // Get filtered count respecting BOTH fixed AND dynamic search conditions
            where: finalWhereClause
        });

        const dataRows = await gst_portal.findAll({
             where: finalWhereClause, // *** Use the COMBINED finalWhereClause ***
             limit: parseInt(length) || 10,
             offset: parseInt(start) || 0,
             order: orderClause,
         });

        // console.log(`Query returned ${result.count} records (filtered).`); // Original log might be confusing now
        console.log(`Total records matching fixed conditions: ${totalRecords}`);
        console.log(`Records matching fixed AND search conditions: ${recordsFiltered}`);
        console.log(`Rows returned for current page: ${dataRows.length}`);
        // --- End Database Query ---


        // --- Send Response ---
        res.json({
            draw: parseInt(draw) || 0,
            recordsTotal: totalRecords,         // Total records matching your base fixed filter
            recordsFiltered: recordsFiltered,   // Total records after applying the DataTable search on top of the fixed filter
            data: dataRows,                     // The actual data rows for the current page
        });
        // --- End Send Response ---

    } catch (error) {
        console.error("Error in /getData route:", error);
        res.status(500).json({ error: 'Server error occurred.' });
    }
});

// ... (keep your /plantView and /exportData routes) ...

// Route to fetch data from server-side for DataTable
// router.get('/getData', async (req, res) => {
//     console.log("--- Raw Request Query ---");
//     console.log(JSON.stringify(req.query, null, 2)); // Keep this for debugging

//     try {
//         // Use direct access for core DataTables parameters
//         const draw = req.query.draw;
//         const start = req.query.start;
//         const length = req.query.length;
//         const globalSearchValue = req.query['search[value]']; // <-- Direct access
//         const orderColumnIndexStr = req.query['order[0][column]']; // <-- Direct access
//         const orderDirection = req.query['order[0][dir]']; // <-- Direct access

//         // --- Simplified Where Clause ---
//         let whereClause = {};

//         // Check if global search has a value using the direct access variable
//         if (globalSearchValue && globalSearchValue.trim() !== '') { // <-- Use direct variable
//             const searchValue = `%${globalSearchValue}%`; // Prepare search term for LIKE

//             // *** IMPORTANT: EDIT THIS LIST ***
//             const searchableDbColumns = [
//                 'po_no', 'gst_supplier', 'invoice_no', 'invoice_type', 'month',
//                 'plant_no', 'miro_no', 'migo_no'
//                 // Add other ACTUAL TEXT-BASED database column names here
//             ];

//             whereClause = {
//                 [Op.or]: searchableDbColumns.map(dbColumnName => ({
//                     [dbColumnName]: {
//                         [Op.like]: searchValue // Using basic, often case-insensitive LIKE
//                     }
//                 }))
//             };

//             console.log(`--- Simplified Search ---`);
//             console.log(`Searching for: ${globalSearchValue}`); // <-- Log the correct value
//             console.log(`Constructed WHERE: ${JSON.stringify(whereClause, null, 2)}`);
//         } else {
//             console.log(`--- Simplified Search ---`);
//             console.log(`No global search term provided.`);
//         }
//         // --- End Simplified Where Clause ---

//         // --- Basic Sorting (using direct access parameters) ---
//         let orderClause = [['po_no', 'ASC']]; // Default order
//         try {
//             // Check if direct access order parameters exist
//             if (orderColumnIndexStr !== undefined && orderDirection) { // <-- Use direct variables
//                 const clientColumns = [ // Keep this synchronized with your client-side table columns
//                     'po_no', 'gst_supplier', 'invoice_no', 'invoice_date', 'invoice_type',
//                     'taxable_amount', 'state_tax', 'central_tax', 'total_amount', 'month',
//                     'plant_no', 'miro_no', 'miro_year', 'migo_no', 'migo_year'
//                 ];
//                 const colIndex = parseInt(orderColumnIndexStr, 10);
//                 const direction = orderDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Sanitize direction
//                 if (!isNaN(colIndex) && colIndex >= 0 && colIndex < clientColumns.length) {
//                     const dbColumnToSort = clientColumns[colIndex];
//                     orderClause = [[dbColumnToSort, direction]];
//                 } else {
//                      console.warn(`Invalid column index received for sorting: ${orderColumnIndexStr}`);
//                 }
//             }
//         } catch (sortError) {
//             console.error("Error processing sort parameters:", sortError);
//             // Keep default order if error
//         }
//         // console.log(`Applied ORDER BY: ${JSON.stringify(orderClause)}`);
//         // --- End Basic Sorting ---

//         // --- Database Query ---
//         const totalRecords = await gst_portal.count();
//         const result = await gst_portal.findAndCountAll({
//             where: whereClause,
//             limit: parseInt(length) || 10,
//             offset: parseInt(start) || 0,
//             order: orderClause,
//         });
//         // console.log(`Query returned ${result.count} records (filtered).`);
//         // --- End Database Query ---

//         // --- Send Response ---
//         res.json({
//             draw: parseInt(draw) || 0,
//             recordsTotal: totalRecords,
//             recordsFiltered: result.count,
//             data: result.rows,
//         });
//         // --- End Send Response ---

//     } catch (error) {
//         console.error("Error in /getData route:", error);
//         res.status(500).json({ error: 'Server error occurred.' });
//     }
// });


// --- IMPORTANT: Add a new route for exporting data ---
router.get('/exportData', async (req, res) => {
    try {
        const { format } = req.query; // 'csv' or 'excel'
        const MAX_RECORDS = 5000; // Limit export size

        console.log(`Export requested for format: ${format}`);

        // Fetch data (similar logic to getData but without pagination)
        // NOTE: Add filtering logic here if you want exports to be filtered
        // For now, it fetches all (up to MAX_RECORDS)
        const records = await gst_portal.findAll({
            limit: MAX_RECORDS,
            // Add order clause if needed: order: [['id', 'ASC']],
            raw: true // Get plain JSON objects, easier for export libs
        });

        if (!records || records.length === 0) {
            return res.status(404).send('No data to export.');
        }

        // Dynamically get headers from the first record's keys
        const headers = Object.keys(records[0]);

        if (format === 'csv') {
            // Use a library like 'fast-csv'
            const { format: formatCsv } = require('@fast-csv/format');
            const csvStream = formatCsv({ headers: true });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');

            csvStream.pipe(res);
            records.forEach(record => csvStream.write(record));
            csvStream.end();

        } else if (format === 'excel') {
            // Use a library like 'exceljs' or 'node-xlsx'
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Export Data');

            worksheet.columns = headers.map(header => ({ header: header, key: header, width: 20 }));
            worksheet.addRows(records);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="export.xlsx"');

            await workbook.xlsx.write(res);
            res.end();

        } else {
            res.status(400).send('Invalid export format specified. Use "csv" or "excel".');
        }

    } catch (error) {
        console.error("Error exporting data:", error);
        res.status(500).send('Server error occurred during export.');
    }
});

module.exports = router;
