


export const generatePdfDefinition = (invoices) => {
    return {
        content: [
            { text: 'Invoice', style: 'header' },
            {
                table: {
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'Column 1', style: 'tableHeader' },
                            { text: 'Column 2', style: 'tableHeader' },
                            { text: 'Column 3', style: 'tableHeader' },
                            { text: 'Column 4', style: 'tableHeader' }
                        ],
                        ...invoices.map(invoice => [
                            invoice.field1,
                            invoice.field2,
                            invoice.field3,
                            invoice.field4
                        ])
                    ]
                },
                layout: {
                    fillColor: '#f3f8fa', // Light gray background for rows
                    hLineColor: '#e2e2e2', // Border color
                    vLineColor: '#e2e2e2'  // Border color
                }
            },
            {
                text: 'Thank you for your business',
                style: 'footer'
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                color: '#484b51',
                margin: [0, 20, 0, 20]
            },
            tableHeader: {
                fontSize: 12,
                bold: true,
                color: '#484b51',
                fillColor: '#dce9f0', // Light blue background
                margin: [0, 0, 0, 10]
            },
            footer: {
                margin: [0, 10, 0, 0],
                fontSize: 12,
                italics: true,
                color: '#728299'
            },
            textSecondary: {
                color: '#728299'
            }
        },
        defaultStyle: {
            font: 'Helvetica'
        }
    };
};