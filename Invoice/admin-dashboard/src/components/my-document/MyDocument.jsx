import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  invoiceInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textRight: {
    textAlign: 'right',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    padding: 8,
  },
  tableHeader: {
    backgroundColor: 'rgb(31 93 129 / 92%)',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  tableCellLeft: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: 5,
  },
  totalRow: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
  },
  totalText: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
});

const MyDocument = ({ invoices }) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Section 1: Invoice Info */}
        <View style={styles.section}>
          <Text style={styles.header}>Invoice ID: #53211</Text>
          <View style={styles.invoiceInfo}>
            <View>
              <Text>Invoice for</Text>
              <Text>ID: #53211</Text>
              <Text>To: Mike Olaski</Text>
              <Text>Company: asdf</Text>
              <Text>Location: Slovakia</Text>
            </View>
            <View style={styles.textRight}>
              <Text>Payable to</Text>
              <Text>Name: Mirza Ovinnoor</Text>
              <Text>Agency: CFS - Code For Site</Text>
              <Text>Location: Bangladesh</Text>
              <Text>Issue Date: August 9, 2024</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Project Info */}
        <View style={styles.section}>
          <Text style={styles.header}>Project: BAY</Text>
        </View>

        {/* Section 3: Hours and Rates Table */}
        <View style={styles.section}>
          <View style={[styles.table, styles.tableHeader]}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>#</Text>
              <Text style={styles.tableCellLeft}>Memo</Text>
              <Text style={styles.tableCell}>Hours</Text>
              <Text style={styles.tableCell}>Hourly Rate</Text>
              <Text style={styles.tableCell}>Amount</Text>
            </View>
          </View>

          {invoices?.map((invoice, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{index}</Text>
              <Text style={styles.tableCellLeft}>{invoice.memo}</Text>
              <Text style={styles.tableCell}>{invoice.hours}</Text>
              <Text style={styles.tableCell}>${invoice.hourlyRate}</Text>
              <Text style={styles.tableCell}>${(invoice.hours * invoice.hourlyRate)}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.tableCell}>42.33</Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}>$301.32</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
